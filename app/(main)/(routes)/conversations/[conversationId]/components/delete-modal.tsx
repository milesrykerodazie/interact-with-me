"use client";
import React, { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import useConversation from "@/app/hooks/useConversation";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useModal } from "@/app/hooks/useModal";

const DeleteModal = () => {
  const router = useRouter();
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "deleteConversation";
  const [isDeleting, setIsDeleting] = useState(false);
  const { conversationId } = useConversation();

  const onDelete = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      try {
        setIsDeleting(true);
        const response = await axios.delete(
          `/api/conversations/${conversationId}`
        );

        if (response?.data?.success === true) {
          toast.success(response?.data?.message);
          onClose();
          router.push("/conversations");
        }
      } catch (error) {
        if (error instanceof axios.AxiosError) {
          // This error is an instance of AxiosError
          toast.error(error?.response?.data?.message);
        } else {
          toast.error("Something went wrong.");
        }
      } finally {
        setIsDeleting(false);
      }
    },
    [router, conversationId, onClose]
  );

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-primary p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold text-primary">
            Delete Conversation
          </DialogTitle>
          <DialogDescription className="text-center text-gray-700">
            Are you sure you want to delete this conversation? <br />
            this will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isDeleting} onClick={onClose}>
              Cancel
            </Button>
            <Button
              disabled={isDeleting}
              variant="destructive"
              onClick={onDelete}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
