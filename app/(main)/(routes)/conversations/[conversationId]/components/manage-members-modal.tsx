"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Gavel, Loader2, MoreVertical, ShieldPlus } from "lucide-react";

import { useRouter } from "next/navigation";
import { UserAvatar } from "@/app/components/user-avatar";
import clsx from "clsx";
import axios from "axios";
import toast from "react-hot-toast";
import useConversation from "@/app/hooks/useConversation";
import { useModal } from "@/app/hooks/useModal";

const ManageMembers = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data } = useModal();
  const { conversation } = data;
  const isModalOpen = isOpen && type === "manageMembers";
  const { conversationId } = useConversation();

  const [loadingId, setLoadingId] = useState("");

  const onRemove = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const response = await axios.patch(
        `/api/conversations/${conversationId}/remove`,
        {
          userId: memberId,
        }
      );

      if (response?.data?.success === true) {
        toast.success(response?.data?.message);
        onClose();
        router.refresh();
      }
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        // This error is an instance of AxiosError
        toast.error(error?.response?.data?.message);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setLoadingId("");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-primary overflow-hidden">
        <DialogHeader className="pt-2 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500">
            {conversation?.users?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-5 max-h-[420px] pr-6">
          {conversation?.users?.map((member) => (
            <div key={member.id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar user={member!} />

              <div className="text-xs font-semibold flex items-center gap-x-1 text-gray-700">
                {member?.name}
                <ShieldPlus
                  className={clsx(
                    `h-5 w-5`,
                    conversation?.groupOwner === member?.id
                      ? "text-green-500"
                      : "text-blue-700"
                  )}
                />
              </div>

              {conversation?.groupOwner !== member?.id && (
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="h-4 w-4 text-gray-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left">
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onRemove(member.id)}>
                        <Gavel className="h-4 w-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              {loadingId === member.id && (
                <Loader2 className="animate-spin text-gray-500 ml-auto w-4 h-4" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ManageMembers;
