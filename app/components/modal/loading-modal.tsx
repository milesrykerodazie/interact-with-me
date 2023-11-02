"use client";
import React from "react";
import { CircleLoader } from "react-spinners";

const LoadingModal = () => {
  return (
    <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
      <div className="flex justify-center items-center h-screen">
        <CircleLoader size={40} color="#1d4ed8" />
      </div>
    </div>
  );
};

export default LoadingModal;
