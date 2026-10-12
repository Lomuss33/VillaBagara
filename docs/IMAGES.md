# Responsive estate images

The estate photo uses three WebP sizes. `ImageView` measures its layout box before adding the image and supplies base-aware `srcset` candidates; the browser chooses for the current size and pixel density. Resizing updates `sizes`. The gallery wall sets `responsive={false}` so repeated tiles and the modal share one full-size image. `LayoutImageCache` skips registered responsive sources so small cards do not also download the full photo in the background.

| Width | Height | File | Encoded bytes |
| --- | --- | --- | --- |
| 480 | 320 | `public/images/villa_bagara/estate/front-porch-480.webp` | 57,832 |
| 960 | 640 | `public/images/villa_bagara/estate/front-porch-960.webp` | 222,674 |
| 1536 | 1024 | `public/images/villa_bagara/estate/front-porch.webp` | 517,906 |

The small candidate is 89% smaller than the full WebP. Transfer selection depends on viewport, pixel density, and the browser cache. A guest who opens the gallery also downloads the full photo. Unregistered images retain their existing single-source behavior.

## Edit and regenerate

1. Replace the original `public/images/villa_bagara/estate/front-porch.png` with the approved photo; retain its aspect ratio and at least 960px width.
2. Run `npm run images:responsive`. The explicit source list lives in [the generator](../scripts/generate-responsive-images.mjs). It uses pinned `sharp-cli@6.1.0` at quality 85, without adding an application dependency.
3. Inspect the generated images and commit the WebPs together with [the generated manifest](../src/data/generated/imageManifest.generated.js). Keep active JSON and modal screenshots pointing to the full `.webp` source; `ImageView` selects its derivatives automatically.
4. Run `npm run check` and verify Home, a gallery tile/modal, cached navigation, and a mobile viewport at `/VillaBagara/`.

[Static checks](../scripts/check-static.mjs) verify actual binary dimensions, increasing candidate widths, aspect ratios, case-sensitive files, both URL bases, full-resolution availability, and [payload budgets](../scripts/budgets.json). CI uses committed derivatives and never needs to run the image generator. Update recorded sizes and justify budget changes when replacing the source.

Ownership: [ImageView](../src/components/generic/ImageView.jsx), [candidate resolver](../src/hooks/utils/_image-utils.js), and [image cache](../src/components/layout/LayoutImageCache.jsx). Agent documentation and image generation code stay outside the browser payload.
