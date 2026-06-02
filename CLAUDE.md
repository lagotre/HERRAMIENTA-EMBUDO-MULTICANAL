# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Embudo Multicanal** — educational web app for marketing students to build a multichannel Customer Journey Map. Single-session wizard (no login/database), PDF export.

## Commands

```bash
npm run dev      # development server at localhost:3000
npm run build    # production build + TypeScript check
npm run lint     # ESLint
```

## Architecture

The app is a step-by-step wizard (`/journey`) with all state held in React `useState` — no backend, no persistence, everything lives in the browser for the session.

**Wizard steps** (defined in `src/app/journey/page.tsx`):
1. Welcome — student name + brand name
2. Channel Selector — pick from 17 pre-loaded channels (Pagados/Propios/Ganados)
3–7. Funnel stages — for each of 5 stages, fill objective + KPI per selected channel
8. Preview — visual Customer Journey Map + PDF download

**Data layer** (`src/data/`): all content is static TypeScript — channels, funnel stages, KPI library, and objective suggestions. No API calls.

**PDF generation** (`PDFExportButton`): captures the `#journey-map-preview` DOM element with `html2canvas` and writes it to a landscape A4 PDF via `jspdf`. Both libraries are dynamically imported to avoid SSR issues.

**Channel categories** drive color coding throughout the app:
- Pagados = blue
- Propios = emerald/green
- Ganados = orange

**Funnel stages** and their IDs (used as keys in `JourneyMappings`):
`conciencia`, `interes-consideracion`, `intencion-compra`, `fidelizacion`, `advocacy`
