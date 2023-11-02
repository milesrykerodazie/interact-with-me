"use client";
import useConversation from "@/app/hooks/useConversation";
import { FullConversationType, SessionTypes } from "@/typings";
import { User } from "@prisma/client";
import clsx from "clsx";
import React, { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import ConversationBox from "./conversation-box";
import AddGroup from "@/app/components/modal/add-group-modal";
import { pusherClient } from "@/app/lib/pusher";
import { find } from "lodash";
import { useRouter } from "next/navigation";
import ListHeader from "./list-header";

interface ConversationProps {
  users: User[];
  initialConversations: FullConversationType[];
  currentUser: SessionTypes;
}

const ConversationList: React.FC<ConversationProps> = ({
  users,
  initialConversations,
  currentUser,
}) => {
  const router = useRouter();
  const [items, setItems] = useState(initialConversations);
  const { conversationId, isOpen } = useConversation();

  //so i wont have to keep writing the path for the email all the time
  const pusherKey = useMemo(() => {
    return currentUser?.user?.email;
  }, [currentUser?.user?.email]);

  //use effect for the pusher
  useEffect(() => {
    if (!pusherKey) {
      return;
    }

    pusherClient.subscribe(pusherKey!);

    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversation?.id })) {
          return current;
        }

        return [conversation, ...current];
      });
    };
    const updateHandler = (updateConversation: FullConversationType) => {
      setItems((current) =>
        current?.map((prev) => {
          if (prev?.id === updateConversation?.id) {
            return {
              ...prev,
              messages: updateConversation?.messages,
            };
          }
          return prev;
        })
      );
    };
    const removeHandler = (removedConversation: FullConversationType) => {
      setItems((current) => {
        return [
          ...current?.filter(
            (currentConversation) =>
              currentConversation?.id !== removedConversation?.id
          ),
        ];
      });

      if (conversationId === removedConversation?.id) {
        router.push("/conversations");
      }
    };

    const leaveHandler = (leftConversation: FullConversationType) => {
      setItems((current) => {
        return [
          ...current?.filter(
            (currentConversation) =>
              currentConversation?.id !== leftConversation?.id
          ),
        ];
      });

      if (conversationId === leftConversation?.id) {
        router.push("/conversations");
      }
    };

    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:remove", removeHandler);
    pusherClient.bind("conversation:leave", leaveHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:new", newHandler);
      pusherClient.unbind("conversation:update", updateHandler);
      pusherClient.unbind("conversation:remove", removeHandler);
      pusherClient.unbind("conversation:leave", leaveHandler);
    };
  }, [pusherKey, router, conversationId]);

  return (
    <>
      <div
        className={clsx(
          `fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200`,
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-5">
          <ListHeader users={users} />
          <hr />
          {items?.map((item) => (
            <ConversationBox
              key={item.id}
              data={item}
              selected={conversationId === item.id}
              currentUser={currentUser}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ConversationList;
