import { cn } from "@/lib/utils";
import React from "react";;
import Home from "../home";

export function DotBackgroundDemo() {
  return (
    <div
      className="relative flex h-screen w-full items-center justify-center bg-white dark:bg-black">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
          "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]"
        )} />
      {/* Radial gradient for the container to give a faded look */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>

      <div className="absolute lg:w-1/2 md:w-3/4 w-full
       top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:p-4 p-2">
        <Home />
      </div>

    </div>
  );
}
