# Changelog

## 0.13.0

- Added current-section orientation to the existing long-document HTML TOC.
- Exposed the active heading with `aria-current="location"` without adding persistent data or backend dependencies.

## 0.12.0

- Added search-context continuity across Collection siblings, pagination, Topic/Collection links, and Reader return navigation.
- Omitted empty `q` parameters while preserving non-empty Topic and Collection search queries.
- Kept the implementation adapter-only and reused existing GnuBoard7 `sirsoft-board` query contracts without persistent Knowledge data.

## 0.11.0

- Added Topic document counts and topic-scoped document pagination using the existing `sirsoft-board` posts contract.
- Added search context, collection sibling navigation, current collection semantics, and invalid-versus-empty collection states.
- Preserved category, search, and reading context across document and collection navigation.
- Added a reusable `KnowledgeCollectionNavigation` composite without adding persistent Knowledge data.

## 0.10.0

- Added Knowledge-owned login and registration screens backed by GnuBoard7 authentication APIs.
- Added an authenticated `/account` screen backed by the Core profile and password APIs.
- Connected the account menu to `/account` while keeping administration, locale, logout, and theme contracts unchanged.

## 0.9.1

- Removed unsupported guest login/register and profile links from the Knowledge header to prevent navigation to 404 routes.
- Kept the verified GnuBoard7 administration, locale, logout, and theme contracts unchanged.

## 0.9.0

- Added System, Light, and Dark theme selection using GnuBoard7's shared color-scheme preference.
- Added semantic dark-mode tokens while preserving the existing Knowledge information hierarchy and light appearance.

- Connected the Knowledge header to GnuBoard7's existing authentication and user contracts.
- Added an authenticated account menu with permission-aware administration, language, and logout actions.

## 0.8.5

- Simplified Reader return navigation to one contextual Collection link using the current category name.
- Kept Topic navigation in the existing breadcrumb and header navigation, separate from Previous / Next document navigation.

## 0.8.4

- Strengthened interactive boundaries, explicit search placeholder contrast, disabled control states, and Reader body link recognition without changing the existing visual hierarchy.

## 0.8.3

- Refined Topic discovery card sizing for denser single- and multi-topic browsing.
- Compressed Topic search presentation, kept search actions on one line, and shortened document previews for faster scanning.
- Clarified public release metadata, first-use guidance, authoring limits, and the Board → Topic → Collection → Document content model.

## 0.8.2

- Aligned user-facing Knowledge terminology with the adapter hierarchy: Board → Topic, Category → Collection, and Post → Document.
- Renamed category discovery and Reader collection labels without changing routes, filtering, search, or navigation behavior.

## 0.8.1

- Removed the non-functional disabled search control from the discovery home.
- Reframed the first screen around the knowledge identity and topic browsing flow.
- Kept board-scoped search and recent documents on the selected knowledge home.

## 0.8.0

- Reworked discovery, Knowledge Home, collection, and Reader information architecture for documentation-first browsing.
- Added a designed empty state, prominent board-scoped search, compact topic discovery, and readable Reader navigation.
- Reduced hero whitespace and display typography while improving responsive layout density.

## 0.7.0

- Added ephemeral Reader reading progress based on the rendered `DocumentContent` geometry.
- Added bounded, resize-aware progress updates without persistence or analytics.

## 0.6.0

- Added safe Reader section deep linking for existing h2-h4 heading IDs.
- Added post-render hash correction for asynchronously rendered HTML document content.

## 0.5.0

- Added Knowledge-specific `DocumentContent` rendering for sanitized HTML documents.
- Added render-time h2-h4 table of contents with deterministic heading anchors and native fragment links.
- Preserved text-mode rendering without TOC or Markdown parsing.
- Added a shared DOMPurify sanitization boundary for `HtmlContent` and `DocumentContent`.
- Added Reader breadcrumb and adjacent document navigation context.

## 0.4.0

- Added Reader previous/next navigation through the `sirsoft-board` navigation API.
- Added Reader breadcrumb and document context.
- Refined board Home search state and empty-search presentation.

## 0.3.2

- Added the explicit root `/` route to the Home layout.
- Preserved the `/knowledge` alias and dynamic Knowledge routes.

## 0.3.1

- Aligned composite metadata and `HtmlContent` contracts.
- Added dependency lockfile and clean-build reproducibility hardening.

## 0.3.0

- Added the Reader route and document detail rendering with `HtmlContent` and DOMPurify.
- Added Reader metadata, error states, and collection/Home Reader links.

## 0.2.0

- Added category collections, category-aware post filtering, search, and pagination.

## 0.1.0

- Added Foundation discovery, explicit board selection, Knowledge Home, localization, error layouts, and post permission gating.
