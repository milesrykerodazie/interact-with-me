import { Conversation, Message, User } from "@prisma/client";
import { Session } from "next-auth";

export interface SessionTypes extends Session {
  user: User;
}

export type FullMessageType = Message & {
  sender: User;
  seen: User[];
};

export type FullConversationType = Conversation & {
  users: User[];
  messages: FullMessageType[];
};
