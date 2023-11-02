"use client";

import AddToGroup from "@/app/(main)/(routes)/conversations/[conversationId]/components/add-to-group-modal";
import DeleteModal from "@/app/(main)/(routes)/conversations/[conversationId]/components/delete-modal";
import HeaderToggle from "@/app/(main)/(routes)/conversations/[conversationId]/components/header-toggle";
import LeaveModal from "@/app/(main)/(routes)/conversations/[conversationId]/components/leave-modal";
import ManageMembers from "@/app/(main)/(routes)/conversations/[conversationId]/components/manage-members-modal";
import UpdateGroup from "@/app/(main)/(routes)/conversations/[conversationId]/components/update-group";
import AddGroup from "@/app/components/modal/add-group-modal";
import DeleteAccountModal from "@/app/components/modal/delete-account-modal";
import LogoutModal from "@/app/components/modal/logout-modal";
import OtherUserProfile from "@/app/components/modal/other-user-Profile";
import ProfileModal from "@/app/components/modal/profile-modal";
import ViewMembers from "@/app/components/modal/view-members-modal";
import UserSearch from "@/app/components/sidebar/user-search";

export const ModalProvider = () => {
  return (
    <>
      <AddGroup />
      <UpdateGroup />
      <ViewMembers />
      <DeleteModal />
      <LeaveModal />
      <OtherUserProfile />
      <UserSearch />
      <ManageMembers />
      <AddToGroup />
      <HeaderToggle />
      <ProfileModal />
      <LogoutModal />
      <DeleteAccountModal />
    </>
  );
};
