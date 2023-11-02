"use state";
import { UserAvatar } from "@/app/components/user-avatar";
import { FullMessageType, SessionTypes } from "@/typings";
import clsx from "clsx";
import React, { useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
import ImageView from "./image-view";

interface ConvrsationBoxProps {
  data: FullMessageType;
  isLast?: boolean;
  currentUser: SessionTypes;
}

const ConversationBox: React.FC<ConvrsationBoxProps> = ({
  data,
  isLast,
  currentUser,
}) => {
  //know the sender of the message
  const isOwn = currentUser?.user?.email === data?.sender?.email;

  //seen messages list
  const seenList = (data?.seen || [])
    .filter((user) => user?.email !== data?.sender?.email)
    .map((user) => user?.name)
    .join(", ");

  //dynamic stylings
  const container = clsx("flex gap-3 p-4", isOwn && "justify-end");
  const avatar = clsx(isOwn && "order-2");
  const body = clsx("flex flex-col gap-2", isOwn && "items-end");
  const message = clsx(
    "text-sm w-fit overflow-hidden",
    isOwn ? "bg-blue-700 text-white" : "bg-gray-100 text-blue-700",
    data.image ? "rounded-md p-0" : "rounded-lg py-2 px-3"
  );

  //image open state
  const [openImage, setOpenImage] = useState(false);
  return (
    <>
      <div className={container}>
        <div className={avatar}>
          <UserAvatar user={data?.sender} className="w-5 h-5 md:w-7 md:h-7" />
        </div>
        <div className={body}>
          <div className="flex items-center gap-1">
            <div className="text-sm text-gray-600">{data.sender.name}</div>
            <div className="text-xs text-gray-400">
              {format(new Date(data.createdAt), "p")}
            </div>
          </div>
          <div className={message}>
            {data.image ? (
              <Image
                alt="Image"
                height="288"
                width="288"
                onClick={() => setOpenImage(true)}
                src={data.image}
                className="
                object-cover 
                cursor-pointer 
                hover:scale-110 
                transition 
                translate
              "
              />
            ) : (
              <div>{data.body}</div>
            )}
          </div>
          {isLast && isOwn && seenList.length > 0 && (
            <div
              className="
            text-xs 
            font-light 
            text-gray-500
            "
            >
              {`Seen by ${seenList}`}
            </div>
          )}
        </div>
      </div>
      <ImageView
        openImage={openImage}
        onClose={() => setOpenImage(false)}
        src={data?.image ? data?.image : ""}
      />
    </>
  );
};

export default ConversationBox;
