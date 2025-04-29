"use client"

import { FC, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import dayjs from "dayjs"
import { toast } from "sonner"

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
}

interface UserActivity {
  lastActiveDate: string
}

interface RecentUser {
  id: number
  name: string
  email: string
  lastActiveDate: string
}

const RecentLogins: FC = () => {
  const [recentLogins, setRecentLogins] = useState<RecentUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogins = async () => {
      try {
        const { data: { users } } = await axios.get<{ users: User[] }>("https://dummyjson.com/users")

        const selectedUsers = users.slice(0, 10)
        const loginData: RecentUser[] = []

        for (const user of selectedUsers) {
          const { data: activity } = await axios.get<UserActivity>(`/api/users/${user.id}/activity`)
          loginData.push({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            lastActiveDate: activity.lastActiveDate,
          })
        }

        loginData.sort(
          (a, b) =>
            dayjs(b.lastActiveDate).unix() - dayjs(a.lastActiveDate).unix()
        )

        setRecentLogins(loginData)
      } catch (err) {
        toast.error("Failed to load recent logins.")
      } finally {
        setLoading(false)
      }
    }

    fetchLogins()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Logins</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-center text-muted-foreground">Loading recent users...</p>
        ) : recentLogins.length === 0 ? (
          <p className="text-center text-muted-foreground">No recent activity.</p>
        ) : (
          recentLogins.map((user) => (
            <div key={user.id} className="flex justify-between text-sm">
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <p className="text-right text-muted-foreground">
                {dayjs(user.lastActiveDate).format("DD.MM.YYYY HH:mm")}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

export default RecentLogins
