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
import { Label } from "@/components/ui/label";
import Select from "react-select";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { useModal } from "@/app/hooks/useModal";

type Option = {
  value: string;
  label: string;
};
interface FormData {
  name: string;
  imageBase64: string | "";
  image: File | null;
  members: Option[];
}

const AddGroup = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "createGroup";
  const { users } = data;
  const [allUsers, setAllUsers] = useState(users);
  const [creatingGroup, setCreatingGroup] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    imageBase64: "",
    image: null,
    members: [],
  });

  const { name, imageBase64, image, members } = formData;

  //useEffect to check for users on load
  useEffect(() => {
    if (users) {
      setAllUsers(users);
    }
  }, [users]);

  const options: Option[] | any = allUsers?.map((user) => ({
    value: user?.id!,
    label: user?.name!,
  }));

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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreatingGroup(true);

    axios
      .post("/api/conversations", {
        name: name,
        members: members,
        isGroup: true,
        imageUrl: imageBase64,
      })
      .then((response) => {
        if (response?.data?.success === true) {
          toast.success(response?.data?.message);
          setFormData((prev) => ({
            name: "",
            imageBase64: "",
            image: null,
            members: [],
          }));
          onClose();
          router.refresh();
        }
      })
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setCreatingGroup(false));
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-primary p-0">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold text-primary">
            Create a group chat
          </DialogTitle>
          <DialogDescription className="text-center text-gray-700">
            Create a chat with 2 or more people.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="px-4">
          <div className="border-2 border-dashed border-primary flex flex-col justify-center items-center rounded-lg p-10 cursor-pointer mb-5">
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
            <div className="flex justify-center items-center mb-5">
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
                      imageBase64: "",
                      image: null,
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
          <div className="mt-5">
            <Label>Choose Group Members</Label>
            <div className="mt-2">
              <Select
                isDisabled={creatingGroup}
                isMulti
                options={options}
                styles={{
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
                onChange={(selectedOptions) => {
                  const newMembers = selectedOptions.filter((option) => {
                    return !formData.members.some(
                      (member) => member.value === option.value
                    );
                  });
                  setFormData((prev) => ({
                    ...prev,
                    members: [...prev.members, ...newMembers],
                  }));
                }}
                value={members}
                classNames={{
                  control: () => "text-sm",
                }}
              />
            </div>
          </div>
          <DialogFooter className="px-1 py-3 rounded-md gap-3">
            <Button
              disabled={creatingGroup}
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button disabled={creatingGroup} type="submit">
              Create Group
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddGroup;
