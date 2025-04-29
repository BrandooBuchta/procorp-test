"use client"

import { FC, useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import axios from "axios"
import dayjs from "dayjs"

interface ActivitySummary {
  date: string
  totalLogins: number
}

const UsersActivityChart: FC = () => {
  const [data, setData] = useState<ActivitySummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get<ActivitySummary[]>("/api/users/activity-summary")
        setData(
          data.map(item => ({
            ...item,
            date: dayjs(item.date).format("DD.MM"),
          }))
        )
        setError(null)
      } catch {
        setError("Failed to load activity data.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <p className="text-center">Loading...</p>
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>
  }

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="totalLogins" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default UsersActivityChart
