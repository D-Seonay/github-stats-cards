# Responsiveness Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Optimize the STAT-STATS landing page and console for full responsiveness on mobile and PC devices.

**Architecture:** Use Tailwind CSS responsive utility classes (`sm:`, `md:`, `lg:`, `flex-col`, `lg:flex-row`) to adapt layouts and component sizes based on screen breakpoints.

**Tech Stack:** Next.js 14, Tailwind CSS, Framer Motion.

---

### Task 1: Landing Page Optimization

**Files:**

- Modify: `app/page.tsx`

- [ ] **Step 1: Update padding and title font size**

```tsx
// app/page.tsx around line 34
<div className="max-w-5xl mx-auto px-6 py-12 md:py-24 relative z-10">

// around line 45
<motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-7xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-zinc-100 to-zinc-600">
```

- [ ] **Step 2: Run dev server and verify on mobile view**
      Expected: Header padding is reduced and title fits on small screens.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: responsive landing page header and padding"
```

---

### Task 2: Console Layout Refactoring

**Files:**

- Modify: `app/console/page.tsx`

- [ ] **Step 1: Update main container and content padding**

```tsx
// app/console/page.tsx around line 54
<div className="flex flex-col lg:flex-row h-screen bg-zinc-950 text-zinc-100 font-mono overflow-hidden">
  <Sidebar config={config} setConfig={setConfig} />
  <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto space-y-12">
```

- [ ] **Step 2: Verify vertical stacking on small screens**
      Expected: Sidebar appears above the main content on mobile.

- [ ] **Step 3: Commit**

```bash
git add app/console/page.tsx
git commit -m "feat: responsive layout for console page"
```

---

### Task 3: Sidebar Responsiveness

**Files:**

- Modify: `components/Sidebar.tsx`

- [ ] **Step 1: Update sidebar width, height, and borders**

```tsx
// components/Sidebar.tsx around line 18
<aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-zinc-800 p-6 flex flex-col gap-8 shrink-0 h-auto lg:h-screen font-mono overflow-y-auto scrollbar-hide">
```

- [ ] **Step 2: Verify sidebar behavior**
      Expected: Full width and auto height on mobile, fixed width and screen height on desktop.

- [ ] **Step 3: Commit**

```bash
git add components/Sidebar.tsx
git commit -m "feat: responsive sidebar width and height"
```

---

### Task 4: Theme Gallery Responsiveness

**Files:**

- Modify: `components/ThemeGallery.tsx`

- [ ] **Step 1: Read current implementation**
      Run: `cat components/ThemeGallery.tsx`

- [ ] **Step 2: Ensure responsive grid**

```tsx
// components/ThemeGallery.tsx
// Update grid container to:
// <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
```

- [ ] **Step 3: Commit**

```bash
git add components/ThemeGallery.tsx
git commit -m "feat: responsive theme gallery grid"
```

---

### Task 5: Final Layout Verification

- [ ] **Step 1: Check PreviewCard scaling in `components/PreviewCard.tsx`**
      Ensure `max-w-full h-auto` is correctly applied to the SVG container.

- [ ] **Step 2: Comprehensive mobile/desktop testing**
      Verify all cards, inputs, and buttons are accessible and look good at all breakpoints.

- [ ] **Step 3: Final Commit**

```bash
git commit --allow-empty -m "chore: final responsiveness verification"
```
