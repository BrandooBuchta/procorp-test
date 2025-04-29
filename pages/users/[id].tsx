import { FC } from "react"
import DashboardLayout from "@/layouts/DashboardLayout"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import dayjs from "dayjs"
import { GetServerSideProps } from "next"
import { toast } from "sonner"

interface ActivityData {
  userId: number
  totalLogins30Days: number
  totalLogins3Days: number
  last30Days: { date: string; logins: number }[]
  lastActiveDate: string
}

interface UserDetailPageProps {
  activity: ActivityData | null
  error?: string
}

const UserDetailPage: FC<UserDetailPageProps> = ({ activity, error }) => {
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex h-screen items-center justify-center">
          <p className="text-destructive">{error}</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!activity) {
    return (
      <DashboardLayout>
        <div className="flex h-screen items-center justify-center">
          <p>No activity found.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-4">
        <h1 className="text-2xl font-bold">User {activity.userId} Activity</h1>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Logins (30 days)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{activity.totalLogins30Days}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Logins (Last 3 days)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{activity.totalLogins3Days}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Last Active</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {dayjs(activity.lastActiveDate).format("DD.MM.YYYY")}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={activity.last30Days.map((day) => ({
                date: dayjs(day.date).format("DD.MM"),
                logins: day.logins,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="logins" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default UserDetailPage

export const getServerSideProps: GetServerSideProps<UserDetailPageProps> = async (context) => {
  const { id } = context.query

  if (!id || Array.isArray(id)) {
    return {
      props: {
        activity: null,
        error: "Invalid user ID.",
      },
    }
  }

  const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
  const host = context.req.headers.host
  const baseUrl = `${protocol}://${host}`

  try {
    const { data } = await axios.get<ActivityData>(`${baseUrl}/api/users/${id}/activity`)

    return {
      props: {
        activity: data,
      },
    }
  } catch (error) {
    console.error("Failed to fetch activity:", error)
    toast.error("Failed to load user activity. Please try again later.")
  
    return {
      props: {
        activity: null,
        error: "Failed to load user activity. Please try again later.",
      },
    }
  }
}
