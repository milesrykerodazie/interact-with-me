"use state";
import { UserAvatar } from "@/app/components/user-avatar";
import { FullMessageType, SessionTypes } from "@/typings";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
import ImageView from "./image-view";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Edit, Trash } from "lucide-react";
import EmojiPicker from "@/app/components/emoji-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const router = useRouter();
  const [newMessage, setNewMessage] = useState(data?.body);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [openImage, setOpenImage] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setOpenEdit(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keyDown", handleKeyDown);
  }, []);
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

  const canPerformAction = data?.senderId === currentUser?.user?.id;

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      const response = await axios.patch(`/api/messages/${data?.id}`, {
        newMessage,
      });
      if (response?.data?.success === true) {
        toast.success(response?.data?.message);
        setIsUpdating(false);
        setOpenEdit(false);
        router.refresh();
      }
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        toast.error(error?.response?.data?.error);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      setIsDeleting(true);
      const response = await axios.delete(`/api/messages/${data?.id}`);
      if (response?.data?.success === true) {
        setIsDeleting(false);
        setOpenDelete(false);
        router.refresh();
      }
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        toast.error(error?.response?.data?.error);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <div>
      <div className={container}>
        <div className="flex gap-3">
          <div className={avatar}>
            <UserAvatar user={data?.sender} className="w-5 h-5 md:w-7 md:h-7" />
          </div>
          <div className={body}>
            <div className="flex items-center gap-1">
              <div className="text-sm text-gray-600">{data?.sender?.name}</div>
              {data?.createdAt && (
                <div className="text-xs text-gray-400">
                  {format(new Date(data.createdAt), "p")}
                </div>
              )}
            </div>
            <div className={message}>
              {data?.image ? (
                <Image
                  alt="Image"
                  height="288"
                  width="288"
                  onClick={() => setOpenImage(true)}
                  src={data?.image}
                  className={clsx(
                    `object-cover 
                cursor-pointer 
                hover:scale-110 
                transition 
                translate`,
                    openDelete && "opacity-50"
                  )}
                />
              ) : (
                <div>{data?.body}</div>
              )}
            </div>
            {/* a good place for edit form */}

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
        {canPerformAction && (
          <div
            className={clsx(
              `flex gap-y-2 gap-x-5 ml-3 `,
              isOwn && "order-first mr-3"
            )}
          >
            {!data?.image && (
              <div onClick={() => setOpenEdit((current) => !current)}>
                <Edit className="hover:text-blue-700 w-4 h-4 text-gray-400 transition cursor-pointer" />
              </div>
            )}
            <div onClick={handleDelete}>
              <Trash
                className={clsx(
                  `hover:text-red-600 w-4 h-4 text-red-200 transition`,
                  isDeleting && "animate-spin"
                )}
              />
            </div>
          </div>
        )}
      </div>
      <ImageView
        openImage={openImage}
        onClose={() => setOpenImage(false)}
        src={data?.image ? data?.image : ""}
      />
      {openEdit && (
        <form onSubmit={handleEdit} className=" w-full px-4">
          <div className=" flex items-center w-full gap-x-2 pt-2">
            <div className="relative w-full">
              <Input
                value={newMessage!}
                disabled={isUpdating}
                onChange={(e) => setNewMessage(e.target.value)}
                className="pl-3 pr-10 py-5 bg-gray-200/90 border-none border-0 text-gray-600 outline-none  w-full disabled:opacity-30"
                placeholder="...update message"
              />
              <div className="absolute top-2 right-2">
                <EmojiPicker
                  onChange={(emoji: string) => {
                    setNewMessage((prevContent) => `${prevContent} ${emoji}`);
                  }}
                />
              </div>
            </div>
            <Button type="submit" size="sm">
              Save
            </Button>
          </div>
          <span className="text-[12px] mt-1 text-gray-400">
            Press escape to cancel, enter to save
          </span>
        </form>
      )}
    </div>
  );
};

export default ConversationBox;
