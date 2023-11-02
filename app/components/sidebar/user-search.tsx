"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { UserAvatar } from "../user-avatar";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useModal } from "@/app/hooks/useModal";

const UserSearch = () => {
  const router = useRouter();
  const { isOpen, data, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "userSearch";
  const { users } = data;
  const [allUsers, setAllUsers] = useState(users);

  const [startConversation, setStartConversation] = useState(false);

  //useEffect to check for users on load
  useEffect(() => {
    if (users) {
      setAllUsers(users);
    }
  }, [users]);

  //handle add conversation sna redirect
  const handleRedirect = useCallback(
    (id: string) => {
      setStartConversation(true);
      axios
        .post("/api/conversations", { userId: id })
        .then((response) => {
          onClose();
          router.push(`/conversations/${response?.data?.id}`);
          router.refresh();
        })
        .catch(() => toast.error("Something went wrong."))
        .finally(() => setStartConversation(false));
    },
    [router]
  );

  return (
    <CommandDialog open={isModalOpen} onOpenChange={onClose}>
      <CommandInput placeholder="Search all users" />
      <CommandList>
        <CommandEmpty>No Results found</CommandEmpty>
        {allUsers?.map((user) => {
          return (
            <CommandGroup key={user?.id}>
              <CommandItem
                key={user?.id}
                disabled={startConversation}
                onSelect={() => handleRedirect(user?.id)}
                className="disabled:opacity-40"
              >
                <div className="flex items-center gap-2 disabled:opacity-40">
                  <UserAvatar user={user!} className="w-5 h-5 md:w-6 md:h-6" />
                  <span>{user?.name}</span>
                </div>
              </CommandItem>
            </CommandGroup>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
};

export default UserSearch;
