# Gym Website UI Refresh

A premium gym landing page built with React, Vite, and Tailwind CSS. The UI emphasizes bold typography, strong CTAs, and trust-building sections while keeping performance and accessibility in mind.

## Tech Stack
- React 18 + Vite
- Tailwind CSS
- Framer Motion (lightweight reveal animations)

## Development
```bash
npm install
npm run dev
```

## Design System
### Color Palette
- Primary: `#E11D48` (brand red)
- Primary dark: `#9F1239`
- Background: `#0B0B0F`
- Surface: `rgba(255, 255, 255, 0.06)`
- Border: `rgba(255, 255, 255, 0.12)`
- Text: `#F8FAFC`
- Muted: `rgba(248, 250, 252, 0.68)`

### Typography
- Display: `Space Grotesk` (H1–H3)
- Body: `Inter` (body, labels, buttons)
- Scale: H1 48–60px, H2 32–40px, body 14–16px, small 12px

### Spacing System
- 8px base grid (`p-2`, `p-4`, `p-6`, `p-8`, `py-16`)
- Max content width: `max-w-6xl`
- Section padding: `py-16`

### Components
- Navbar: sticky, blurred background, primary CTA
- Hero: large headline + dual CTA + trust badges
- Section headers: `SectionHeading` component (eyebrow, title, description)
- Cards: `glass-strong`, `card-elevated`, `surface-panel`
- Pricing cards: highlighted "Most Popular" tier with list checkmarks
- Testimonials + Trainers: avatar/coach cards with ratings
- Schedule cards: weekly program overview
- Footer: compact utility links

### Usage Notes
- Use `btn-primary`, `btn-secondary`, and `btn-ghost` for CTAs.
- Use `section-wrapper` for consistent layout width and padding.
- Use `list-check` for feature lists.

## Performance Notes
- Responsive `srcSet` images + WebP sources for major visuals.
- Reduced-motion support for orb animations.
- Fonts loaded with `display=swap`.
