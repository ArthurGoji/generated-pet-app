import React from "react"
import { Outlet } from "react-router-dom"
import Header from "./Header"
import ServerStatusIndicator from "../ui/ServerStatusIndicator"

const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 to-green-50">
      <Header />
      <main className="flex-1 container py-8 mx-auto px-4 flex justify-center">
        <div className="w-full max-w-5xl">
          <Outlet />
        </div>
      </main>
      <footer className="border-t py-4 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} PetCare. All rights reserved.
          </p>
          <ServerStatusIndicator />
        </div>
      </footer>
    </div>
  )
}

export default Layout
