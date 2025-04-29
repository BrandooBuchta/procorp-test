import { NextApiRequest, NextApiResponse } from "next"
import dayjs from "dayjs"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  const today = dayjs()

  const last30Days = Array.from({ length: 30 }).map((_, i) => ({
    date: today.subtract(29 - i, "day").format("YYYY-MM-DD"),
    logins: Math.floor(Math.random() * 5),
  }))

  const totalLogins30Days = last30Days.reduce((acc, curr) => acc + curr.logins, 0)
  const totalLogins3Days = last30Days.slice(-3).reduce((acc, curr) => acc + curr.logins, 0)
  const lastActiveDate = last30Days
    .filter((d) => d.logins > 0)
    .slice(-1)[0]?.date || today.format("YYYY-MM-DD")

  res.status(200).json({
    userId: Number(id),
    totalLogins30Days,
    totalLogins3Days,
    last30Days,
    lastActiveDate,
  })
}
