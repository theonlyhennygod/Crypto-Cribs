"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("light");
    }
  };

  const getIcon = () => {
    if (!mounted) {
      // Return a consistent icon during SSR
      return <Monitor className="h-[1.2rem] w-[1.2rem] transition-all" />;
    }

    if (theme === "light") {
      return <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />;
    } else if (theme === "dark") {
      return (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all hover:text-orange-500" />
      );
    } else {
      return <Monitor className="h-[1.2rem] w-[1.2rem] transition-all" />;
    }
  };

  if (!mounted) {
    // Return a loading state that matches the server render
    return (
      <Button variant="outline" size="icon" disabled>
        <Monitor className="h-[1.2rem] w-[1.2rem] transition-all" />
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
