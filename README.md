# MH Printers & Enterprises

Responsive React + Vite website for the MH Printers catalog.

## Run locally

```sh
npm install
npm run dev
```

PDF uploads are converted to JPG page previews using Poppler (`pdfinfo` and `pdftoppm`). On Debian/Ubuntu, install it with:

```sh
sudo apt install poppler-utils
```

## Catalog pages

- `/wedding-cards` links to customise, fancy, normal and special-offer wedding card collections. Customise PDFs are shown as page-by-page image galleries.
- `/big-boxes` shows the Bidd Boxes PDF as a page-by-page image gallery.
- `/lala` manages products, sections, and individual wedding card previews.

Uploads made through `/lala` while running `npm run dev` are saved under `public/uploads/`. PDFs are kept as originals and rendered to JPG previews; the manifest is stored in `public/uploads/catalog.json`. The generated files are included in a subsequent production build. Rebuild and redeploy to publish new uploads to the live website. Do not expose the local Vite upload endpoint to an untrusted network.

Use the same browser and exact local address (`http://127.0.0.1:5173` or `http://localhost:5173`) each time. Browser-saved data is isolated by browser and origin, so `localhost` and `127.0.0.1` have separate local admin credentials and IndexedDB records. After saving or deleting an upload, the catalog pages refresh from the project files. The `/lala` admin route is available only in development; a live website needs a proper authenticated backend to manage uploads directly.

The admin password is a convenience lock, not server-grade authentication. Existing older uploads may still be stored in IndexedDB on the browser that created them.

The header theme control switches between light and dark themes; the selection is remembered in the current browser.

## Checks

```sh
npm run build
npm run lint
```
