import React, { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { UserAvatar } from "../user-avatar";
import { ShieldPlus } from "lucide-react";
import clsx from "clsx";
import { useModal } from "@/app/hooks/useModal";

const ViewMembers = () => {
  const { isOpen, data, onClose, type, onOpen } = useModal();
  const isModalOpen = isOpen && type === "viewMembers";
  const { conversation } = data;

  const [allMembers, setAllMembers] = useState(conversation?.users);

  //useEffect to check for users on load
  useEffect(() => {
    if (conversation?.users) {
      setAllMembers(conversation?.users);
    }
  }, [conversation?.users]);
  return (
    <CommandDialog open={isModalOpen} onOpenChange={onClose}>
      <CommandInput placeholder="Search all users" />
      <CommandList>
        <CommandEmpty>No Results found</CommandEmpty>
        {allMembers?.map((user) => {
          return (
            <CommandGroup key={user?.id}>
              <CommandItem
                key={user?.id}
                onSelect={() => onOpen("userProfile", { user: user })}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2 ">
                  <UserAvatar user={user!} className="w-5 h-5 md:w-6 md:h-6" />
                  <span>{user?.name}</span>
                  <ShieldPlus
                    className={clsx(
                      `h-5 w-5`,
                      conversation?.groupOwner === user?.id
                        ? "text-green-500"
                        : "text-blue-700"
                    )}
                  />
                </div>
              </CommandItem>
            </CommandGroup>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
};

export default ViewMembers;
