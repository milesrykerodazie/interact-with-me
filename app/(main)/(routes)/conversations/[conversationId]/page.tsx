import { getConversationById, getMessages, getUsers } from "@/app/actions";
import React from "react";
import ConversationHeader from "./components/conversation-header";
import { getCurrentUser } from "@/app/lib/auth";
import { Conversation, User } from "@prisma/client";
import ConversationBody from "./components/conversation-body";
import { FullMessageType } from "@/typings";
import ConversationInputForm from "./components/conversation-input-form";
import EmptyConversation from "@/app/components/users/empty-conversation";

interface ConversationParam {
  params: {
    conversationId: string;
  };
}

const ConversationPage = async ({ params }: ConversationParam) => {
  const currentUser = await getCurrentUser();
  const users = (await getUsers()) as User[];
  const conversation = (await getConversationById(
    params?.conversationId
  )) as Conversation & { users: User[] };
  const messages = (await getMessages(
    params?.conversationId
  )) as FullMessageType[];

  if (!conversation) {
    return <EmptyConversation />;
  }
  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        <ConversationHeader
          conversation={conversation}
          currentUser={currentUser}
          allUsers={users}
        />
        <ConversationBody
          initialMessages={messages}
          currentUser={currentUser}
        />
        <ConversationInputForm />
      </div>
    </div>
  );
};

export default ConversationPage;
