import { FC } from "react"
import DashboardLayout from "@/layouts/DashboardLayout"
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import dayjs from "dayjs"
import { GetServerSideProps } from "next"
import Image from "next/image"

interface LoginEntry {
  id: number
  date: string
  device: string
  browser: string
  ip: string
}

interface ActivityData {
  id: number
  name: string
  email: string
  image?: string
  avatar?: string
  role: string
  status: string
  totalLogins30Days: number
  totalLogins3Days: number
  lastActiveDate: string
  last30Days: { date: string; logins: number }[]
  loginHistory: LoginEntry[]
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
        <div className="flex items-center gap-4">
          <Image
            src={activity.avatar || activity.image || "/placeholder.svg"}
            alt={activity.name}
            width={60}
            height={60}
            className="rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold">{activity.name}</h1>
            <p className="text-muted-foreground">{activity.email}</p>
            <p className="text-sm text-gray-500">Role: {activity.role} | Status: {activity.status}</p>
          </div>
        </div>

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
                {dayjs(activity.lastActiveDate).format("DD.MM.YYYY HH:mm")}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Login Activity (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
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
    return { props: { activity: data } }
  } catch (error) {
    console.error("Failed to fetch activity:", error)
    return {
      props: {
        activity: null,
        error: "Failed to load user activity.",
      },
    }
  }
}
