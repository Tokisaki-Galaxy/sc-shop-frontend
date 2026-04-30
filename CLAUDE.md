# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Medusa Next.js Starter Storefront — a production ecommerce storefront built with Next.js 15 (App Router) + Medusa V2 headless commerce backend. Based on the official Medusa Next.js Starter Template, customized for tokisaki's shop.

## Commands

```bash
pnpm dev              # Start dev server (Turbopack, port 8000)
pnpm build            # Production build
pnpm start            # Production server (port 8000)
pnpm lint             # ESLint
pnpm analyze          # Bundle analysis (ANALYZE=true build)
```

The storefront runs on port 8000 and expects a Medusa backend on port 9000 (configured via `MEDUSA_BACKEND_URL`).

## Environment Variables

Required: `MEDUSA_BACKEND_URL`, `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`, `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_DEFAULT_REGION`

Optional: `NEXT_PUBLIC_STRIPE_KEY`, `NEXT_PUBLIC_MEDUSA_PAYMENTS_PUBLISHABLE_KEY`, `NEXT_PUBLIC_MICROSOFT_CLARITY_ID`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_FILE_S3_URL`, `REVALIDATE_SECRET`

See `.env.template` for the full list.

## Architecture

### Routing: Country-Code Prefixed

Every storefront page lives under `/[countryCode]/`. The middleware (`src/middleware.ts`) intercepts all requests and resolves the user's country code via:
1. URL path (explicit override)
2. `x-vercel-ip-country` header (geo-detection)
3. `NEXT_PUBLIC_DEFAULT_REGION` fallback

It fetches Medusa `/store/regions` at boot (cached 1 hour in-memory) and redirects un-prefixed URLs to the correct country code. Static asset requests bypass this.

### Data Layer: Server Actions + Medusa JS SDK

`src/lib/config.ts` initializes the Medusa JS SDK with `publishableKey`. A custom `sdk.client.fetch` wrapper injects `x-medusa-locale` headers from cookies into every request.

`src/lib/data/` contains server action files (all `"use server"`) organized by domain:
- `cart.ts` — retrieve/create/update cart, add items, set shipping, place order
- `customer.ts` — auth (login/register/logout), address CRUD, profile management
- `products.ts` — list products with pagination, sorting, region-aware pricing
- `categories.ts`, `collections.ts` — category/collection listing
- `regions.ts` — region retrieval
- `orders.ts` — order history and details
- `fulfillment.ts`, `payment.ts`, `variants.ts`, `locales.ts`, `locale-actions.ts`, `cookies.ts`

**Pattern**: All data functions are async server functions that use `sdk.client.fetch()` (NOT `fetch()`) — the SDK automatically attaches auth headers. They pass `getAuthHeaders()` and `getCacheOptions(tag)` for authenticated requests with Next.js cache tags.

### UI Components: Domain Modules

`src/modules/` organizes UI by domain, not by type. Each domain has `components/` and `templates/`:

| Module | What it contains |
|---|---|
| `layout/` | Nav, Footer, CartMismatchBanner, TrustBadges, MicrosoftClarity |
| `home/` | Hero, featured products |
| `products/` | Product detail page, image gallery, variant selector, price display |
| `cart/` | Cart items, summary, empty state, sign-in prompt |
| `checkout/` | Multi-step form: addresses, shipping, payment, review |
| `account/` | Login, register, profile, addresses, orders, reset password |
| `categories/`, `collections/` | Category/collection listing templates |
| `store/` | Product listing with filters, sort, pagination, refinement list |
| `common/` | Shared UI: Input, Modal, Checkbox, Divider, CartTotals, icons |
| `skeletons/` | Loading skeleton components for all major pages |

### Design System

- **Tailwind CSS v3** with `@medusajs/ui-preset` (Medusa's design tokens)
- Custom `grey` color scale (0–90), extended border radius scale (`soft`, `base`, `rounded`, `large`, `circle`)
- Custom breakpoints: `2xsmall` (320px) → `2xlarge` (1920px)
- Custom animations: `fade-in-right`, `fade-in-top`, `accordion-open/close`, `enter/leave`, `slide-in`
- Dark mode via `class` strategy (data-mode="light" on `<html>`)
- Inter as the base font family

### Storefront Features

- **Product browsing**: PLP with filters/sort/pagination, PDP with image gallery and variant selection, category/collection pages
- **Cart**: Add to cart, quantity management, discount codes, shipping method selection
- **Checkout**: Multi-step (shipping → delivery + payment → review), Stripe/PayPal/Medusa Payments, guest checkout support
- **Account**: Registration, login, OAuth, profile editing, address book, order history, order transfer (accept/decline)
- **SEO**: Dynamic sitemap (`next-sitemap.js`), metadata, JSON-LD structured data
- **Analytics**: Microsoft Clarity integration

### Onboarding/SaaS Flow

The middleware and `src/lib/data/onboarding.ts` support a SaaS onboarding flow — if no backend is detected, users are redirected through an onboarding wizard.

## Key Conventions

- **SDK only**: All backend API calls go through `sdk.client.fetch()` — never use bare `fetch()`. The SDK handles publishable API key and auth headers automatically.
- **Server Components by default**: Pages and data fetching use React Server Components. Client interactivity is pushed to leaf components.
- **Cache tags**: Data functions use `getCacheOptions(tag)` and `getCacheTag(tag)` for Next.js cache invalidation. Tags follow the pattern from `cookies.ts`.
- **Prices are display-ready**: Medusa stores prices as-is ($49.99 = 49.99). Never divide by 100.
- **Dynamic routes**: All product/category/collection pages use dynamic routes (`[handle]`, `[...category]`).
- **No PUT/PATCH**: Medusa API convention is GET, POST, DELETE only.
- **Module isolation**: Cross-module relationships use module links, not direct service calls.

## Project Skills

This project includes custom agent skills in `.agents/skills/`:

- `storefront-best-practices` — Ecommerce UI/UX patterns, component design, Medusa integration guidance
- `learning-medusa` — Interactive Medusa development tutorial (build a brands feature)
- `building-storefronts` — Medusa storefront SDK integration, React Query patterns, API calling rules
- `building-with-medusa` — Medusa backend development (modules, workflows, API routes, module links)

These skills are DESIGNED to be loaded BY CLAUDE when relevant context is detected. They contain critical patterns and anti-patterns. Load the relevant skill before implementing its domain.
