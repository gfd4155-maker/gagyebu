---
name: Pocket Insight
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45474c'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#545f73'
  primary: '#091426'
  on-primary: '#ffffff'
  primary-container: '#1e293b'
  on-primary-container: '#8590a6'
  inverse-primary: '#bcc7de'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#320008'
  on-tertiary: '#ffffff'
  tertiary-container: '#590015'
  on-tertiary-container: '#ff4e67'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e3fb'
  primary-fixed-dim: '#bcc7de'
  on-primary-fixed: '#111c2d'
  on-primary-fixed-variant: '#3c475a'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#ffdada'
  tertiary-fixed-dim: '#ffb3b6'
  on-tertiary-fixed: '#40000c'
  on-tertiary-fixed-variant: '#920028'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-balance:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  numeric-data:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  container-max-width: 768px
  dashboard-max-width: 1280px
  gutter: 24px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system is built on the principles of **Functional Minimalism** and **Professional Warmth**. It aims to reduce the cognitive load associated with financial management by using expansive whitespace, a grounded color palette, and a clear visual hierarchy.

The style avoids the clinical coldness of traditional banking in favor of a "Soft Corporate" aesthetic. It utilizes high-quality typography and subtle depth to guide the user through their financial data without unnecessary ornamentation. The emotional response should be one of control, clarity, and calm.

## Colors
The color strategy employs a "Signal and Surface" approach. 
- **Core Tones:** Deep Navy (#1E293B) provides an authoritative anchor for primary actions and navigation.
- **Semantic Indicators:** Teal is used exclusively for "Inflow" (Income/Growth), while Coral is reserved for "Outflow" (Expenses/Debt). 
- **Neutrals:** A scale of warm grays (Slate) handles borders and secondary text to maintain a soft, approachable contrast.
- **Categorization:** Expense categories use a 11-color muted palette to differentiate spending habits without overwhelming the dashboard. Each color is selected to maintain high legibility when paired with slate or white text.

## Typography
Typography is the primary tool for data visualization in this design system.
- **Font Selection:** **Geist** is used for headings and numeric data due to its precise, technical qualities and excellent tabular figures. **Inter** is used for body copy to ensure maximum readability and a friendly tone.
- **Numeric Readability:** All financial figures must use `font-variant-numeric: tabular-nums` to ensure columns of numbers align perfectly for easy scanning.
- **Hierarchy:** Large balances should use the `display-balance` style with tighter letter spacing to feel impactful yet contained.

## Layout & Spacing
This design system utilizes a **Hybrid Responsive Model**:
- **Entry & Detail Views:** Use a centered card layout restricted to 768px (`max-w-3xl`) to maintain focus and ease of data entry on larger screens.
- **Dashboard/Summary:** Expands to a multi-column fluid grid on desktop to allow for side-by-side comparison of charts and recent transactions.
- **Rhythm:** A 4px base unit governs all spacing. Use `stack-lg` (32px) for separating major sections and `stack-md` (16px) for internal card padding.

## Elevation & Depth
Depth is expressed through **Tonal Layering** and soft, ambient shadows rather than borders.
- **Level 0 (Background):** Off-white (#F9FAFB).
- **Level 1 (Cards/Surface):** Pure White (#FFFFFF) with a very soft shadow: `0px 4px 20px rgba(30, 41, 59, 0.05)`.
- **Level 2 (Modals/Popovers):** Pure White with a more pronounced shadow: `0px 12px 32px rgba(30, 41, 59, 0.1)`.
- **Borders:** Used sparingly. Only for form inputs or separating list items, using a light Slate-200 (#E2E8F0) at 1px thickness.

## Shapes
The shape language is significantly rounded to reinforce the "friendly" brand personality.
- **Cards & Primary Containers:** Use `rounded-2xl` (1.5rem / 24px) to create a soft, approachable frame for data.
- **Buttons & Inputs:** Use `rounded-lg` (0.5rem / 8px) to provide enough structure to feel professional and clickable.
- **Interaction States:** Hover states on list items should use a `rounded-md` (0.375rem) background highlight.

## Components
- **Buttons:** Primary buttons use the Slate color with white text. Secondary buttons use a subtle gray ghost style. All buttons feature a 150ms ease-in-out transition on hover.
- **Transaction Cards:** Horizontal layout with an icon on the left (using the category palette), category name and date in the center, and the amount (using Teal or Coral) right-aligned.
- **Input Fields:** Large, clear tap targets with a 1px border. Focus state should use a 2px Deep Navy ring with an offset.
- **Chips/Badges:** Pill-shaped (`rounded-full`) with a low-opacity background of the semantic color and a high-opacity version of the same color for the text (e.g., 10% Teal background, 100% Teal text).
- **Progress Bars:** Used for budget tracking. The track should be a very light gray (#F1F5F9) with a rounded-full cap on the indicator.
- **Progressive Disclosure:** Use simple chevrons and smooth height transitions for expanding transaction details or monthly breakdowns.