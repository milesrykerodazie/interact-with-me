"use client";
import React, { useState } from "react";
import { HiPaperAirplane } from "react-icons/hi2";
import { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import { ImageIcon, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import axios from "axios";
import useConversation from "@/app/hooks/useConversation";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import EmojiPicker from "@/app/components/emoji-picker";

interface FormData {
  rawFile: File | null;
  fileUrl: string;
}

const ConversationInputForm = () => {
  const router = useRouter();
  const { conversationId } = useConversation();
  const [openImage, setOpenImage] = useState(false);
  const [imageForm, setImageForm] = useState<FormData>({
    rawFile: null,
    fileUrl: "",
  });

  const [message, setMessage] = useState("");

  //   close dialog modal
  const handleClose = () => {
    setOpenImage(false);
  };

  //the image methods
  //react dropzone image handling
  const handleImageDrop = (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];

    // Convert the selected image to a Base64 string
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && event.target.result) {
        const base64String = event.target.result.toString();
        setImageForm({
          ...imageForm,
          rawFile: selectedFile,
          fileUrl: base64String,
        });
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  //drop zone hook
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleImageDrop,
    multiple: false,
  });

  const [isSending, setIsSending] = useState(false);
  const [isSendingImage, setIsSendingImage] = useState(false);
  const { fileUrl, rawFile } = imageForm;

  //send message handler
  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsSending(true);

      const response = await axios.post("/api/messages", {
        message: message,
        conversationId: conversationId,
      });

      if (response?.data?.success === true) {
        setMessage("");
        router.refresh();
      }
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        toast.error(error?.response?.data?.error);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setIsSending(false);
      router.refresh();
    }
  };

  //send image handler
  const sendImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsSendingImage(true);

      const response = await axios.post("/api/messages", {
        image: fileUrl,
        conversationId: conversationId,
      });

      if (response?.data?.success === true) {
        setImageForm({
          rawFile: null,
          fileUrl: "",
        });
        setOpenImage(false);
        router.refresh();
      }
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        toast.error(error?.response?.data?.error);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setIsSendingImage(false);
      router.refresh();
    }
  };
  return (
    <>
      <form
        onSubmit={sendMessage}
        className="flex items-center p-4 pb-6 space-x-2 bg-white border-t "
      >
        <div className="relative w-full">
          <button
            type="button"
            className="absolute top-2 left-2 h-[24px] w-[24px] rounded-full p-1 flex items-center justify-center"
            onClick={() => setOpenImage(true)}
          >
            <ImageIcon className="text-blue-700 transition" />
          </button>
          <Input
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            disabled={isSending}
            placeholder="Write a message"
            className="
          text-black
          font-light
          px-10 py-5
          bg-neutral-100 
          w-full 
          rounded-full
          focus:outline-none
          disabled:opacity-30
        "
          />
          <div className="absolute top-2 right-2">
            <EmojiPicker
              onChange={(emoji: string) => {
                setMessage((prevContent) => `${prevContent} ${emoji}`);
              }}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isSending}
          className="
            rounded-full 
            p-2 
            bg-blue-700 
            cursor-pointer 
            hover:bg-blue-600 
            transition
            disabled:opacity-30
          "
        >
          <HiPaperAirplane size={18} className="text-white" />
        </button>
      </form>

      {/* image part */}
      <Dialog open={openImage} onOpenChange={handleClose}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden select-none">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">
              Send an image
            </DialogTitle>
            <DialogDescription className="text-center text-gray-500">
              Send image as a message
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={sendImage} className="mx-5 space-y-4">
            <div
              {...getRootProps()}
              className="border-2 border-dashed flex flex-col justify-center items-center rounded-lg p-10 cursor-pointer"
            >
              <input {...getInputProps()} />
              <UploadCloud className="h-10 w-10 fill-gray-200 stroke-gray-400" />
              {rawFile !== null ? (
                <p className="text-center font-thin">{rawFile?.name}</p>
              ) : (
                <p className="text-center font-thin">
                  Drag 'n' drop an image or pdf here,
                  <br /> or click to select one
                </p>
              )}
            </div>

            {fileUrl && (
              <div className="flex justify-center items-center">
                <div className="w-32 h-32 relative">
                  <Image
                    fill
                    src={fileUrl}
                    alt="Upload"
                    className="rounded-full object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setImageForm((prev) => ({
                        ...prev,
                        rawFile: null,
                        fileUrl: "",
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

            <DialogFooter className="px-1 py-3 rounded-md">
              <Button
                type="submit"
                disabled={isSendingImage}
                className="w-full"
              >
                Send
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConversationInputForm;
