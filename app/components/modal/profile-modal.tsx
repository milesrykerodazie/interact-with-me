"use client";
import React, { FormEvent, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { UploadCloud, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useModal } from "@/app/hooks/useModal";

//types for the form
interface FormData {
  name: string;
  image: File | null;
  username: string;
  bio: string;
  email: string;
  imageBase64: string;
}

const ProfileModal = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "profile";
  const { user } = data;
  const [isUpdating, setIsUpdating] = useState(false);
  //the states
  const [formData, setFormData] = useState<FormData>({
    name: user?.name!,
    username: user?.username!,
    bio: user?.bio!,
    email: user?.email!,
    image: null,
    imageBase64: "",
  });

  //useEffect for making sure user data is available
  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        name: user?.name!,
        username: user?.username!,
        bio: user?.bio!,
        userImage: user?.image!,
        email: user?.email!,
      }));
    }
  }, [user]);

  const { name, username, bio, email, image, imageBase64 } = formData;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: keyof FormData
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [field]: base64String,
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  const updateProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsUpdating(true);

      const response = await axios.patch("/api/user", {
        name: name,
        username: username,
        bio: bio,
        image: imageBase64,
      });
      if (response?.data?.success === true) {
        toast.success(response?.data?.message);
        setFormData((prev) => ({
          ...prev,
          image: null,
          imageBase64: "",
        }));
        setIsUpdating(false);
        onClose();
        router.refresh();
      }
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setIsUpdating(false);
      router.refresh();
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-primary p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold text-primary">
            My Profile
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={updateProfile} className="mx-5 space-y-4">
          <div className="border-2 border-dashed border-primary flex flex-col justify-center items-center rounded-lg p-10 cursor-pointer">
            <label
              htmlFor="imageFile"
              className="flex flex-col justify-center items-center"
            >
              <UploadCloud className="h-10 w-10 fill-white stroke-blue-470" />

              {image !== null ? (
                <p className="text-center font-thin">{image?.name}</p>
              ) : (
                <p className="text-center font-thin">
                  Drag 'n' drop an image here,
                  <br /> or click to select one
                </p>
              )}
            </label>
            <input
              hidden
              type="file"
              id="imageFile"
              accept="image/*"
              onChange={(e) => handleChange(e, "imageBase64")}
            />
          </div>
          {imageBase64 !== "" && (
            <div className="flex justify-center items-center">
              <div className="relative h-32 w-32">
                <Image
                  fill
                  src={imageBase64}
                  alt="Upload"
                  className="rounded-full object-cover"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setFormData((prev) => ({
                      ...prev,
                      image: null,
                      imageBase64: "",
                    }));
                  }}
                  className="bg-red-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
          {imageBase64 === "" && (
            <div className="flex justify-center items-center">
              <div className="relative h-32 w-32">
                <Image
                  fill
                  src={
                    user?.image!
                      ? user?.image!
                      : "https://res.cloudinary.com/dcymjefv8/image/upload/v1698572261/simple_messaging_app/users/image/no-user_dib75q.png"
                  }
                  alt="Upload"
                  className="rounded-full object-cover"
                />
              </div>
            </div>
          )}

          <p className="text-primary">Email: {email}</p>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              placeholder="Enter name here."
              className="focus-visible:ring-0 focus-visible:ring-offset-0 bg-white border-primary text-gray-800"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
              placeholder="Enter your username."
              className="focus-visible:ring-0 focus-visible:ring-offset-0 bg-white border-primary text-gray-800"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Input
              type="text"
              id="bio"
              value={bio && bio}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  bio: e.target.value,
                }))
              }
              placeholder="Enter your bio."
              className="focus-visible:ring-0 focus-visible:ring-offset-0 bg-white border-primary text-gray-800"
            />
          </div>
          <DialogFooter className="px-1 py-3 rounded-md">
            <Button type="submit" disabled={isUpdating} className="w-full">
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
