import { FC, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import dayjs from "dayjs"

type RecentUser = {
  id: number
  name: string
  email: string
  lastLogin: string
}

const RecentLogins: FC = () => {
  const [recentLogins, setRecentLogins] = useState<RecentUser[]>([])

  useEffect(() => {
    const today = dayjs()

    const users: RecentUser[] = Array.from({ length: 8 }).map((_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      lastLogin: today
        .subtract(Math.floor(Math.random() * 5), "day")
        .format("YYYY-MM-DD HH:mm"),
    }))

    setRecentLogins(users.sort((a, b) => dayjs(b.lastLogin).unix() - dayjs(a.lastLogin).unix()))
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Logins</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentLogins.map((user) => (
          <div key={user.id} className="flex justify-between text-sm">
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
            <p className="text-right text-muted-foreground">
              {dayjs(user.lastLogin).format("DD.MM.YYYY HH:mm")}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default RecentLogins
