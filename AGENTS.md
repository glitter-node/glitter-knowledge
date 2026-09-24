# Glitter Knowledge Template Agent Guide

## Identity and role

Glitter Knowledge is Glitter.kr's Gnuboard 7 User Template, currently version 0.6.0. It provides presentation and information architecture for existing `sirsoft-board` content. It does not own a Knowledge database, model, backend, taxonomy, permission system, or editor.

The template must not modify G7 Core or `sirsoft-board`. New routes, APIs, persistent Knowledge metadata, and CMS behavior are outside this package boundary.

## Source and build policy

The bundled directory is the source of truth. The deployment flow is:

`src` → static build → `dist` → official template lifecycle → installed template

Generated `dist` files are build output and must not be edited directly. The installed template is a lifecycle output and must not be edited directly. Use `npm run type-check` and `npm run build` for static verification. `npm run dev`, Vite HMR, and development-server assumptions are not supported.

Keep metadata versions synchronized across `template.json`, `components.json`, `package.json`, and the package lock when a release changes. The current release is 0.8.1.

## Layouts, components, and security

Layouts never contain hardcoded visible sentences. All visible and accessibility text belongs in the Korean and English language files, which must remain key-parity compatible.

Registered component names and manifest props must match the TypeScript registry. `HtmlContent` remains the generic safe HTML/text renderer. `DocumentContent` owns Knowledge-specific sanitized document rendering, h2-h4 heading anchors, and the render-time table of contents. Both use the shared DOMPurify sanitization boundary. Raw HTML bypasses, unsanitized `dangerouslySetInnerHTML`, Markdown parsing, and sanitizer policy expansion are forbidden.

Knowledge CSS uses `gk-*` scoped selectors and must not bleed into Core, admin, or other templates.

`DocumentContent` may expose ephemeral client-side reading progress based only on its rendered root geometry. Progress must remain bounded, non-persistent, and scoped to the Reader document.

## Production and repository safety

Do not run template lifecycle commands, cache clearing, database mutation, service changes, or source publication from documentation work. Production tests are allowed only when structural isolation from production is proven; otherwise report `SKIPPED: production isolation could not be proven`.

Do not use Git mutation commands. Preserve unrelated worktree changes.

Project and documentation directories use mode 2775 and regular source/documentation files use mode 664. Native dependency executables are a separate build-time exception. Preserve NAS ACL inheritance.
