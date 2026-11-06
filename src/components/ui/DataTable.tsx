import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type DataTableColumn<T> = {
  key: string;
  header: ReactNode;
  className?: string;
  align?: "left" | "right";
  render: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  isRowDimmed?: (row: T) => boolean;
  caption?: string;
  className?: string;
};

const cellPadding = "px-gap-small first:pl-padding-large last:pr-padding-large";

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  isRowDimmed,
  caption,
  className,
}: DataTableProps<T>) {
  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-large border border-border-default bg-background-default",
        className,
      )}
    >
      <table className="w-full border-collapse">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead className="bg-fill-neutral-weak">
          <tr className="border-b border-border-weak">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  "h-11 text-subtext-medium font-normal whitespace-nowrap text-text-tertiary",
                  column.align === "right" ? "text-right" : "text-left",
                  cellPadding,
                  column.className,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={getRowKey(row)}
              className={cn(
                "border-b border-border-weak last:border-b-0",
                isRowDimmed?.(row) && "opacity-60",
              )}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    "h-15 text-subtext-large text-text-strong",
                    column.align === "right" ? "text-right" : "text-left",
                    cellPadding,
                    column.className,
                  )}
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
