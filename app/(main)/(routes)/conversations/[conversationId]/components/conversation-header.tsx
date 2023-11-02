"use client";
import { UserAvatar } from "@/app/components/user-avatar";
import useOtherUser from "@/app/hooks/useOtherUser";
import { SessionTypes } from "@/typings";
import { Conversation, User } from "@prisma/client";
import Link from "next/link";
import React, { useMemo } from "react";
import { HiChevronLeft } from "react-icons/hi";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import { useModal } from "@/app/hooks/useModal";

export interface ConversationHeaderTypes {
  conversation: Conversation & {
    users: User[];
  };
  currentUser: SessionTypes;
  allUsers: User[];
}

const ConversationHeader: React.FC<ConversationHeaderTypes> = ({
  conversation,
  currentUser,
  allUsers,
}) => {
  const { onOpen } = useModal();
  const otherUser = useOtherUser(conversation, currentUser);

  //check if user is active
  const statusText = useMemo(() => {
    if (conversation?.isGroup) {
      return `${conversation.users.length} members`;
    }

    return "Active";
  }, [conversation]);

  return (
    <div
      className="
  bg-white 
  w-full 
  flex 
  border-b-[1px] 
  sm:px-4 
  py-3 
  px-4 
  lg:px-6 
  justify-between 
  items-center 
  shadow-sm
"
    >
      <div className="flex gap-3 items-center">
        <Link
          href="/conversations"
          className="
            lg:hidden 
            block 
            text-blue-700 
            hover:text-blue-600 
            transition 
            cursor-pointer
          "
        >
          <HiChevronLeft size={32} />
        </Link>
        {conversation?.isGroup ? (
          <UserAvatar
            conversation={conversation!}
            className="w-7 h-7 md:w-8 md:h-8"
          />
        ) : (
          <UserAvatar user={otherUser!} className="w-7 h-7 md:w-8 md:h-8" />
        )}

        <div className="flex flex-col">
          <div>{conversation.name || otherUser?.name}</div>
          <div className="text-sm font-light text-neutral-500">
            {statusText}
          </div>
        </div>
      </div>
      {/* <HeaderToggle data={conversation} currentUser={currentUser} /> */}
      <div
        onClick={() =>
          onOpen("headerToggle", {
            conversation,
            currentUser,
            users: allUsers,
          })
        }
      >
        <HiEllipsisHorizontal
          size={32}
          className="
        text-blue-700 
        hover:text-blue-600 
        cursor-pointer
          transition
        "
        />
      </div>
    </div>
  );
};

export default ConversationHeader;
