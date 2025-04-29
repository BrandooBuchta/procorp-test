"use client"

import { FC, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import { toast } from "sonner"

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
}

interface ActivityDay {
  date: string
  logins: number
}

interface UserActivity {
  userId: number
  totalLogins30Days: number
  last30Days: ActivityDay[]
}

interface SuspiciousUser {
  user: User
  totalSuspiciousDays: number
  highestLoginCount: number
  averageLoginCount: number
}

const SuspiciousActivity: FC = () => {
  const [suspiciousUsers, setSuspiciousUsers] = useState<SuspiciousUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSuspicious = async () => {
      try {
        const { data: { users } } = await axios.get<{ users: User[] }>("https://dummyjson.com/users")
        const detected: SuspiciousUser[] = []

        for (const user of users.slice(0, 10)) {
          const { data: activity } = await axios.get<UserActivity>(`/api/users/${user.id}/activity`)
          const loginCounts = activity.last30Days.map((day) => day.logins)

          const suspiciousDays = activity.last30Days.filter(day => day.logins > 10).length
          const totalLogins = loginCounts.reduce((sum, val) => sum + val, 0)
          const averageLogins = totalLogins / loginCounts.length
          const highestLogin = Math.max(...loginCounts)

          const isSuspicious =
            suspiciousDays >= 3 ||
            (averageLogins > 0 && highestLogin >= 15 && highestLogin >= averageLogins * 4)

          if (isSuspicious) {
            detected.push({
              user,
              totalSuspiciousDays: suspiciousDays,
              highestLoginCount: highestLogin,
              averageLoginCount: parseFloat(averageLogins.toFixed(2)),
            })
          }
        }

        setSuspiciousUsers(detected)
      } catch {
        toast.error("Failed to fetch suspicious activity")
      } finally {
        setLoading(false)
      }
    }

    fetchSuspicious()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Suspicious Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Loading suspicious users...</p>
        </CardContent>
      </Card>
    )
  }

  if (!suspiciousUsers.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Suspicious Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">No suspicious users detected. ✅</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suspicious Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suspiciousUsers.map((suspect) => (
          <div key={suspect.user.id} className="flex flex-col gap-1 text-sm">
            <div className="flex justify-between">
              <div>
                <p className="font-medium">
                  {suspect.user.firstName} {suspect.user.lastName}
                </p>
                <p className="text-muted-foreground text-xs">{suspect.user.email}</p>
              </div>
              <div className="text-right text-xs">
                <p>Suspicious Days: {suspect.totalSuspiciousDays}</p>
                <p>Avg Logins/Day: {suspect.averageLoginCount}</p>
                <p>Max Logins: {suspect.highestLoginCount}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default SuspiciousActivity
