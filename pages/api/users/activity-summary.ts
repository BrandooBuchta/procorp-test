import { NextApiRequest, NextApiResponse } from "next"
import dayjs from "dayjs"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const today = dayjs()

  const last30Days = Array.from({ length: 30 }).map((_, i) => ({
    date: today.subtract(29 - i, "day").format("YYYY-MM-DD"),
    totalLogins: Math.floor(Math.random() * 20),
  }))

  res.status(200).json(last30Days)
}
