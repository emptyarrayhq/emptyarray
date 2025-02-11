import React from "react"

import { LogoDark } from "./Logo"

const Loader = (): JSX.Element => {
  return (
    <div className="flex h-screen items-center justify-center bg-primary">
      <div className="flex flex-col items-center justify-center gap-12">
        <div className="relative">
          <div className="relative z-10 rounded-full p-3">
            <LogoDark />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-5">
          <p className="text-foreground">sit tight, loading some javascripts</p>
          <p className="dark:text-neutral-600">— written by our interns;</p>
        </div>
      </div>
    </div>
  )
}

export default Loader
