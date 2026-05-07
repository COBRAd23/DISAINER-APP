---
name: Disainer Premium Mobile
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#d2c5ab'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#9a9078'
  outline-variant: '#4e4632'
  surface-tint: '#f1c100'
  primary: '#ffedc3'
  on-primary: '#3d2f00'
  primary-container: '#ffcc00'
  on-primary-container: '#6f5700'
  inverse-primary: '#745b00'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#e9eeff'
  on-tertiary: '#002e69'
  tertiary-container: '#bfd2ff'
  on-tertiary-container: '#0056b8'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe08b'
  primary-fixed-dim: '#f1c100'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#584400'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a41'
  on-tertiary-fixed-variant: '#004493'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
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
  label-md:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 12px
  margin: 20px
  bento-gap: 12px
---

## Brand & Style

The design system is rooted in the philosophy of "Diseñar es decidir. Lo demás sobra" (To design is to decide. Everything else is redundant). It targets a sophisticated audience that values precision, technological edge, and editorial clarity. The aesthetic combines the architectural structure of a Bento Grid with the ethereal depth of Glassmorphism.

The style is **Minimalist-Technological**. It rejects unnecessary ornamentation in favor of functional hierarchy and high-contrast focal points. Every element must feel like a deliberate decision, resulting in a UI that feels premium, authoritative, and whisper-quiet yet powerful.

## Colors

The palette is anchored in a **Strict Dark Mode**. The primary background uses a deep, ink-black (#0a0a0a) to provide maximum contrast for glass effects. 

- **Primary (#FFCC00):** Used sparingly as a "decision point" color—notifying the user of active states or high-value actions.
- **Secondary (#FFFFFF):** Reserved for pure typographic clarity and primary icons.
- **Tertiary (#007AFF):** An electric blue used for subtle technical accents, links, or code-like data points to reinforce the "technological" brand voice.
- **Neutrals:** A range of dark grays (Surface: #161616, Border: #262626) form the foundation of the glass layers.

## Typography

This design system employs a dual-font strategy to balance technical character with utilitarian legibility. 

**Space Grotesk** is used for headlines and labels. Its geometric quirks and "Futura-like" modernism emphasize the technological nature of the agency. High-level headings should use tighter letter-spacing to appear more editorial.

**Inter** is the workhorse for body copy and long-form descriptions. It provides the neutral, systematic clarity required for complex project briefs and technical specifications.

## Layout & Spacing

The layout is governed by **Bento Grid principles**. This creates a modular, tiled ecosystem that organizes information into distinct containers of varying sizes. 

- **Grid System:** A 4-column mobile grid. Elements should span 1, 2, or all 4 columns to create visual interest.
- **Rhythm:** An 8pt spatial scale is used for all padding and margins. 
- **Bento Cells:** Each cell in the grid should have uniform padding (typically 20px) to maintain internal breathing room, even when the external "bento-gap" is tight. 
- **Hierarchy:** Larger cells are used for primary case studies or calls to action, while smaller 1x1 cells house metadata or secondary navigation points.

## Elevation & Depth

Depth in this design system is achieved through **Glassmorphism** rather than traditional shadows. This creates a sense of "layered intelligence."

1.  **Backdrop Blur:** All cards and overlays must use a minimum backdrop-blur of 20px. 
2.  **Translucency:** Surface colors use a 60-80% opacity of the neutral dark grays.
3.  **Subtle Borders:** Every elevated element must have a 1px solid border. The top and left borders should be slightly lighter (#FFFFFF at 15% opacity) than the bottom and right (#FFFFFF at 5% opacity) to simulate a subtle top-down light source.
4.  **Zero Shadows:** To maintain the "Strict Dark" aesthetic, drop shadows are avoided. Depth is communicated solely through the blur and border contrast.

## Shapes

The shape language is consistently **Rounded**. This softens the "technological" edge and makes the app feel premium and approachable.

- **Bento Cards:** Use `rounded-lg` (16px) as the standard for all primary grid containers.
- **Buttons & Inputs:** Use `rounded-xl` (24px) to create a distinct, touch-friendly silhouette that contrasts against the larger grid cells.
- **Inner Elements:** Elements nested inside cards should use a smaller radius (8px) to maintain nested corner concentricity.

## Components

### Cards (Bento Cells)
The core component of the design system. Cards feature a glassmorphic background, a 1px subtle border, and 20px internal padding. Content within cards is always left-aligned to reinforce the minimalist grid.

### Buttons
- **Primary:** Solid #FFCC00 background with #0A0A0A text. High-contrast, no blur.
- **Secondary:** Glassmorphic background with a white 1px border and white text. 
- **Tertiary:** Ghost style; text-only with the 'Space Grotesk' label style and a small #FFCC00 dot icon.

### Chips
Used for tagging project categories (e.g., "UI/UX", "Branding"). These are small, pill-shaped containers with a 10% white fill and 1px border.

### Input Fields
Darker than the background (#000000) with a subtle bottom-border in #262626. On focus, the border transitions to #FFCC00.

### Lists
Lists are presented as a series of glassmorphic rows with 1px separators. Each row features a chevron in #FFCC00 to indicate interactivity.

### Progress Indicators
Thin, 2px horizontal lines. The track is 10% white, and the progress fill is #FFCC00, creating a "laser-cut" precision look.