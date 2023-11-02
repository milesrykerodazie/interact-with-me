"use client";
import React, { MouseEvent, useState } from "react";
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
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { useModal } from "@/app/hooks/useModal";

interface DeleteAccountModalTypes {
  openDeleteAccount: boolean;
  onClose: () => void;
}

const DeleteAccountModal = () => {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "deleteAccount";
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();
    try {
      setIsDeleting(true);

      const response = await axios.delete("/api/user");
      if (response?.data?.success === true) {
        signOut();
        toast.success(response?.data?.message);
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
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-primary p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold text-primary">
            Delete Account
          </DialogTitle>
          <DialogDescription className="text-center text-gray-700">
            Are you sure you want to delete your account? <br />
            this is a permanent action.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button onClick={onClose}>Cancel</Button>
            <Button
              disabled={isDeleting}
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountModal;
