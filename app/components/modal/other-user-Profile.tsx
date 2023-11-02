import { User } from "@prisma/client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useModal } from "@/app/hooks/useModal";

const OtherUserProfile = () => {
  const { isOpen, data, type, onClose } = useModal();
  const isModalOpen = isOpen && type === "userProfile";
  const { user } = data;
  const [userData, setUserData] = useState(user);

  //useEffect to check for users on load
  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="pt-3 px-6">
          <DialogTitle className="text-xl text-center font-semibold text-primary">
            Member
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-2">
          {userData?.image !== null && (
            <div className="relative h-20 w-20">
              <Image
                fill
                src={userData?.image!}
                alt="Upload"
                className="rounded-full object-cover"
              />
            </div>
          )}
          {user?.image !== null && (
            <div className="text-gray-300">
              ---------------------------------------
            </div>
          )}

          <div className="flex flex-col items-center gap-1">
            <Label htmlFor="name" className="text-gray-800 text-lg">
              Name
            </Label>
            <span className="text-sm text-gray-500">{user?.name}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Label htmlFor="name" className="text-gray-800 text-lg">
              Username
            </Label>
            <span className="text-sm text-gray-500">{user?.username}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Label htmlFor="name" className="text-gray-800 text-lg">
              Email
            </Label>
            <span className="text-sm text-gray-500">{user?.email}</span>
          </div>
          {user?.bio && (
            <div className="flex flex-col items-center gap-1">
              <Label htmlFor="name" className="text-gray-800 text-lg">
                About
              </Label>
              <span className="text-sm text-gray-500">{user?.bio}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OtherUserProfile;
