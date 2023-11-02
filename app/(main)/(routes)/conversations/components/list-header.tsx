"use client";
import React from "react";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@prisma/client";
import { useModal } from "@/app/hooks/useModal";

interface UsersType {
  users: User[];
}

const ListHeader: React.FC<UsersType> = ({ users }) => {
  const { onOpen } = useModal();
  const isAdmin = true;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none w-full" asChild>
        <button className="w-full text-2xl text-blue-700 font-bold px-3 flex items-center h-12 border-neutral-200  border-b transition">
          Conversations
          <ChevronDown className="h-6 w-6 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60 md:w-96 lg:w-72 text-xs font-medium space-y-[2px]">
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("userSearch", { users })}
            className=" dark:text-gray-400 px-3 py-2 text-sm cursor-pointer"
          >
            Start Conversation
            <UserPlus className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("createGroup", { users })}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Create Group
            <PlusCircle className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ListHeader;
