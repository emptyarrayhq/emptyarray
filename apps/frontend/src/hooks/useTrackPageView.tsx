"use client"

import { useEffect } from "react"

import { useLogSnag } from "@logsnag/next"
import { usePathname } from "next/navigation"

export function useTrackPageView(userId: string | null) {
  const { track } = useLogSnag()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname && userId) {
      track({
        channel: "user-activity",
        event: `Page View ${pathname}`,
        user_id: userId,
        description: `User visited ${pathname}`,
        tags: {
          page: pathname,
          user: userId,
        },
      })
    }
  }, [pathname, userId, track])
}
