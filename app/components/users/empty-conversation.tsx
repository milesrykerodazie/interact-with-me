import Lottie from "lottie-react";
import animationData from "../../assets/not-found.json";
const style = {
  height: 300,
};
const EmptyConversation = () => {
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
            items-center 
            bg-gray-50
          "
    >
      <div className="text-center items-center flex flex-col">
        <Lottie animationData={animationData} style={style} />
        <h3 className="mt-2 text-2xl font-semibold text-gray-900">
          This conversation does not exist anymore 🚫 <br />
          Select a chat or start a new conversation
        </h3>
      </div>
    </div>
  );
};

export default EmptyConversation;
