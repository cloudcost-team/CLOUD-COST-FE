"use client";

import { useState, type FormEvent } from "react";
import type { AlertChannel } from "@/api/alerts";
import { Badge } from "@/components/ui/Badge";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { Switch } from "@/components/ui/Switch";
import { Toast } from "@/components/ui/Toast";
import {
  useAlertChannels,
  useCreateAlertChannel,
  useDeleteAlertChannel,
  useTestAlertChannel,
  useUpdateAlertChannel,
} from "@/hooks/useAlerts";
import { trackEvent } from "@/lib/analytics";

function ChannelRow({ channel }: { channel: AlertChannel }) {
  const update = useUpdateAlertChannel();
  const test = useTestAlertChannel();
  const remove = useDeleteAlertChannel();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sentToastOpen, setSentToastOpen] = useState(false);
  const error = update.error ?? remove.error;
  const testFailure =
    test.error?.message ??
    (test.data?.ok === false
      ? `보내지 못했어요. ${test.data.reason ?? ""}`
      : null);

  return (
    <li className="flex flex-col gap-gap-small border-b border-border-weak py-padding-medium first:pt-0 last:border-b-0 last:pb-0">
      <div className="flex flex-wrap items-center gap-gap-medium">
        <Badge tone="brand">{channel.typeLabel}</Badge>
        <p className="min-w-0 flex-1 truncate text-subtext-large text-text-strong">
          {channel.target}
        </p>
        <Button
          variant="assistive"
          size="small"
          loading={test.isPending}
          onClick={() =>
            test.mutate(channel.channelId, {
              onSuccess: (result) => setSentToastOpen(result.ok),
            })
          }
        >
          테스트 발송
        </Button>
        <Button
          variant="assistive"
          size="small"
          onClick={() => setConfirmOpen(true)}
        >
          삭제
        </Button>
        <Switch
          aria-label={`${channel.typeLabel} 알림 받기`}
          checked={channel.enabled}
          onCheckedChange={(enabled) =>
            update.mutate({
              channelId: channel.channelId,
              request: { enabled },
            })
          }
          disabled={update.isPending}
        />
      </div>
      {testFailure && (
        <p role="alert" className="text-subtext-medium text-text-danger">
          {testFailure}
        </p>
      )}
      {error && (
        <p role="alert" className="text-subtext-medium text-text-danger">
          {error.message}
        </p>
      )}
      <Toast
        open={sentToastOpen}
        onClose={() => setSentToastOpen(false)}
        tone="success"
        text="테스트 메시지를 보냈어요. Discord 채널을 확인해 보세요."
      />
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() =>
          remove.mutate(channel.channelId, {
            onSettled: () => setConfirmOpen(false),
          })
        }
        title="이 채널을 삭제할까요?"
        description="이 채널로 보낸 기록도 함께 지워져요. 받은 알림은 그대로 남아요."
        tone="danger"
        confirmLabel="삭제"
        confirmLoading={remove.isPending}
      />
    </li>
  );
}

function AddChannelForm({ full }: { full: boolean }) {
  const [webhookUrl, setWebhookUrl] = useState("");
  const create = useCreateAlertChannel();
  const trimmed = webhookUrl.trim();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!trimmed) return;
    create.mutate(trimmed, {
      onSuccess: () => {
        setWebhookUrl("");
        trackEvent("alert_channel_register");
      },
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-gap-small">
      <Input
        label="Discord 웹훅 주소"
        placeholder="https://discord.com/api/webhooks/…"
        inputMode="url"
        autoComplete="off"
        value={webhookUrl}
        onChange={(event) => setWebhookUrl(event.currentTarget.value)}
        helperText={
          full
            ? "채널을 더 등록하려면 기존 채널을 삭제해 주세요."
            : "Discord 채널 설정 → 연동 → 웹후크에서 주소를 복사해 붙여 넣어 주세요."
        }
        error={create.error?.message}
        disabled={full}
      />
      <Button
        type="submit"
        size="medium"
        className="self-end"
        loading={create.isPending}
        disabled={full || !trimmed}
      >
        등록
      </Button>
    </form>
  );
}

function AlertChannelBody() {
  const { data, isPending, isError, error, refetch } = useAlertChannels();

  if (isPending) return <Skeleton shape="block" className="h-30 w-full" />;
  if (isError)
    return (
      <Banner
        title="알림 채널을 불러오지 못했어요"
        description={error.message}
        action={{ label: "다시 시도", onClick: () => refetch() }}
      />
    );
  return (
    <>
      {data.items.length > 0 && (
        <ul className="flex flex-col">
          {data.items.map((channel) => (
            <ChannelRow key={channel.channelId} channel={channel} />
          ))}
        </ul>
      )}
      <AddChannelForm full={data.items.length >= data.maxChannels} />
    </>
  );
}

export function AlertChannelCard() {
  return (
    <Card title="외부 알림 채널">
      <p className="text-subtext-medium text-text-tertiary">
        새 알림이 생기면 Discord 채널로도 보내 드려요. 등록한 뒤에 생긴 알림부터
        보내요.
      </p>
      <AlertChannelBody />
    </Card>
  );
}
