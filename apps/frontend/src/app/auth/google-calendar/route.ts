import axios from "axios"
import { NextRequest, NextResponse } from "next/server"

import {
  GOOGLECALENDAR_ACCESS_TOKEN,
  GOOGLECALENDAR_REFRESH_TOKEN,
} from "@/src/lib/constants/cookie"
import { BACKEND_URL } from "@/src/lib/constants/urls"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const state = searchParams.get("state")

  if (!code) {
    console.error("No code received from Google Calendar")
    return NextResponse.redirect(new URL("/login?error=no_code", request.url))
  }

  const cookies = request.cookies
  const session = cookies.get("__MARCH_ACCESS_TOKEN__")
  const token = session?.value

  try {
    const response = await axios.get(`${BACKEND_URL}/calendar/getAccessToken`, {
      params: { code },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const { accessToken, refreshToken } = response.data.tokenInfo

    let redirectUrl = "/profile"
    if (state) {
      try {
        const stateData = JSON.parse(decodeURIComponent(state))
        if (stateData.redirect) {
          redirectUrl = stateData.redirect
        }
      } catch (error) {
        console.error("Error parsing state:", error)
      }
    }

    const res = NextResponse.redirect(new URL(redirectUrl, request.url))
    res.cookies.set(GOOGLECALENDAR_ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })
    res.cookies.set(GOOGLECALENDAR_REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })
    return res
  } catch (error) {
    console.error("Error in Google Calendar callback:", error)
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data)
    }
    return NextResponse.redirect(
      new URL("/login?error=calendar_authentication_failed", request.url)
    )
  }
}
