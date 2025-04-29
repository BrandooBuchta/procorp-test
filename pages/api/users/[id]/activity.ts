import { NextApiRequest, NextApiResponse } from "next"
import dayjs from "dayjs"
import axios from "axios"

const devices = ["desktop", "mobile", "tablet"]
const browsers = ["Chrome", "Safari", "Firefox", "Edge"]
const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid ID." })
  }

  try {
    const userRes = await axios.get(`https://dummyjson.com/users/${id}`)
    const user = userRes.data

    const today = dayjs()

    const last30Days = Array.from({ length: 30 }).map((_, i) => {
      const date = today.subtract(29 - i, "day").toISOString()
      const logins = Math.floor(Math.random() * 18)
      return { date, logins }
    })

    const loginHistory = last30Days.flatMap(({ date, logins }, index) =>
      Array.from({ length: logins }).map((_, i) => ({
        id: index * 10 + i + 1,
        date,
        device: getRandom(devices),
        browser: getRandom(browsers),
        ip: `192.168.1.${Math.floor(Math.random() * 100)}`,
      }))
    )

    const totalLogins30Days = loginHistory.length
    const totalLogins3Days = loginHistory.filter((l) =>
      dayjs(l.date).isAfter(today.subtract(3, "day"))
    ).length

    const lastActiveDate = loginHistory.slice(-1)[0]?.date || today.toISOString()

    res.status(200).json({
      ...user,
      role: "user",
      status: "online",
      loginHistory,
      totalLogins30Days,
      totalLogins3Days,
      lastActiveDate,
      last30Days,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Failed to fetch user data." })
  }
}