"use client";
import EmptyState from "@/app/components/users/empty-state";
import useConversation from "@/app/hooks/useConversation";
import clsx from "clsx";
import React from "react";

const ConversationPageComponent = () => {
  const { isOpen } = useConversation();
  return (
    <div
      className={clsx(
        "lg:pl-80 h-screen lg:block",
        isOpen ? "block" : "hidden"
      )}
    >
      <EmptyState />
    </div>
  );
};

export default ConversationPageComponent;
