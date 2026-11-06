import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client";
import { loginDemo } from "@/api/demo";

const TEST_API_BASE_URL = "https://api.cloudcost.test/api/v1";

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", TEST_API_BASE_URL);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("체험 로그인 API", () => {
  it("API 주소가 없으면 외부 요청 전에 설정 오류를 알린다", async () => {
    vi.unstubAllEnvs();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      loginDemo({ username: "cloudcost", password: "1234" }),
    ).rejects.toThrow(
      "NEXT_PUBLIC_API_BASE_URL 환경변수가 설정되지 않았습니다.",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("아이디와 비밀번호를 계약 필드명 그대로 전달한다", async () => {
    const account = {
      dataSource: "demo",
      accountId: "00000000-0000-4000-8000-00000000d3e0",
      name: "체험용 AWS 계정",
      awsAccountId: "123456789012",
      region: "ap-northeast-2",
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify(account), { status: 200 }),
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      loginDemo({ username: "cloudcost", password: "1234" }),
    ).resolves.toEqual(account);
    expect(fetchMock).toHaveBeenCalledWith(
      `${TEST_API_BASE_URL}/demo/login`,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ username: "cloudcost", password: "1234" }),
      }),
    );
  });

  it("실패 응답의 코드와 메시지를 보존한다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: {
              code: "DEMO_LOGIN_FAILED",
              message: "아이디 또는 비밀번호가 맞지 않습니다.",
            },
          }),
          { status: 401 },
        ),
      ),
    );

    await expect(
      loginDemo({ username: "cloudcost", password: "wrong" }),
    ).rejects.toEqual(
      new ApiError(
        "아이디 또는 비밀번호가 맞지 않습니다.",
        401,
        "DEMO_LOGIN_FAILED",
      ),
    );
  });
});
