"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenu,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import UserProfileDialog from "../../auth/components/user-profile-dialog";
import {
  Zap,
  Lightbulb,
  Database,
  Compass,
  Flame,
  Terminal,
  Code2,
  Rocket,
  Leaf,
  Triangle,
  Star,
  Server,
  Gauge,
  Cloud,
  Layers,
  Boxes,
  Coffee,
  Wind,
  Settings,
  Gem,
  Container,
  FileCode,
  Package,
  Globe,
  Home,
  LayoutDashboardIcon,
  PlusCircleIcon,
  History,
  FolderPlus,
  Settings2,
  LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

interface PlaygroundDataProps {
  id: string;
  name: string;
  icon: string;
  starred: boolean;
}

const lucideIconMap: Record<string, LucideIcon> = {
  Zap,
  Lightbulb,
  Database,
  Compass,
  Flame,
  Terminal,
  Code2,
  Rocket,
  Leaf,
  Triangle,
  Star,
  Server,
  Gauge,
  Cloud,
  Layers,
  Boxes,
  Coffee,
  Wind,
  Settings,
  Gem,
  Container,
  FileCode,
  Package,
  Globe,
};

const DashboardSidebar = ({
  initialPlaygroundData,
}: {
  initialPlaygroundData: PlaygroundDataProps[];
}) => {
  const pathname = usePathname();
  const [starredPlaygrounds, setStarredPlaygrounds] = useState(
    initialPlaygroundData.filter((p) => p.starred),
  );
  const [recentPlaygrounds, setRecentPlaygrounds] = useState(
    initialPlaygroundData,
  );

  return (
    <Sidebar variant="inset" collapsible="icon" className="border border-r">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-3 justify-center">
          <Image src="./logo.svg" alt="logo" height={60} width={60} />
        </div>
      </SidebarHeader>

      {/* Home */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/"}
                tooltip={"Home"}
                title="home"
              >
                <Link href={"/"}>
                  <Home className="size-4" />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Dashboard */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/dashboard"}
                tooltip={"Dashboard"}
                title="dashboard"
              >
                <Link href="/dashboard">
                  <LayoutDashboardIcon className="size-4" />
                  <span>DashBoard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* sttared */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <Star className="size-4 mr-2" />
            <span>Starred</span>
          </SidebarGroupLabel>
          <SidebarGroupAction title="Add new Playground">
            <PlusCircleIcon className="size-4" />
          </SidebarGroupAction>

          <SidebarGroupContent>
            <SidebarMenu>
              {starredPlaygrounds.length == 0 &&
              recentPlaygrounds.length == 0 ? (
                <div className="text-center text-muted-foreground py-4 w-full">
                  Create Your PlayGround
                </div>
              ) : (
                starredPlaygrounds.map((playground) => {
                  const IconComponent = lucideIconMap[playground.icon] || Code2;
                  return (
                    <SidebarMenuItem key={playground.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === `/playground/${playground.id}`}
                        tooltip={playground.name}
                      >
                        <Link href={`/playground/${playground.id}`}>
                          {IconComponent && (
                            <IconComponent className="size-4" />
                          )}
                          <span>{playground.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* History/Recent */}

        <SidebarGroup>
          <SidebarGroupLabel>
            <History className="h-4 w-4 mr-2" />
            <span>Recent</span>
          </SidebarGroupLabel>
          <SidebarGroupAction title="View All">
            <FolderPlus className="h-4 w-4" />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {starredPlaygrounds.length === 0 && recentPlaygrounds.length === 0
                ? null
                : recentPlaygrounds.map((playground) => {
                    const IconComponent =
                      lucideIconMap[playground.icon] || Code2;
                    return (
                      <SidebarMenuItem key={playground.id}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === `/playground/${playground.id}`}
                          tooltip={playground.name}
                        >
                          <Link href={`/playground/${playground.id}`}>
                            {IconComponent && (
                              <IconComponent className="h-4 w-4" />
                            )}
                            <span>{playground.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="View all">
                  <Link href="/playgrounds">
                    <span className="text-sm text-muted-foreground">
                      View all playgrounds
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* footer */}

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between px-2 py-2">
              <SidebarMenuButton asChild tooltip={"Settings"}>
                <Link href="/settings">
                  <Settings2 className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
              <div className="ml-2">
                <UserProfileDialog />
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default DashboardSidebar;
