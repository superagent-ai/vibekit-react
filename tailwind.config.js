/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        colors: {
          background: "oklch(var(--background))",
          foreground: "oklch(var(--foreground))",
          card: "oklch(var(--card))",
          "card-foreground": "oklch(var(--card-foreground))",
          popover: "oklch(var(--popover))",
          "popover-foreground": "oklch(var(--popover-foreground))",
          primary: "oklch(var(--primary))",
          "primary-foreground": "oklch(var(--primary-foreground))",
          secondary: "oklch(var(--secondary))",
          "secondary-foreground": "oklch(var(--secondary-foreground))",
          muted: "oklch(var(--muted))",
          "muted-foreground": "oklch(var(--muted-foreground))",
          accent: "oklch(var(--accent))",
          "accent-foreground": "oklch(var(--accent-foreground))",
          destructive: "oklch(var(--destructive))",
          border: "oklch(var(--border))",
          input: "oklch(var(--input))",
          ring: "oklch(var(--ring))",
          sidebar: "oklch(var(--sidebar))",
          "sidebar-foreground": "oklch(var(--sidebar-foreground))",
          "sidebar-primary": "oklch(var(--sidebar-primary))",
          "sidebar-primary-foreground": "oklch(var(--sidebar-primary-foreground))",
          "sidebar-accent": "oklch(var(--sidebar-accent))",
          "sidebar-accent-foreground": "oklch(var(--sidebar-accent-foreground))",
          "sidebar-border": "oklch(var(--sidebar-border))",
          "sidebar-ring": "oklch(var(--sidebar-ring))",
          green: {
            100: "#dcfce7",
            300: "#86efac", 
            500: "#22c55e",
            600: "#16a34a",
          },
        },
        borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
        },
      }
    },
    plugins: []
  }
  