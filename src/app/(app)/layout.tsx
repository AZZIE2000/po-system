import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import SocketProvider from "@/providers/socket/socket-provider";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { Notifications } from "./_components/notifications";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) redirect("/login");
  return (
    <SidebarProvider>
      <AppSidebar session={session as any} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
            <div className="mx-6">
              <Notifications />
            </div>
          </div>
        </header>
        <SocketProvider>{children}</SocketProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
