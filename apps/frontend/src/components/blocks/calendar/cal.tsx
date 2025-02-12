"use client"

import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"

export const CalendarBlock = () => {
  return (
    <div className="bg-background">
      <FullCalendar
        plugins={[timeGridPlugin, timeGridPlugin]}
        initialView="timeGridDay"
        headerToolbar={false}
      />
    </div>
  )
}
