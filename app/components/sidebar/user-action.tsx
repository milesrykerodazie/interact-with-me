"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Trash, User } from "lucide-react";
import { UserAvatar } from "../user-avatar";
import { User as user } from "@prisma/client";
import { useModal } from "@/app/hooks/useModal";

const UserAction = ({ user }: { user: user }) => {
  const { onOpen } = useModal();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none hover:opacity-80 transition">
          <UserAvatar user={user} />
          <span className="sr-only">User action</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => onOpen("profile", { user })}
            className="flex items-center space-x-2"
          >
            <User className="w-4 h-4 text-blue-700" />
            <span className="text-blue-700">My Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onOpen("logout")}
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4 text-blue-700" />
            <span className="text-blue-700">Logout</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onOpen("deleteAccount")}
            className="flex items-center space-x-2"
          >
            <Trash className="w-4 h-4 text-red-500" />
            <span className="text-red-500">Delete Account</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserAction;
