import { getSession, useSession } from "next-auth/react"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import DashboardLayout from "@/layouts/DashboardLayout"
import UsersActivityChart from "@/components/users/UsersActivityChart"
import RecentLogins from "@/components/users/RecentLogins"
import UsersTable from "@/components/users/UsersTable"
import SuspiciousActivity from "@/components/users/SuspiciousActivity"

export default function DashboardPage() {
  const { data: session } = useSession()

  const router = useRouter()
  const tab = typeof router.query.tab === "string" ? decodeURIComponent(router.query.tab) : "Users"

  const renderContent = () => {
    if (session?.user.role !== "admin") {
      return <UsersTable />
    }

    switch (tab) {
      case "Activity Chart":
        return <UsersActivityChart />
      case "Recent Logins":
        return <RecentLogins />
      case "Users":
        return <UsersTable />
      case "Suspicious Activity":
        return <SuspiciousActivity />
      default:
        return <UsersTable />
    }
  }

  return (
    <DashboardLayout>
      {renderContent()}
    </DashboardLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req })

  if (!session) {
    return {
      redirect: {
        destination: "/auth/sign-in",
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
