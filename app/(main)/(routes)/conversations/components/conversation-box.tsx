"use client";
import useOtherUser from "@/app/hooks/useOtherUser";
import { FullConversationType, SessionTypes } from "@/typings";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo } from "react";
import { format } from "date-fns";
import { UserAvatar } from "@/app/components/user-avatar";

interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
  currentUser: SessionTypes;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
  currentUser,
}) => {
  const otherUser = useOtherUser(data, currentUser);
  const router = useRouter();

  const handleRedirect = useCallback(() => {
    router.push(`/conversations/${data?.id}`);
  }, [data, router]);

  //getting the las message from the conversation
  const lastMessage = useMemo(() => {
    const messages = data.messages || [];

    return messages[messages.length - 1];
  }, [data.messages]);

  //the user email
  const userEmail = currentUser?.user?.email;

  //if user has seen the message
  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen || [];

    if (!userEmail) {
      return false;
    }

    return seenArray.filter((user) => user.email === userEmail).length !== 0;
  }, [userEmail, lastMessage]);

  //check if last message is a text or an image
  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return "Sent an image";
    }

    if (lastMessage?.body) {
      return lastMessage?.body;
    }

    return "Started a conversation";
  }, [lastMessage]);

  return (
    <div
      onClick={handleRedirect}
      className={clsx(
        `
  w-full 
  relative 
  flex 
  items-center 
  space-x-3 
  p-3 
  hover:bg-neutral-100
  rounded-lg
  transition
  cursor-pointer
  mb-2
  `,
        selected ? "bg-neutral-100" : "bg-white"
      )}
    >
      {data?.isGroup ? (
        <UserAvatar conversation={data!} className="w-7 h-7 md:w-8 md:h-8" />
      ) : (
        <UserAvatar user={otherUser!} className="w-7 h-7 md:w-8 md:h-8" />
      )}

      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          <div className="flex justify-between items-center mb-1">
            <p className="text-md font-medium text-gray-900">
              {data.name || otherUser?.name}
            </p>
            {lastMessage?.createdAt && (
              <p
                className="
                  text-xs 
                  text-gray-400 
                  font-light
                "
              >
                {format(new Date(lastMessage.createdAt), "p")}
              </p>
            )}
          </div>
          <p
            className={clsx(
              `
              truncate 
              text-sm
              `,
              hasSeen ? "text-gray-500" : "text-black font-medium"
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
