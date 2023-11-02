import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Conversation, User } from "@prisma/client";

interface UserAvatarProps {
  user?: User;
  className?: string;
  conversation?: Conversation;
}

export const UserAvatar = ({
  user,
  className,
  conversation,
}: UserAvatarProps) => {
  return (
    <Avatar className={cn("h-8 w-8 md:h-12 md:w-12 outline-none", className)}>
      {conversation && (
        <AvatarImage
          src={
            conversation?.groupConversationImage
              ? conversation?.groupConversationImage
              : "https://res.cloudinary.com/dcymjefv8/image/upload/v1698572261/simple_messaging_app/users/image/no-user_dib75q.png"
          }
        />
      )}
      {user && (
        <AvatarImage
          src={
            user?.image
              ? user?.image
              : "https://res.cloudinary.com/dcymjefv8/image/upload/v1698572261/simple_messaging_app/users/image/no-user_dib75q.png"
          }
        />
      )}
    </Avatar>
  );
};
