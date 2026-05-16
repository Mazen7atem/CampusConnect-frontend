import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'display':   ['36px', { lineHeight: '44px', fontWeight: '700', letterSpacing: '-0.02em' }],
        'h1':        ['30px', { lineHeight: '38px', fontWeight: '600', letterSpacing: '-0.01em' }],
        'h2':        ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'h3':        ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'body-lg':   ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md':   ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-sm':   ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'label-md':  ['14px', { lineHeight: '20px', fontWeight: '500', letterSpacing: '0.05em' }],
        'label-sm':  ['12px', { lineHeight: '16px', fontWeight: '600' }],
        'h1-mobile': ['24px', { lineHeight: '32px', fontWeight: '600' }],
      },
      spacing: {
        'xs': '4px',
        'sm-space': '8px',
        'md-space': '16px',
        'lg-space': '24px',
        'xl-space': '32px',
        '2xl-space': '48px',
        'gutter': '24px',
      },
      colors: {
        /* ── Core Semantic (Shadcn/ui compatible) ──────────────── */
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--on-primary)",
          container: "var(--primary-container)",
          "container-fg": "var(--on-primary-container)",
          fixed: "var(--primary-fixed)",
          "fixed-dim": "var(--primary-fixed-dim)",
          "on-fixed": "var(--on-primary-fixed)",
          "on-fixed-variant": "var(--on-primary-fixed-variant)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--on-secondary)",
          container: "var(--secondary-container)",
          "container-fg": "var(--on-secondary-container)",
          fixed: "var(--secondary-fixed)",
          "fixed-dim": "var(--secondary-fixed-dim)",
          "on-fixed": "var(--on-secondary-fixed)",
          "on-fixed-variant": "var(--on-secondary-fixed-variant)",
        },
        tertiary: {
          DEFAULT: "var(--tertiary)",
          foreground: "var(--on-tertiary)",
          container: "var(--tertiary-container)",
          "container-fg": "var(--on-tertiary-container)",
          fixed: "var(--tertiary-fixed)",
          "fixed-dim": "var(--tertiary-fixed-dim)",
          "on-fixed": "var(--on-tertiary-fixed)",
          "on-fixed-variant": "var(--on-tertiary-fixed-variant)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        error: {
          DEFAULT: "var(--error)",
          foreground: "var(--on-error)",
          container: "var(--error-container)",
          "container-fg": "var(--on-error-container)",
        },
        success: {
          DEFAULT: "var(--success)",
          foreground: "var(--success-foreground)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          foreground: "var(--warning-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },

        /* ── Surface Hierarchy ─────────────────────────────────── */
        surface: {
          DEFAULT: "var(--surface)",
          dim: "var(--surface-dim)",
          bright: "var(--surface-bright)",
          "container-lowest": "var(--surface-container-lowest)",
          "container-low": "var(--surface-container-low)",
          container: "var(--surface-container)",
          "container-high": "var(--surface-container-high)",
          "container-highest": "var(--surface-container-highest)",
          tint: "var(--surface-tint)",
        },
        "on-surface": {
          DEFAULT: "var(--on-surface)",
          variant: "var(--on-surface-variant)",
        },
        "inverse-surface": "var(--inverse-surface)",
        "inverse-on-surface": "var(--inverse-on-surface)",
        "inverse-primary": "var(--inverse-primary)",

        /* ── Outline ───────────────────────────────────────────── */
        outline: {
          DEFAULT: "var(--outline)",
          variant: "var(--outline-variant)",
        },

        /* ── Sidebar ───────────────────────────────────────────── */
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },

        /* ── Charts ────────────────────────────────────────────── */
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "0.75rem",
      },
      boxShadow: {
        /* Level 1 — Cards / Surfaces */
        'level-1': '0 1px 3px rgba(0, 0, 0, 0.05)',
        /* Level 2 — Dropdowns / Popovers */
        'level-2': '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          from: { opacity: "1", transform: "translateY(0)" },
          to: { opacity: "0", transform: "translateY(10px)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        shimmer: "shimmer 2s infinite linear",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
