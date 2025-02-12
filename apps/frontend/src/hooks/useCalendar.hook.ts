import { useState } from "react"

import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
  viewWeek,
} from "@schedule-x/calendar"
import { createCurrentTimePlugin } from "@schedule-x/current-time"
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop"
import { createEventModalPlugin } from "@schedule-x/event-modal"
import { createEventsServicePlugin } from "@schedule-x/events-service"
import { useNextCalendarApp } from "@schedule-x/react"
import { createResizePlugin } from "@schedule-x/resize"

interface CalendarEvent {
  id: number
  title: string
  start: string
  end: string
}

interface UseCalendarProps {
  events?: CalendarEvent[]
  defaultView?: string
  theme?: string
}

const useCalendar = ({
  events,
  defaultView = viewWeek.name,
  theme = "shadcn",
}: UseCalendarProps = {}) => {
  const plugins = [
    createDragAndDropPlugin(),
    createResizePlugin(),
    createCurrentTimePlugin(),
    createEventModalPlugin(),
    createEventsServicePlugin(),
  ]

  const calendar = useNextCalendarApp(
    {
      defaultView,
      views: [
        createViewDay(),
        createViewWeek(),
        createViewMonthGrid(),
        createViewMonthAgenda(),
      ],
      events,
      theme,
    },
    plugins
  )

  return {
    calendar,
  }
}

export default useCalendar
