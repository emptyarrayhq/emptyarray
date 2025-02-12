"use server"

import axios from "axios"

import { Event } from "../../@types/Items/event"
import { BACKEND_URL } from "../../constants/urls"

export const getEventsByDate = async (
  session: string,
  date: string
): Promise<Event[]> => {
  const response = await axios.get(`${BACKEND_URL}/calendar/events/${date}`, {
    headers: {
      Authorization: `Bearer ${session}`,
    },
  })
  return response.data.events
}
