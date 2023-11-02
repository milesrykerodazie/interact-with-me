"use client";
import React from "react";
import { SessionTypes } from "@/typings";
import UserAction from "./user-action";
import Link from "next/link";
import { HiChat } from "react-icons/hi";
import { User } from "@prisma/client";
import { HiUsers } from "react-icons/hi2";
import { useModal } from "@/app/hooks/useModal";

interface DesktopSidebarProps {
  currentUser: SessionTypes;
  users: User[];
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentUser,
  users,
}) => {
  const { onOpen } = useModal();
  return (
    <div
      className="
  hidden 
  lg:fixed 
  lg:inset-y-0 
  lg:left-0 
  lg:z-40 
  lg:w-20 
  xl:px-6
  lg:overflow-y-auto 
  lg:bg-white 
  lg:border-r-[1px]
  lg:pb-4
  lg:flex
  lg:flex-col
  justify-between"
    >
      <nav className="mt-4 flex flex-col justify-between">
        <ul role="list" className="flex flex-col items-center space-y-1">
          <li>
            <Link
              href={"/conversations"}
              className="
              flex 
              gap-x-3 
              rounded-md 
              p-3 
              text-sm 
              leading-6 
              font-semibold 
             text-blue-700
              hover:scale-105
              transition"
            >
              <HiChat className="h-6 w-6 shrink-0" aria-hidden="true" />
              <span className="sr-only">Chat</span>
            </Link>
          </li>
          <div
            onClick={() => onOpen("userSearch", { users })}
            className="cursor-pointer"
          >
            <span className="group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-blue-700 hover:scale-105 transition">
              <HiUsers className="h-6 w-6 shrink-0" aria-hidden="true" />
              <span className="sr-only">Users</span>
            </span>
          </div>
        </ul>
      </nav>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <UserAction user={currentUser?.user} />
      </div>
    </div>
  );
};

export default DesktopSidebar;
