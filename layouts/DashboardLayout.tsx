import AppSidebar from "@/components/app-sidebar"
import SiteHeader from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { FC, JSX } from "react"

export const iframeHeight = "800px"

export const description = "A sidebar with a header and a search form."

const DashboardLayout: FC<{ children: JSX.Element | JSX.Element[] }> = ({ children }) => {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}

export default DashboardLayout;