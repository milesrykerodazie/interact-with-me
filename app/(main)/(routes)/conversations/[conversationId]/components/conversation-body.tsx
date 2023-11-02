"use client";
import useConversation from "@/app/hooks/useConversation";
import { FullMessageType, SessionTypes } from "@/typings";
import React, { useEffect, useRef, useState } from "react";
import ConversationBox from "./conversation-box";
import axios from "axios";
import { pusherClient } from "@/app/lib/pusher";
import { find } from "lodash";

interface ConversationBodaTypes {
  initialMessages: FullMessageType[];
  currentUser: SessionTypes;
}

const ConversationBody: React.FC<ConversationBodaTypes> = ({
  initialMessages,
  currentUser,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(initialMessages);

  const { conversationId } = useConversation();

  //making the message seen as soon as the conversations load up
  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  //pusher use effect
  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);
      setMessages((current) => {
        if (find(current, { id: message?.id })) {
          return current;
        }

        return [...current, message];
      });

      bottomRef?.current?.scrollIntoView();
    };

    const updateMessageHandler = (updatedMessage: FullMessageType) => {
      setMessages((current) =>
        current?.map((updatedMsg) => {
          if (updatedMsg?.id === updatedMessage?.id) {
            return updatedMessage;
          }

          return updatedMsg;
        })
      );
    };

    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
    };
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <ConversationBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
          currentUser={currentUser}
        />
      ))}
      <div className="pt-24" ref={bottomRef} />
    </div>
  );
};

export default ConversationBody;
