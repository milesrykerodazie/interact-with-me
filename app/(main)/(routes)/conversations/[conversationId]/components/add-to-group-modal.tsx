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
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import Select from "react-select";

import toast from "react-hot-toast";
import { useModal } from "@/app/hooks/useModal";

const AddToGroup = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "addToGroup";
  const { users, conversation } = data;
  const [isAdding, setIsAdding] = useState(false);
  const { conversationId } = useConversation();

  const filteredUsers = users?.filter(
    (user) => !conversation?.users?.some((member) => member?.id === user?.id)
  );

  // const defValues = conversation?.users?.map((user) => {
  //   return {
  //     value: user?.id,
  //     label: user?.name,
  //   };
  // });

  // console.log("the filtered users => ", filteredUsers);
  // console.log("the filtered def values => ", defValues);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      members: [],
    },
  });

  const members = watch("members");

  const addToGroup: SubmitHandler<FieldValues> = useCallback(
    async (data) => {
      try {
        setIsAdding(true);
        const response = await axios.patch(
          `/api/conversations/${conversationId}/add`,
          {
            userIds: data?.members,
          }
        );
        if (response?.data?.success === true) {
          toast.success(response?.data?.message);
          reset();
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
        setIsAdding(false);
      }
    },
    [router, conversationId, onClose]
  );

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-primary p-0">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold text-primary">
            Add Users To Group
          </DialogTitle>
          <DialogDescription className="text-center text-gray-700">
            Add more users to group
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(addToGroup)} className="px-4">
          <div className="mt-5">
            <Label>Choose people to add.</Label>
            <div className="mt-2">
              <Select
                isDisabled={isAdding}
                isMulti
                options={filteredUsers?.map((user) => ({
                  value: user?.id,
                  label: user?.name,
                }))}
                styles={{
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
                onChange={(value) =>
                  setValue("members", value, {
                    shouldValidate: true,
                  })
                }
                value={members}
                classNames={{
                  control: () => "text-sm",
                }}
              />
            </div>
          </div>
          <DialogFooter className="px-1 py-3 rounded-md gap-3">
            <Button
              disabled={isAdding}
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button disabled={isAdding} type="submit">
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddToGroup;
