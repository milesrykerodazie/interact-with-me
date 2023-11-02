// "use client";
// import React from "react";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { HiEllipsisHorizontal } from "react-icons/hi2";
// import { Conversation, User } from "@prisma/client";
// import { SessionTypes } from "@/typings";
// import ToggleContent from "./toggle-content";

// interface HeaderType {
//   data: Conversation & {
//     users: User[];
//   };
//   currentUser: SessionTypes;
// }
// const HeaderToggle: React.FC<HeaderType> = ({ data, currentUser }) => {
//   return (
//     <Sheet>
//       <SheetTrigger asChild>
//         <HiEllipsisHorizontal
//           size={32}
//           className="
//         text-blue-700
//         hover:text-blue-600
//         cursor-pointer
//           transition
//         "
//         />
//       </SheetTrigger>
//       <SheetContent side="right" className="p-0 flex gap-0 w-full">
//         <ToggleContent currentUser={currentUser} data={data} />
//       </SheetContent>
//     </Sheet>
//   );
// };

// export default HeaderToggle;

"use client";
import React, { useMemo } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import { IoTrash } from "react-icons/io5";
import useOtherUser from "@/app/hooks/useOtherUser";
import { UserAvatar } from "@/app/components/user-avatar";
import { format } from "date-fns";
import { GroupIcon, Settings, UserCheck, UserPlus, Users } from "lucide-react";
import { User } from "@prisma/client";
import { useModal } from "@/app/hooks/useModal";

const HeaderToggle = () => {
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const isModalOpen = isOpen && type === "headerToggle";
  const { users, conversation, currentUser } = data;

  const otherUser = conversation?.users?.filter(
    (user) => user?.email !== currentUser?.user?.email
  ) as User[];
  const first = otherUser && otherUser[0];

  const convStartDate = useMemo(() => {
    return (
      conversation?.createdAt && format(new Date(conversation?.createdAt), "PP")
    );
  }, [conversation?.createdAt]);

  const title = useMemo(() => {
    return conversation?.name || first?.name;
  }, [conversation?.name, first?.name]);

  const statusText = useMemo(() => {
    if (conversation?.isGroup) {
      const textFormat =
        conversation?.users?.length === 1
          ? "member"
          : conversation?.users?.length > 1
          ? "members"
          : "";
      return `${conversation?.users.length} ${textFormat}`;
    }

    return "Active";
  }, [conversation, otherUser]);

  return (
    <Sheet open={isModalOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="p-0 flex gap-0 w-full">
        <div className="w-full flex flex-col bg-white py-6">
          <div className="relative mt-6 flex-1 px-4 sm:px-6">
            <div className="flex flex-col items-center">
              <div className="mb-2">
                {conversation?.isGroup ? (
                  <UserAvatar conversation={conversation!} />
                ) : (
                  <UserAvatar user={first} />
                )}
              </div>
              <div className="text-blue-700">
                {title ? title : "Left conversation"}
              </div>
              <div className="text-sm text-gray-500">
                {first ? statusText : "🚫"}
              </div>
              <div className="w-full mt-5 space-y-2 my-8">
                <div className="font-bold tracking-wider text-gray-600">
                  Actions
                </div>

                {/* invite here */}
                {conversation?.groupOwner === currentUser?.user?.id &&
                  conversation?.isGroup && (
                    <div
                      className="flex w-full justify-between gap-3 items-center cursor-pointer hover:opacity-75 bg-white  drop-shadow p-3 rounded-lg"
                      onClick={() =>
                        onOpen("addToGroup", {
                          users: users,
                          conversation,
                        })
                      }
                    >
                      <div className="text-sm font-light text-blue-700">
                        Add to Group
                      </div>
                      <div>
                        <UserPlus size={20} className="text-blue-700" />
                      </div>
                    </div>
                  )}
                {/* update group here */}
                {conversation?.groupOwner === currentUser?.user?.id &&
                  conversation?.isGroup && (
                    <div
                      className="flex w-full justify-between gap-3 items-center cursor-pointer hover:opacity-75 bg-white  drop-shadow p-3 rounded-lg"
                      onClick={() =>
                        onOpen("updateGroup", {
                          conversation: conversation,
                        })
                      }
                    >
                      <div className="text-sm font-light text-blue-700">
                        Update Group
                      </div>
                      <div>
                        <Settings size={20} className="text-blue-700" />
                      </div>
                    </div>
                  )}

                {/* update user */}
                {conversation?.groupOwner === currentUser?.user?.id &&
                  conversation?.isGroup && (
                    <div
                      className="flex w-full justify-between gap-3 items-center cursor-pointer hover:opacity-75 bg-white drop-shadow p-3 rounded-lg"
                      onClick={() =>
                        onOpen("manageMembers", { conversation: conversation })
                      }
                    >
                      <div className="text-sm font-light text-blue-700">
                        Manage members
                      </div>
                      <div>
                        <Users size={20} className="text-blue-700" />
                      </div>
                    </div>
                  )}

                {/* Group members */}
                {conversation?.isGroup && (
                  <div
                    className="flex w-full justify-between gap-3 items-center cursor-pointer hover:opacity-75 bg-white drop-shadow p-3 rounded-lg"
                    onClick={() =>
                      onOpen("viewMembers", { conversation: conversation })
                    }
                  >
                    <div className="text-sm font-light text-blue-700">
                      Group members ({conversation?.users?.length})
                    </div>
                    <div>
                      <GroupIcon size={20} className="text-blue-700" />
                    </div>
                  </div>
                )}
                {!conversation?.isGroup && otherUser !== undefined && (
                  <div
                    className="flex w-full justify-between gap-3 items-center cursor-pointer hover:opacity-75 bg-white drop-shadow p-3 rounded-lg"
                    onClick={() => onOpen("userProfile", { user: first })}
                  >
                    <div className=" font-light text-sm text-blue-700">
                      View <span className="font-bold">{title}</span> profile
                    </div>
                    <div>
                      <UserCheck size={20} className="text-blue-700" />
                    </div>
                  </div>
                )}

                {/* delete here */}
                {!conversation?.isGroup && (
                  <div
                    className="flex w-full justify-between gap-3 items-center cursor-pointer hover:opacity-75 bg-white drop-shadow p-3 rounded-lg"
                    onClick={() => onOpen("deleteConversation")}
                  >
                    <div className="text-sm font-light text-red-500">
                      Delete Conversation
                    </div>
                    <div>
                      <IoTrash size={20} className="text-red-500" />
                    </div>
                  </div>
                )}
                {conversation?.groupOwner === currentUser?.user?.id &&
                  conversation?.isGroup && (
                    <div
                      className="flex w-full justify-between gap-3 items-center cursor-pointer hover:opacity-75 bg-white drop-shadow p-3 rounded-lg"
                      onClick={() => onOpen("deleteConversation")}
                    >
                      <div className="text-sm font-light text-red-500">
                        Delete Group
                      </div>
                      <div>
                        <IoTrash size={20} className="text-red-500" />
                      </div>
                    </div>
                  )}
                {/* leave group here */}
                {conversation?.isGroup &&
                  conversation?.groupOwner !== currentUser?.user?.id && (
                    <div
                      className="flex w-full justify-between gap-3 items-center cursor-pointer hover:opacity-75 bg-white drop-shadow p-3 rounded-lg"
                      onClick={() => onOpen("leaveConversation")}
                    >
                      <div className="text-sm font-light text-red-500">
                        Leave Group
                      </div>
                      <div>
                        <IoTrash size={20} className="text-red-500" />
                      </div>
                    </div>
                  )}
              </div>
              <div className="w-full pt-5 sm:px-0 sm:pt-0">
                <dl className="space-y-8 px-4 w-full">
                  {conversation?.isGroup ? (
                    <>
                      <hr />
                      <div>
                        <dt
                          className="
                                    text-sm 
                                    font-medium 
                                    text-blue-700 
                                    sm:w-40 
                                    sm:flex-shrink-0
                                  "
                        >
                          Created Group On
                        </dt>
                        <dd
                          className="
                                    mt-1 
                                    text-sm 
                                    text-gray-900 
                                    sm:col-span-2
                                  "
                        >
                          <time dateTime={convStartDate}>{convStartDate}</time>
                        </dd>
                      </div>
                    </>
                  ) : (
                    <>
                      <hr />
                      <div>
                        <dt
                          className="
                                text-sm 
                                font-medium 
                                text-blue-700 
                                sm:w-40 
                                sm:flex-shrink-0
                              "
                        >
                          Conversation start date
                        </dt>
                        <dd
                          className="
                                mt-1 
                                text-sm 
                                text-gray-900 
                                sm:col-span-2
                              "
                        >
                          <time dateTime={convStartDate}>{convStartDate}</time>
                        </dd>
                      </div>
                    </>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HeaderToggle;
