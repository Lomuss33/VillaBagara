# User Guide

Back to the repo overview: [README.md](./README.md)

Maintainer and schema notes: [MAINTANER.md](./MAINTANER.md)

## Purpose

This file explains the visible clickable controls in the website and what each one does. It is focused on the live interface, not the internal code structure.

## Main Navigation

### Sidebar and section links

- Clicking a section link opens that section.
- On desktop, the left sidebar is the main navigation.
- On mobile, the current section links appear near the top and the category tabs appear at the bottom.

### Category tabs

- Bottom tabs on mobile switch between the top-level groups like Home, History, Hobbys, and Contact.
- When a category contains multiple sections, the app remembers the last visited section inside that category.

## Profile Area

### Avatar and profile card

- The profile card shows the avatar, name, current roles, and status.
- The animated role text rotates automatically when more than one role is defined.

### Status circle

- Clicking the status circle jumps directly to the `contact` section.
- The hover message explains the current availability state.

### Name pronunciation button

- The speaker button next to the name plays the pronunciation audio when an audio URL is configured.
- If only IPA text is configured, the tooltip still explains the pronunciation.

## Top/Side Tools

### Language picker

- Opens a dropdown with all enabled languages.
- Choosing one immediately switches the interface and content translations.

### Theme picker

- Switches between the configured themes, usually dark and light mode.
- Theme changes affect colors, icons, and any theme-aware image/text placeholders.

### Magic cursor toggle

- Turns the animated cursor effect on or off.
- This option only appears on devices/layouts where the custom cursor is supported.

### Resume download

- Downloads or opens the configured resume PDF.
- If no PDF is configured, the site shows an error notification instead.

### Fullscreen toggle

- On supported desktop browsers, the fullscreen button expands the current section into fullscreen mode.
- The button is hidden on unsupported layouts or browsers.

## Section Content Controls

### Category filter buttons

- Some articles show filter buttons such as `All`, `Tools`, or `Web`.
- Clicking a filter only changes the items inside that article, not the whole page.

### Preview buttons on projects and media items

- Video button: opens an embedded YouTube video in a modal.
- Camera/gallery button: opens screenshots in a gallery modal.
- Link buttons: open an external page after a confirmation dialog.

### External links

- External links do not open immediately.
- The site first shows a confirmation dialog explaining that the user is leaving the site.

### Copy buttons

- Some contact or handle fields show a copy button.
- Clicking it copies the related text to the clipboard and briefly shows a success state.

## Contact Section

### Contact links

- WhatsApp, Telegram, LinkedIn, Discord, Instagram, and similar entries open the configured destination.
- Some entries are optimized for quick actions, for example Gmail compose links or copyable usernames.

### Contact form

- The form validates name, email, subject, and message before sending.
- If the message is accepted, a success message replaces the form.
- Email delivery depends on the EmailJS configuration in the content JSON.

## Modals and Overlays

### Gallery modal

- Opens when a gallery-enabled item is clicked.
- Used for screenshots, travel albums, and similar image collections.

### YouTube modal

- Opens when a video-enabled item is clicked.
- Used for project demos or related videos.

### Confirmation dialog

- Appears before opening external links.
- Lets the user continue or cancel.

### Notifications

- Small feedback messages appear for actions like errors, cursor toggle, or missing files.

## Neue Karte hinzufügen

If by "Karte" you mean a new visible content card/item on the website, the usual workflow is:

1. Open the target section file in `public/data/sections/`.
2. Find the article block that should contain the new card.
3. Add a new object to that article's `items` array.
4. Keep the `id` unique within that article.
5. If the article uses categories, set `categoryId` to one of the values from `settings.categorize_by`.
6. Fill in the visible fields such as `locales.title`, `locales.text`, `img`, `faIcon`, `tags`, and `preview`.

Common examples:

- Portfolio/project card: title, text, tags, optional image, optional preview links, optional screenshots.
- Info list card: title, text, icon, optional link, optional copy button.
- Timeline card: title, institution, location, dates, description, and tags.

Important:

- Use `categoryId`, not the old `category` field, for new content.
- Use an array in `settings.categorize_by`, not the old string form.
- If you need a completely new visual card type, that is a maintainer task and is described in [MAINTANER.md](./MAINTANER.md).
