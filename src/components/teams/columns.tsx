"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Team } from "@/types/team.types";
import { deleteOurTeam } from "@/services/team";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import { UpdateTeamModal } from "./UpdateTeamModal";
import { DeleteConfirmModal } from "../ui/custom/delete-confirm";

const TeamActionCell = ({ team }: { team: Team }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteOurTeam(team._id);
      if (res.success) {
        SuccessToast("Team member deleted successfully!");
        setOpen(false);
      } else {
        ErrorToast(res.message || "Failed to delete team member");
      }
    } catch (error) {
      console.error(error);
      ErrorToast("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2 px-1">
      <UpdateTeamModal
        initialData={team}
        trigger={
          <Button
            variant="ghost"
            size="icon"
            title="Edit"
            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
          >
            <Edit className="h-4 w-4" />
          </Button>
        }
      />

      <DeleteConfirmModal
        title="Delete Member?"
        description={`This will permanently delete ${team.name}.`}
        open={open}
        onOpenChange={setOpen}
        onDelete={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export const teamsColumns: ColumnDef<Team>[] = [
  {
    accessorKey: "image",
    header: "Photo",
    cell: ({ row }) => {
      const image = row.getValue("image") as string;
      return (
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <Image
            src={image || "/placeholder.png"}
            alt={row.original.name}
            fill
            className="object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "designation",
    header: "Designation",
  },
  {
    accessorKey: "expertises",
    header: "Expertises",
    cell: ({ row }) => {
      const expertises = row.getValue("expertises") as string[];
      const expertisesString = expertises.join(", ");
      const maxLength = 50;

      if (expertisesString.length <= maxLength) {
        return <span className="text-sm text-muted-foreground">{expertisesString}</span>;
      }

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-sm text-muted-foreground cursor-help">
                {expertisesString.slice(0, maxLength)}...
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{expertisesString}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right pr-4">Actions</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right">
          <TeamActionCell team={row.original} />
        </div>
      );
    },
    enableSorting: false,
  },
];
