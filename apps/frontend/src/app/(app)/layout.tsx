import React from "react"

import { Navbar } from "@/src/components/navbar/navbar"
import PageTracker from "@/src/components/PageTracker"
import { Sidebar } from "@/src/components/Sidebar/Sidebar"
import { Topbar } from "@/src/components/topbar/topbar"
import { Toaster } from "@/src/components/ui/toaster"
import { AuthProvider } from "@/src/contexts/AuthContext"
import ModalProvider from "@/src/contexts/ModalProvider"
import { QueryProvider } from "@/src/contexts/QueryProvider"
interface Props {
  children: React.ReactNode
}

export default async function AppLayout({ children }) {
  return (
    <AuthProvider>
      <QueryProvider>
        <ModalProvider>
          <main className="flex h-screen flex-col bg-background">
            <Topbar />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <div className="flex flex-1 flex-col pl-52">
                <Navbar />
                <div className="flex flex-1 overflow-hidden">
                  <PageTracker />
                  <section className="flex-1 overflow-auto pt-5">
                    {children}
                  </section>
                </div>
              </div>
            </div>
            <Toaster />
          </main>
        </ModalProvider>
      </QueryProvider>
    </AuthProvider>
  )
}
