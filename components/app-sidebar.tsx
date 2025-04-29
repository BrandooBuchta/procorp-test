import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { PieChart, Send, ShieldAlert, Users } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useSession } from "next-auth/react"

const tabs = [
  { name: "Users", icon: Users },
  { name: "Activity Chart", icon: PieChart },
  { name: "Recent Logins", icon: Send },
  { name: "Suspicious Activity", icon: ShieldAlert },
]

function getInitials(name: string) {
  if (!name) return ''
  const words = name.replace(/([a-z])([A-Z])/g, '$1 $2').split(/\s+/)
  return words.map(word => word.charAt(0).toUpperCase()).join('')
}

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { data: session } = useSession()

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader />
      <SidebarContent>
        <SidebarMenu>
          {tabs.map((tab) => (
            <SidebarMenuItem key={tab.name}>
              <SidebarMenuButton asChild data-cy={`item-${encodeURIComponent(tab.name)}`}>
                <Link href={`/dashboard?tab=${tab.name}`}>
                  <tab.icon className="size-4 ml-5" />
                  {tab.name}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
      {session?.user && <div className="flex items-center justify-between gap-4 px-2 pb-2">
        <Avatar className="h-8 w-8">
          {session.user.image && <AvatarImage src={session.user.image} />}
          <AvatarFallback>
            {session.user.name && getInitials(session.user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-end text-right">
          <span className="truncate font-medium text-sm">{session.user.name}</span>
          <span className="truncate text-xs text-muted-foreground">{session.user.email}</span>
        </div>
      </div>}
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar;