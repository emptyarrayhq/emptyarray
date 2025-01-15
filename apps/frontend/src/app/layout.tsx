import * as React from "react"

import type { Viewport } from "next"

import { LogSnagProvider } from "@logsnag/next"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { Inter, Source_Serif_4, JetBrains_Mono } from "next/font/google"

import "../styles/main.css"
import "../styles/tiptap.css"
import { ThemeProvider } from "../components/ThemeProvider"
import { Navbar } from "../components/navbar/navbar"
import { AuthProvider } from "../contexts/AuthContext"
import classNames from "@/src/utils/classNames"

const sansFont = Inter({
  variable: "--sans-font",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

const serifFont = Source_Serif_4({
  variable: "--serif-font",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
})

const monoFont = JetBrains_Mono({
  variable: "--mono-font",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
})

export const viewport: Viewport = {
  themeColor: "#000000",
}

interface Props {
  children: React.ReactNode
}

const RootLayout: React.FC<Props> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <LogSnagProvider
          token={process.env.NEXT_PUBLIC_LOGSNAG_TOKEN ?? ""}
          project={process.env.NEXT_PUBLIC_LOGSNAG_PROJECT_NAME ?? ""}
        />
      </head>
      <body
        className={classNames(
          sansFont.variable,
          serifFont.variable,
          monoFont.variable,
          "min-h-screen font-sans antialiased"
        )}
      >
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""}>
          <AuthProvider>
            <ThemeProvider>
              <Navbar />
              {children}
            </ThemeProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}

export default RootLayout
