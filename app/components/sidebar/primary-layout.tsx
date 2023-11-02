import { getCurrentUser } from "@/app/lib/auth";
import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";
import { getUsers } from "@/app/actions";
import { User } from "@prisma/client";

async function PrimaryLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();
  const users = (await getUsers()) as User[];

  return (
    <div className="h-full">
      <DesktopSidebar currentUser={currentUser} users={users} />
      <MobileFooter currentUser={currentUser} users={users} />
      <main className="lg:pl-20 h-screen">{children}</main>
    </div>
  );
}

export default PrimaryLayout;
