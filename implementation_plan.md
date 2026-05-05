# MeetForge UI/UX Design Upgrade Plan

This document outlines the plan to completely overhaul the MeetForge UI/UX to match the premium, modern aesthetic requested in the screenshots.

## User Review Required

> [!IMPORTANT]
> This is a major design shift from the current dark theme to a premium light theme. The entire color palette, typography, and layout of the landing page will change to match the "abcbank" reference images. Please review the proposed changes and confirm if this direction aligns with your vision for the app before I begin implementation.

## Open Questions

> [!NOTE]
> 1. Should we apply this light theme to the `InterviewRoom.jsx` as well, or keep the interview room dark for better focus on video?
> 2. The screenshots feature a "Bento-box" layout with abstract gradient backgrounds. I plan to use my image generation tool to create these abstract backgrounds. Is that acceptable?

## Proposed Changes

We will transition the application from a dark theme to a clean, light-themed bento-box design with soft gradients, glassmorphic elements, and premium typography.

### 1. Configuration & Theming

- Update `tailwind.config.js` to include the new sophisticated color palette:
  - `theme-light-bg`: `#FAFAFA`
  - `theme-dark-text`: `#18181B`
  - `theme-green`: `#5E8056` (Freelance card reference)
  - `theme-orange-gradient`: `#F5A551` to `#D67C31` (Business card reference)
  - `theme-purple`: `#8A98DF` (Card reference)
- Update `index.css` global styles:
  - Change `body` background to the new light background and text color to dark.
  - Import a modern premium sans-serif font (e.g., 'Inter' or 'Plus Jakarta Sans') via Google Fonts.

### 2. Frontend Components

#### [MODIFY] `frontend/src/pages/Home.jsx`
- **Navbar**: Convert to a clean, light navbar with dark text. Replace standard buttons with sleek, dark pill-shaped buttons.
- **Hero Section**: 
  - Update typography to be massive and clean (e.g., "Discover the freedom of technical interviews").
  - Add a handwritten accent SVG under a key word.
  - Implement the dark pill "Get Started" button with an arrow icon.
- **Bento Grid**: 
  - Replace the 3-column feature list with an asymmetrical bento-box grid.
  - Create distinct feature cards (e.g., "Live Code Editor", "Crystal Clear Video") utilizing large, smooth abstract gradients.
  - Add floating glassmorphic elements (like mock charts or mini-UI components) over the abstract backgrounds to create a 3D layered feel, identical to the reference screenshots.

#### [MODIFY] `frontend/src/pages/Dashboard.jsx`
- Convert the dashboard to inherit the new light theme.
- Replace the dark glassmorphic cards with crisp, white cards featuring subtle, soft shadows and larger border radii.
- Ensure buttons match the new dark pill styling from the landing page.

#### [NEW] Assets Generation
- I will generate 2-3 abstract 3D shape images (similar to the orange and green waves in the reference) using the `generate_image` tool to use as backgrounds for the bento boxes in `Home.jsx`.

## Verification Plan

### Manual Verification
- Start the development server and verify that the landing page accurately reflects the provided screenshots' layout, colors, and typography.
- Navigate to the Dashboard to ensure the light theme is applied consistently.
- Verify that responsive design works across mobile and desktop views for the new bento grid layout.
- Test authentication flows to ensure button changes haven't broken functionality.
