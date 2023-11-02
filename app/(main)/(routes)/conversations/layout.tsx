import ConversationList from "./components/conversation-list";
import { getConversations, getUsers } from "@/app/actions";
import { User } from "@prisma/client";
import { FullConversationType } from "@/typings";
import { getCurrentUser } from "@/app/lib/auth";
import PrimaryLayout from "@/app/components/sidebar/primary-layout";

const ConcersationLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const currentUser = await getCurrentUser();
  const users = (await getUsers()) as User[];
  const conversations = (await getConversations()) as FullConversationType[];
  return (
    <PrimaryLayout>
      <div className="h-full">
        <ConversationList
          users={users}
          initialConversations={conversations}
          currentUser={currentUser}
        />
        {children}
      </div>
    </PrimaryLayout>
  );
};

export default ConcersationLayout;
