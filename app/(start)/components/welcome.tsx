"use client";
import Lottie from "lottie-react";
import animationData from "../../assets/welcome-animation.json";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const style = {
  height: 600,
};
const mobilestyle = {
  height: 300,
};

const WelcomePage = () => {
  return (
    <div className=" min-h-screen flex flex-col lg:flex-row overflow-hidden px-3 justify-center items-center lg:gap-3 pb-10">
      <div className="md:hidden w-full">
        <Lottie animationData={animationData} style={mobilestyle} />
      </div>
      <div className="hidden md:block w-full">
        <Lottie animationData={animationData} style={style} />
      </div>

      <div className="w-full flex flex-col select-none">
        <h2 className=" text-3xl lg:text-5xl font-bold capitalize text-center mb-3 text-blue-700">
          Welcome to interact with me
        </h2>
        <span className="mb-3 text-sm md:text-base">
          Streamline your communication with our simple messaging app. Connect
          effortlessly through text and images, making interactions engaging and
          convenient. Share messages and moments with friends and family,
          enhancing your connections and staying connected in a fun and
          user-friendly way.
        </span>
        <div className="space-x-4">
          <Link href={"/auth/register"}>
            <Button>Get Started</Button>
          </Link>
          <Link href={"/auth/login"}>
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
