"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Building2,
  Command,
  Frame,
  GalleryVerticalEnd,
  LibraryBig,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  User,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  AblyProvider,
  ChannelProvider,
  useChannel,
  useConnectionStateListener,
} from "ably/react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { Session } from "inspector/promises";
import Image from "next/image";
import { useRouter } from "next/navigation";

// This is sample data.
const data = {
  user: {
    username: "john doe",
    email: "john@156.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Purchase Orders",
      url: "/purchaseOrder",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Purchase Orders",
          url: "/purchaseOrder",
        },
        {
          title: "New Purchase Order",
          url: "/purchaseOrder/new",
        },
        // {
        //   title: "Settings",
        //   url: "#",
        // },
      ],
    },
  ],
  projects: [
    {
      name: "Users Management",
      url: "/manage/users",
      icon: Users,
    },
    {
      name: "Companies Management",
      url: "/manage/companies",
      icon: Building2,
    },
    {
      name: "Projects Management",
      url: "/manage/projects",
      icon: LibraryBig,
    },
  ],
};

export function AppSidebar({
  session,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  session: {
    user: {
      username: string;
      email: string;
      avatar?: string;
      role: { roleId: string; role: string };
    };
  };
}) {
  // console.log(session);
  const router = useRouter();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className=""
          onClick={() => {
            router.push("/");
          }}
        >
          <Image src="/logo.png" alt="logo" width={30} height={30} />

          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">165 Purchase Orders</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {session.user.role.role === "admin" && (
          <NavProjects projects={data.projects} />
        )}
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session?.user || data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

// you fucking learn allot in here
