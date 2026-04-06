---
name: copilotz-starter
kind: client
summary: Minimal starter repo showing the domain-first Copilotz API surface, graph routes, and a lightweight React chat UI with profile sidebar.
depends_on:
  - copilotz
  - oxian-js
  - "@copilotz/chat-ui"
  - "@copilotz/chat-adapter"
tags:
  - starter
  - template
  - frontend
  - threads
  - graph
entrypoints:
  - api/dependencies.ts
  - api/v1/providers/web.ts
  - api/v1/threads/index.ts
  - api/v1/participants/[id].ts
  - api/v1/graph/search.ts
  - web/components/ChatClient.tsx
status: template
---

## Purpose

`copilotz-starter` is the smallest end-to-end reference app for the current
Copilotz stack. It demonstrates:

- built-in `createCopilotz({ resources: { path } })` resource loading
- domain-specific server APIs for `threads`, `messages`, `participants`,
  `assets`, `collections`, and `graph`
- Oxian route wrappers that stay thin and framework-specific
- a simple React/Vite web UI using `@copilotz/chat-adapter` and
  `@copilotz/chat-ui`

## Read These First

- `api/dependencies.ts`
- `api/v1/providers/web.ts`
- `api/v1/threads/index.ts`
- `api/v1/participants/[id].ts`
- `api/v1/graph/search.ts`
- `web/components/ChatClient.tsx`
- `web/components/ProfileSidebar.tsx`

## Common Task Locations

- Runtime/bootstrap wiring: `api/dependencies.ts`
- Domain API routes: `api/v1/**`
- Starter resources: `resources/`
- Web app shell: `web/App.tsx`
- Chat integration: `web/components/ChatClient.tsx`
- Profile UI over participant data: `web/components/ProfileSidebar.tsx`,
  `web/services/participantsService.ts`

## Warnings

- This repo consumes published JSR/npm packages by default. Local changes in
  `lib/copilotz` and `lib/packages` are not used unless you publish or link
  them.
- The starter consumes the published `copilotz/server` handler factories
  directly.
- The web app assumes Oxian serves the API under `/api` and either proxies Vite
  in dev or serves `web/dist` in production.
