# Keyboard navigation and accessibility

Implemented for Villa Bagara's seven hash routes and four languages. This is the interaction contract; automated checks and browser samples do not certify complete WCAG conformance.

## Guest controls

| Control | Keyboard behavior |
| --- | --- |
| Skip to page content | First Tab stop. Enter moves to the current section heading. |
| Section links | Tab/Shift+Tab reach every link; Enter opens its real hash destination. Up/Down move within the desktop list; Left/Right within phone links. Home/End move to the first/last link. Arrow movement does not change pages. |
| Language | Enter/Space opens the menu; arrows move between languages; Enter/Space chooses; Escape closes. Selection and dismissal return focus to the language button. The checked item and document language stay in sync. |
| Theme, sidebar, contact/status | Native buttons or links with localized action names. Sidebar expansion exposes `aria-expanded`; the active section exposes `aria-current="page"`. |
| Contact form | Persistent labels identify all four required fields. Tab reveals the focused field above fixed navigation/contact controls. Arrow keys edit text; they never collapse navigation or change sections. |
| Photos and external-link confirmation | Enter/Space opens a named dialog. Focus starts on Close, Tab/Shift+Tab stay inside, and Escape cancels/closes. Closing restores focus to the opener and releases background interaction. |
| Multi-photo desktop gallery | Previous/next buttons and pagination work by keyboard. The photo position is announced; boundary controls retain focus and announce unavailability. On phones, landscape collections use a scrollable image stack. |
| Copy contact details | A named native button identifies the value; successful copying is announced. |

All seven destinations, including Gallery, Videos and Contact, appear on every phone page. Narrow phones use two rows of named links. The four bottom shortcuts remain Home, Stay, Services and Story. Modified link activation retains normal browser behavior.

## Implementation owners

- [LayoutNavigation](../src/components/layout/LayoutNavigation.jsx), [Nav](../src/components/nav/base/Nav.jsx), [navigation helpers](../src/hooks/navigationAccessibility.js) and [NavigationProvider](../src/providers/NavigationProvider.jsx): landmarks, skip link, local shortcuts, hash/title updates, focus and scrolling. Focus waits for transitions/overlays and respects a visitor who moved it meanwhile.
- [GestureAwareButton](../src/components/buttons/GestureAwareButton.jsx), [OptionPickerButton](../src/components/buttons/OptionPickerButton.jsx), [CopyButton](../src/components/buttons/CopyButton.jsx), form fields and nav tools: native semantics and localized names. Tooltips supplement accessible names.
- [Section](../src/components/sections/Section.jsx) and [Scrollable](../src/components/capabilities/Scrollable.jsx): inactive sections are inert/hidden; desktop scrolling is native and keyboard reachable. Hidden sticky navigation is inert.
- [Preloader](../src/components/loaders/Preloader.jsx): loading is announced; background controls remain inert until loading finishes, and the fading loader cannot intercept keyboard focus.
- [ModalWrapper](../src/components/modals/base/ModalWrapper.jsx) and [GalleryModal](../src/components/modals/GalleryModal.jsx): Bootstrap lifecycle, dialog naming, explicit Tab boundaries, background inertness, focus return, photo descriptions and controls.
- [Accessibility styles](../src/styles/_accessibility.scss), owning SCSS and [index.html](../index.html): visible focus, generous control sizes, scroll clearance, Windows forced-color styles, reduced-motion transitions/scrolling, and unrestricted browser zoom. The role ticker pauses on navigation focus/hover and becomes static under reduced motion.
- [Strings](../public/data/strings.json) own English, German, Croatian and Turkish control labels. Preserve their keys and stable section IDs.

## Verification and maintenance

Run `npm run check`; it includes `check:keyboard` regression tests for native/modified activation, group direction, wrapping and unrelated keys. Inspect UI behavior whenever controls, ordering, scrolling, transitions or dialogs change.

Browser verification uses the built `/VillaBagara/` site, normal keyboard events and real narrow browser frames when preview resizing is unavailable. Check desktop and 320/390px layouts, all four languages and both themes. Check direct hashes, section heading focus, local arrows, language dismissal/selection, theme activation, form caret movement and unobscured fields. Open/close photos and confirmation dialogs repeatedly; confirm no backdrop, inert attribute or scroll lock remains.

Run an accessibility scanner against stable rendered pages and open dialogs, then inspect its incomplete checks manually. A language menu intentionally covers background targets while open. Preserve ordinary browser zoom and modified navigation shortcuts. Test 200% zoom, reduced motion and Windows forced colors with real browser settings; perform NVDA/Firefox or Chrome and VoiceOver/Safari checks before claiming broader assistive-technology coverage. Email delivery is a separate owner-confirmed check.

Verified on 2026-10-13: four keyboard regression tests, 66 Chrome browser assertions and 31 WCAG-tag scanner runs passed without flagged violations, runtime errors or missing local assets. Coverage included all seven routes, four locales, both themes, 1280/390/320px layouts, reduced motion, forced colors, repeated dialogs and landscape/portrait photo collections. Some image/gradient contrast checks require manual review. Physical screen-reader/device testing, video playback (current entries are placeholders) and email delivery remain separate checks.

Design references: [WAI disclosure navigation](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/), [WAI modal dialogs](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), [focus not obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html), and [resizable text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html).
