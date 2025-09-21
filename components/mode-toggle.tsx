"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch by only rendering after component mounts
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (resolvedTheme === "light") {
      setTheme("dark");
    } else if (resolvedTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("light");
    }
  };

  const getIcon = () => {
    // Use resolvedTheme instead of theme to avoid hydration mismatch
    const currentTheme = resolvedTheme || "light";

    if (currentTheme === "light") {
      return <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />;
    } else if (currentTheme === "dark") {
      return (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all hover:text-orange-500" />
      );
    } else {
      return <Monitor className="h-[1.2rem] w-[1.2rem] transition-all" />;
    }
  };

  // Prevent hydration error by not rendering until mounted
  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <div className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      {getIcon()}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
