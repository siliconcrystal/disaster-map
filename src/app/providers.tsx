"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";
import { TaskFullDetailModal } from "@/components/task/TaskFullDetailModal";
import { TaskCreateModal } from "@/components/task/TaskCreateModal";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      {children}
      <TaskFullDetailModal />
      <TaskCreateModal />
    </NextThemesProvider>
  );
}
