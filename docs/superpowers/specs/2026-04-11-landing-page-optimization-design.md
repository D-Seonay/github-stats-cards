# Design Doc: Landing Page Optimization (Mobile)

**Goal:** Ensure the landing page header and feature grid are optimized for mobile.

## Header Improvements

- **Padding:** Reduce vertical padding on mobile to bring the title closer to the top.
- **Title Font Size:** Update the title size to be more responsive, ensuring it fits well on all screens.
- **Spacing:** Adjust the header's bottom margin on mobile to bring the feature grid into view more effectively.

## Proposed Changes (app/page.tsx)

1. **Container Padding:** Change `py-24` to `py-12 md:py-24` in the main container's outer `div`.
2. **Title Size:** Update `text-5xl md:text-7xl` to `text-4xl sm:text-5xl md:text-7xl` for the main `h1`.
3. **Header Spacing:** Update `mb-24` to `mb-12 md:mb-24` for the header element's bottom margin.

## Verification

- Confirm that the responsive utility classes for padding and margin are correctly applied.
- Ensure the header fits correctly on mobile viewports.
- Commit the changes to the repository.
