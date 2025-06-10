import Image from "next/image";
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30">
      <div className="w-full max-w-md p-8 bg-background rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            {/* <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                MD
              </span>
            </div> */}
            <Image
              src="/logo.svg"
              alt="MargaDarshi Logo"
              width={32}
              height={32}
              className="rounded-md"
            />
            <p className="text-xl font-semibold">MargaDarshi</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
