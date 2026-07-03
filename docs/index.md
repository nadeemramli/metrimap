# Metrimap Documentation

Welcome to the comprehensive documentation for Metrimap, a visual-first application for building, managing, and analyzing sophisticated metric trees and business architecture mapping.

## Overview

Metrimap provides a canvas for users to visually map components of their business and relationships within them. Users can create cards and connect them, assigning categories like business processes, metrics to track, or work/actions.

## Quick Links

> **Scope:** this repo `docs/` holds **infrastructure/structural** technical docs only.
> Product knowledge (PRD, feature explanations, methodology, decisions, learning) lives
> in the owner's Obsidian product vault, and **work** is tracked in **Linear** (team CVS).
> See the **Docs policy** in [`AGENTS.md`](https://github.com/nadeemramli/metric-mapping/blob/main/AGENTS.md).

- [Architecture Decision Records](/adr/) - Technical decisions and design rationale
- [Database: Prisma + Zod](/database/PRISMA_ZOD_INTEGRATION_GUIDE) - Prisma, Zod, and Supabase integration guides
- [Authentication](/auth/CLERK_SUPABASE_INTEGRATION) - Clerk and Supabase authentication setup
- [State Management](/state-management/XSTATE_COMPLETE_GUIDE) - XState implementation patterns
- [Metrics API](/features/metrics-api) - Read/write metrics API (edge function)
- [System Health intake](/features/system-health-intake) - Crash → Linear bridge

## Getting Started

This documentation covers everything from high-level product requirements to technical implementation details, including:

- **Beyond Canvas** functions: Homepage, Navigation, Dashboard, Assets, Source management
- **Within Canvas** functions: Metric cards, relationships, grouping, auto-layout
- Technical architecture: Authentication, database, state management, and editor integration

## Documentation Structure

The documentation is organized by domain:

- **ADR**: Architecture Decision Records for technical choices
- **Database**: Prisma, Zod, and Supabase integration (incl. RLS)
- **Auth**: Authentication setup with Clerk and Supabase
- **State Management**: XState patterns and implementation
- **Environment**: Setup and configuration guides
- **Architecture**: Structural technical notes
- **Features (infra)**: Metrics API, System Health intake, Linear setup

## Contributing

This documentation is a living resource that evolves with the application. When implementing new features or making architectural decisions, please update the relevant documentation sections.