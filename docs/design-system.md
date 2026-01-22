# Design System - United Global Federation India

## Overview
This design system follows shadcn/ui patterns with semantic tokens and CSS variables.

## Color System

All colors use HSL format via CSS variables:

### Light Theme
```css
--background: 0 0% 100%
--foreground: 222.2 84% 4.9%
--card: 0 0% 100%
--card-foreground: 222.2 84% 4.9%
--popover: 0 0% 100%
--popover-foreground: 222.2 84% 4.9%
--primary: 222.2 47.4% 11.2%
--primary-foreground: 210 40% 98%
--secondary: 210 40% 96.1%
--secondary-foreground: 222.2 47.4% 11.2%
--muted: 210 40% 96.1%
--muted-foreground: 215.4 16.3% 46.9%
--accent: 210 40% 96.1%
--accent-foreground: 222.2 47.4% 11.2%
--destructive: 0 84.2% 60.2%
--destructive-foreground: 210 40% 98%
--border: 214.3 31.8% 91.4%
--input: 214.3 31.8% 91.4%
--ring: 222.2 84% 4.9%
--radius: 0.5rem
```

### Dark Theme
```css
--background: 222.2 84% 4.9%
--foreground: 210 40% 98%
--card: 222.2 84% 4.9%
--card-foreground: 210 40% 98%
--popover: 222.2 84% 4.9%
--popover-foreground: 210 40% 98%
--primary: 210 40% 98%
--primary-foreground: 222.2 47.4% 11.2%
--secondary: 217.2 32.6% 17.5%
--secondary-foreground: 210 40% 98%
--muted: 217.2 32.6% 17.5%
--muted-foreground: 215 20.2% 65.1%
--accent: 217.2 32.6% 17.5%
--accent-foreground: 210 40% 98%
--destructive: 0 62.8% 30.6%
--destructive-foreground: 210 40% 98%
--border: 217.2 32.6% 17.5%
--input: 217.2 32.6% 17.5%
--ring: 212.7 26.8% 83.9%
```

## Typography

- **Font Family**: Inter, system-ui, sans-serif
- **Base Size**: 16px
- **Scale**: Tailwind default (0.75rem to 3rem)

## Spacing

Use Tailwind spacing scale:
- `gap-6` for grids (24px)
- Section padding: `py-16 md:py-24 px-6`

## Layout

- **Max Width**: `max-w-[1280px]`
- **Centering**: `mx-auto`
- **Section Padding**: `py-16 md:py-24 px-6`

## Components

### Cards
```jsx
<div className="bg-card rounded-xl shadow-md">
  {/* content */}
</div>
```

### Buttons
Use predefined variants from `components/ui/button.tsx`:
- `default`
- `destructive`
- `outline`
- `secondary`
- `ghost`
- `link`

### Icons
Use `lucide-react` icons only.

## Rules

1. **NO animations** unless explicitly requested
2. **NO custom colors** - use semantic tokens only
3. **NO purple** colors
4. **Mobile-first** responsive design
5. **Static UI only** - no motion libraries

