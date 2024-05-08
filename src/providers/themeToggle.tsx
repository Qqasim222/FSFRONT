// app/providers.jsx

"use client";

import { ThemeProvider } from "next-themes";
import { PropsWithChildren } from "react";

export function ThemeToggleProvider({ children }: PropsWithChildren) {
  return <ThemeProvider defaultTheme="light">{children}</ThemeProvider>;
}
