"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { UploadCloud, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import axios from "axios";
import useConversation from "@/app/hooks/useConversation";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useModal } from "@/app/hooks/useModal";

interface FormData {
  name: string;
  imageBase64: string;
  image: File | null;
}

const UpdateGroup = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "updateGroup";
  const { conversation } = data;
  const { conversationId } = useConversation();
  const [isUpdatingGroup, setIsUpdatingGroup] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: conversation?.name!,
    imageBase64: "",
    image: null,
  });

  useEffect(() => {
    if (conversation) {
      setFormData((prev) => ({
        ...prev,
        name: conversation?.name!,
      }));
    }
  }, [conversation]);

  const { name, imageBase64, image } = formData;

  //for image
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

  //update group
  const updateGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsUpdatingGroup(true);
      const response = await axios.patch(
        `/api/conversations/${conversationId}`,
        {
          name: name,
          imageUrl: imageBase64,
        }
      );
      if (response?.data?.success === true) {
        toast.success(response?.data?.message);
        setFormData((prev) => ({
          ...prev,
          imageBase64: "",
          image: null,
        }));
        onClose();
        router.refresh();
      }
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        // This error is an instance of AxiosError
        toast.error(error?.response?.data?.message);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setIsUpdatingGroup(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-primary p-0">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold text-primary">
            Update Group
          </DialogTitle>
          <DialogDescription className="text-center text-gray-700">
            Add more users to the group, update group image or group name.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={updateGroup} className="px-4">
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

          <div className="flex justify-center items-center my-5">
            <div className="relative h-32 w-32">
              {imageBase64 !== "" && (
                <Image
                  fill
                  src={imageBase64}
                  alt="Upload"
                  className="rounded-full object-cover"
                />
              )}
              {imageBase64 === "" && (
                <Image
                  fill
                  src={conversation?.groupConversationImage!}
                  alt="Upload"
                  className="rounded-full object-cover"
                />
              )}

              <button
                onClick={(e) => {
                  e.preventDefault();
                  setFormData((prev) => ({
                    ...prev,
                    imageBase64: "",
                    rawImage: null,
                  }));
                }}
                className="bg-red-500 text-white p-1 rounded-full absolute top-0 right-2 shadow-sm"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Group Name</Label>
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
              required
              placeholder="Enter Group Name."
              className="focus-visible:ring-0 focus-visible:ring-offset-0 bg-white border-primary text-gray-800"
            />
          </div>
          <DialogFooter className="px-1 py-3 rounded-md gap-3">
            <Button
              disabled={isUpdatingGroup}
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button disabled={isUpdatingGroup} type="submit">
              Update Group
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateGroup;
