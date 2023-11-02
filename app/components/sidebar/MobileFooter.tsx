"use client";

import useConversation from "@/app/hooks/useConversation";
import Link from "next/link";
import { HiChat } from "react-icons/hi";
import { User } from "@prisma/client";
import { SessionTypes } from "@/typings";
import UserAction from "./user-action";
import { HiUsers } from "react-icons/hi2";
import { useModal } from "@/app/hooks/useModal";

interface MobileFooterTypes {
  users: User[];
  currentUser: SessionTypes;
}

const MobileFooter: React.FC<MobileFooterTypes> = ({ users, currentUser }) => {
  const { onOpen } = useModal();
  const { isOpen } = useConversation();

  if (isOpen) {
    return null;
  }

  return (
    <div
      className="
        fixed 
        justify-between 
        w-full 
        bottom-0 
        z-40 
        flex 
        items-center 
        bg-white 
        border-t-[1px] 
        lg:hidden
        px-4
        py-2
      "
    >
      <Link
        href={"/conversations"}
        className="flex gap-x-3 font-semibold justify-center text-blue-700"
      >
        <HiChat className="h-8 w-8" />
      </Link>
      <div
        onClick={() => onOpen("userSearch", { users })}
        className="cursor-pointer"
      >
        <span className="group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-blue-700 hover:scale-105 transition">
          <HiUsers className="h-6 w-6 shrink-0" aria-hidden="true" />
          <span className="sr-only">Users</span>
        </span>
      </div>
      <UserAction user={currentUser?.user} />
    </div>
  );
};

export default MobileFooter;
