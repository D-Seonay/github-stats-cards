# Landing Page Optimization (Mobile) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ensure the landing page header and feature grid are optimized for mobile.

**Architecture:** Update responsive utility classes in the landing page component for better layout on smaller viewports.

**Tech Stack:** Next.js (App Router), Tailwind CSS.

---

### Task 1: Update Main Container Padding

**Files:**

- Modify: `app/page.tsx:34`

- [ ] **Step 1: Replace vertical padding in main container**

```tsx
// old: <div className="max-w-5xl mx-auto px-6 py-24 relative z-10">
// new: <div className="max-w-5xl mx-auto px-6 py-12 md:py-24 relative z-10">
```

- [ ] **Step 2: Verify modification**

Run: `grep -q "py-12 md:py-24" app/page.tsx`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "style: reduce main container padding on mobile"
```

### Task 2: Update Header Title Size

**Files:**

- Modify: `app/page.tsx:45`

- [ ] **Step 1: Update title text size for better responsiveness**

```tsx
// old: <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-zinc-100 to-zinc-600">
// new: <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-7xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-zinc-100 to-zinc-600">
```

- [ ] **Step 2: Verify modification**

Run: `grep -q "text-4xl sm:text-5xl md:text-7xl" app/page.tsx`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "style: improve title font responsiveness"
```

### Task 3: Update Header Spacing

**Files:**

- Modify: `app/page.tsx:39`

- [ ] **Step 1: Reduce header bottom margin on mobile**

```tsx
// old: className="text-center space-y-8 mb-24"
// new: className="text-center space-y-8 mb-12 md:mb-24"
```

- [ ] **Step 2: Verify modification**

Run: `grep -q "mb-12 md:mb-24" app/page.tsx`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "style: optimize header margin on mobile"
```
