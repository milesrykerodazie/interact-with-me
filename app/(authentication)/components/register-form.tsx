"use client";
import React from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import animationData from "../../assets/auth-animation.json";
import Image from "next/image";
import RegisterDetails from "./register-form-details";
import { useRef } from "react";
import { User } from "@prisma/client";

const RegisterForm = () => {
  const animateRef = useRef<LottieRefCurrentProps>(null);
  return (
    <div
      className="
          flex 
          flex-col
          md:flex-row
          min-h-screen 
          justify-center
          items-center
          sm:px-6 
          lg:px-8 
          bg-white
        "
    >
      <div className="hidden md:block w-full">
        <Lottie
          onComplete={() => {
            animateRef.current?.goToAndPlay(30, true);
          }}
          lottieRef={animateRef}
          loop={false}
          animationData={animationData}
        />
      </div>
      <div className="w-full">
        <Image
          height="48"
          width="48"
          className="mx-auto w-auto"
          src="/images/logo.png"
          alt="Logo"
        />
        <h2
          className="
              mt-6 
              text-center 
              text-3xl 
              font-bold 
              tracking-tight 
              text-gray-900
            "
        >
          Sign Up
        </h2>
        <RegisterDetails />
      </div>
    </div>
  );
};

export default RegisterForm;
