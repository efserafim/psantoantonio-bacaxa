# Design Guidelines - Paróquia Santo Antonio Website

## Design Approach
**Reference-Based**: Drawing inspiration from modern community-focused platforms (Airbnb for warmth/trust, Medium for content presentation, Apple for reverent simplicity) adapted for a spiritual context. The design should feel welcoming, trustworthy, and timeless while maintaining modern web standards.

## Color Strategy
**Primary Palette - Santo Antonio/Franciscan Theme**:
- Deep Brown (Primary): `#6B4423` (chocolate/earth)
- Warm Sepia: `#8B6635` (accent)
- Soft Cream: `#F5F1E8` (backgrounds)
- Pure White: `#FFFFFF` (cards, text backgrounds)
- Rich Earth: `#4A3319` (text, headers)

**Application**:
- Navigation: Deep brown background with cream/white text
- Hero sections: Cream background with brown overlay on images
- Cards/Content: White with subtle cream borders
- CTAs: Warm sepia with white text, deep brown on hover
- Admin panel: Lighter cream backgrounds with brown accents

## Typography
**Font Families**:
- Headers: `'Merriweather', serif` - dignified, traditional
- Body: `'Inter', sans-serif` - clean, readable
- Accents: `'Playfair Display', serif` - for special headings/quotes

**Scale**:
- Hero Heading: 3.5rem/4rem (desktop), 2.5rem (mobile), Merriweather Bold
- Section Headings: 2rem/2.5rem, Merriweather Bold
- Card Titles: 1.25rem, Merriweather SemiBold
- Body Text: 1rem, Inter Regular, line-height 1.6
- Captions: 0.875rem, Inter Regular

## Layout System
**Spacing Primitives**: Use Tailwind units of **4, 6, 8, 12, 16, 20** (e.g., p-4, gap-8, my-12, py-20)

**Grid Structure**:
- Max container: `max-w-7xl` for full sections
- Content: `max-w-4xl` for articles/text-heavy content
- Admin panels: `max-w-6xl`

**Responsive Breakpoints**:
- Mobile: Single column, stack all elements
- Tablet (md:): 2-column grids for news/pastorals
- Desktop (lg:): 3-column grids, side-by-side layouts

## Public Site Components

### Hero Section
- Height: 70vh on desktop, auto on mobile
- Background: Cream with subtle texture or warm brown gradient overlay on image
- Content: Centered, white text on overlay with blurred brown button background
- Include: Parish name (large Merriweather), tagline, primary CTA

### News Grid
- 3-column grid (desktop), 2-col (tablet), 1-col (mobile)
- Cards: White background, subtle shadow, rounded corners (8px)
- Image: 16:9 aspect ratio, cover fit
- Meta: Date, category in small sepia text
- Title: 1.25rem Merriweather
- Excerpt: 2-3 lines, Inter, gray-700
- "Leia mais" link in warm sepia

### Pastorals Section
- 2-column layout with image + content alternating
- Circular photo (200px) with brown border
- Date/time/location in structured format with icons
- Description in readable paragraph format

### Mass Schedule
- Clean table or card-based layout
- Days/times clearly separated
- Chapel name in bold
- Use subtle brown borders and cream backgrounds for rows

### Navigation
- Sticky header with deep brown background
- Logo left, menu items right (desktop)
- Hamburger menu (mobile) with slide-in drawer
- Menu items: cream text, white on hover

## Admin Panel Components

### Dashboard Layout
- Sidebar: Deep brown, cream icons/text, 240px wide
- Main content: Cream background (`#F5F1E8`)
- Cards: White with brown borders

### Rich Text Editor
- Toolbar: White background, brown icons
- Buttons: Bold, Italic, Link, Heading, List (bullet/numbered)
- Active state: Warm sepia background
- Text area: White, generous padding (p-6)

### Image Upload Zone
- Dashed brown border, cream background
- Drag-and-drop area: 300px height
- Display up to 3 previews in row with remove button
- Upload limit indicator: "15MB max per image"
- Preview thumbnails: 120px squares

### Forms
- Input fields: White background, brown border, rounded (6px)
- Labels: Deep brown, 0.875rem, uppercase tracking
- Focus state: Warm sepia border
- Spacing: gap-6 between fields

### Data Tables
- Header: Cream background, brown text, uppercase
- Rows: White with hover (lightest cream)
- Actions: Icon buttons in warm sepia

## Images

**Hero Section**: 
- Large banner image (1920x800px) showing church exterior or Santo Antonio iconography
- Apply 40% brown overlay (#6B4423 at 0.4 opacity) for text readability

**News Articles**:
- Featured image per article (1200x675px, 16:9)
- Up to 3 supporting images in article body
- Gallery layout for multiple images

**Pastorals**:
- Circular portrait photos (400x400px) of pastoral groups/activities
- Brown border (4px) around images

**Chapels**:
- Exterior photos (800x600px) of each chapel
- Map integration if applicable

## Animation & Interaction
- Minimal, reverent animations
- Smooth scroll (for navigation links)
- Gentle fade-in on scroll (0.3s) for content sections
- Card hover: subtle lift (2px) with shadow increase
- Button hover: slight darken of background
- No distracting or playful animations

## Accessibility
- High contrast between brown text and cream/white backgrounds
- Minimum 16px body text
- Focus indicators: 2px solid warm sepia outline
- Alt text required for all images
- Keyboard navigation throughout admin panel