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
          const last3Days = activity.last30Days.slice(-3)
          const totalLoginsLast3Days = last3Days.reduce((sum, day) => sum + day.logins, 0)

          if (totalLoginsLast3Days > 3) {
            detected.push({
              user,
              totalSuspiciousDays: 0,
              highestLoginCount: Math.max(...last3Days.map(day => day.logins)),
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
                <p className="font-medium">{suspect.user.firstName} {suspect.user.lastName}</p>
                <p className="text-muted-foreground text-xs">{suspect.user.email}</p>
              </div>
              <div className="text-right">
                <p className="text-xs">Highest Logins (3d): {suspect.highestLoginCount}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default SuspiciousActivity
