"use client";
import Lottie from "lottie-react";
import animationData from "../../assets/chat-icon-animate.json";

const style = {
  height: 500,
};

const EmptyState = () => {
  return (
    <div
      className="
          px-4 
          py-10 
          sm:px-6 
          lg:px-8 
          lg:py-6 
          h-full 
          flex  
          justify-center 
          overflow-hidden
          items-center 
          bg-gray-50
        "
    >
      <div className="text-center items-center flex flex-col">
        <div className="w-full">
          <Lottie animationData={animationData} style={style} />
        </div>
        <h3 className="mt-2 text-2xl font-semibold text-gray-900">
          Select a chat or start a new conversation
        </h3>
      </div>
    </div>
  );
};

export default EmptyState;
