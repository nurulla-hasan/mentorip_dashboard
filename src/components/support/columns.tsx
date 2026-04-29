"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { 
  Mail, 
  Phone, 
  CheckCircle2,
  Clock,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { SupportTicket } from "@/types/support.types";
import { ReplyMessageModal } from "./ReplyMessageModal";

const ActionCell = ({ ticket }: { ticket: SupportTicket }) => {
  return (
    <div className="flex items-center justify-end gap-2 px-1">
      <ReplyMessageModal ticket={ticket} />
    </div>
  );
};

export const supportColumns: ColumnDef<SupportTicket>[] = [
  {
    accessorKey: "index",
    header: "S.L",
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
    meta: {
      headerClassName: "w-[60px]",
    },
  },
  {
    accessorKey: "name",
    header: "User Details",
    cell: ({ row }) => {
      const { name, email, phone } = row.original;
      return (
        <div className="flex flex-col gap-1 py-1">
          <span className="font-semibold text-foreground leading-none">{name}</span>
          <div className="flex flex-col gap-0.5 mt-1">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Mail className="h-3 w-3 shrink-0" />
              <span className="truncate max-w-45">{email}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Phone className="h-3 w-3 shrink-0" />
              <span>{phone}</span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "subject",
    header: "Subject & Message",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1 max-w-75">
        <span className="font-medium text-sm text-foreground truncate">{row.original.subject}</span>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed italic">
          &quot;{row.original.message}&quot;
        </p>
      </div>
    ),
  },
  {
    accessorKey: "isReplied",
    header: "Status",
    cell: ({ row }) => (
      <Badge 
        variant={row.original.isReplied ? "default" : "secondary"}
        className={`rounded-full px-3 py-0.5 flex items-center gap-1.5 w-fit border-none ${
          row.original.isReplied 
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" 
            : "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
        }`}
      >
        {row.original.isReplied ? (
          <>
            <CheckCircle2 className="h-3 w-3" />
            Replied
          </>
        ) : (
          <>
            <Clock className="h-3 w-3" />
            Pending
          </>
        )}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Received At",
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">
          {format(new Date(row.original.createdAt), "MMM dd, yyyy")}
        </span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
          {format(new Date(row.original.createdAt), "hh:mm a")}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right pr-4">Actions</div>,
    cell: ({ row }) => <ActionCell ticket={row.original} />,
    enableSorting: false,
  },
];
