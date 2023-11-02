import { useMemo } from "react";
import { User } from "@prisma/client";
import { FullConversationType, SessionTypes } from "@/typings";

const useOtherUser = (
  conversation: FullConversationType | { users: User[] },
  currentUser: SessionTypes
) => {
  const otherUser = useMemo(() => {
    const currentUserEmail = currentUser?.user?.email;

    const otherUser = conversation?.users?.filter(
      (user) => user?.email !== currentUserEmail
    );

    if (otherUser) return otherUser[0];
  }, [currentUser?.user?.email, conversation?.users]);

  return otherUser;
};

export default useOtherUser;
