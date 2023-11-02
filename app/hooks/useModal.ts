import { FullConversationType, SessionTypes } from "@/typings";
import { Conversation, User } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "createGroup"
  | "userSearch"
  | "userProfile"
  | "viewMembers"
  | "deleteConversation"
  | "leaveConversation"
  | "manageMembers"
  | "updateGroup"
  | "addToGroup"
  | "headerToggle"
  | "profile"
  | "deleteAccount"
  | "logout";

interface ModalData {
  currentUser?: SessionTypes;
  users?: User[];
  user?: User;
  conversation?: Conversation & {
    users: User[];
  };
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
