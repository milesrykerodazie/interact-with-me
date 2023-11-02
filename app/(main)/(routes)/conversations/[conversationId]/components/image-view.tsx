import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";

interface ImageViewTypes {
  openImage: boolean;
  onClose: () => void;
  src: string;
}

const ImageView: React.FC<ImageViewTypes> = ({ openImage, onClose, src }) => {
  return (
    <Dialog open={openImage} onOpenChange={onClose}>
      <DialogContent className="pt-8 px-6">
        <div className="h-[600px] w-96 md:h-96">
          <Image className="object-contain" fill alt="Image" src={src} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageView;
