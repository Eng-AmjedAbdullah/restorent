# RestoraIntel — retained image inventory

Generated from the Vue-only release candidate. All retained images are referenced by the active Vue code or index.html. Old, unused images were removed from the production source and archived in a separate backup ZIP.

| Public URL | Bytes | SHA-256 prefix | Usage |
| --- | ---: | --- | --- |
| `/branding/apple-touch-icon.png` | 62,093 | `ffdcb8363688` | Browser/PWA icon; displayed in gallery or linked in HTML |
| `/branding/favicon-16.png` | 1,027 | `8a3d3f8b37f6` | Browser/PWA icon; displayed in gallery or linked in HTML |
| `/branding/favicon-32.png` | 3,149 | `7028f033221e` | Browser/PWA icon; displayed in gallery or linked in HTML |
| `/branding/favicon.ico` | 15,342 | `75771b415d2f` | Browser/PWA icon; displayed in gallery or linked in HTML |
| `/branding/icon-192.png` | 69,945 | `9a202685c34e` | Browser/PWA icon; displayed in gallery or linked in HTML |
| `/branding/icon-512.png` | 373,268 | `12d176c2311c` | Browser/PWA icon; displayed in gallery or linked in HTML |
| `/branding/logo-compact-mark-dark.webp` | 18,378 | `71c558c1b5dc` | Used brand asset in actual app or branding gallery |
| `/branding/logo-lockup-dark.webp` | 89,086 | `8aefa91993ea` | Used brand asset in actual app or branding gallery |
| `/branding/logo-mark.webp` | 46,160 | `a4138d5481db` | Used brand asset in actual app or branding gallery |
| `/branding/logo-without-bg-trimmed.webp` | 60,382 | `89fa1b139046` | Used brand asset in actual app or branding gallery |
| `/iconwithoutback.png` | 2,700,102 | `ed84b3fa0f3d` | Original transparent master used in the source-assets gallery |
| `/logowithoutback.png` | 2,116,722 | `dab022daf977` | Original transparent master used in the source-assets gallery |

## Intentional visual preservation

The authentic RestoraIntel mark, wordmark and circuitry were not redesigned or recolored. Browser/PWA PNG canvases are padded to the exact standard square sizes (16×16, 32×32, 180×180, 192×192, 512×512) without stretching the underlying art. The favicon.ico asset is preserved.

The removed-image backup holds 27 files from the original upload, including original root logo masters. It is delivered **separately** from the production source ZIP so the clean app does not ship duplicate gigabyte-scale source assets. The original uploaded ZIP and prior repaired ZIP remain the separate recoverable reference for legacy TSX source.

Optional icon-canvas recipe: `scripts/normalize-brand-icons.cjs` requires the Sharp package if rerun; the exported icons are already normalized and do not require Sharp to run the app.
