# Thistle Creative Photography

A responsive photography website for Rachel, built with plain HTML, CSS and JavaScript. It uses the supplied photography and Thistle branding, with a Counterform credit in the footer. There are no package dependencies, external font requests, build steps or database requirements.

## Preview locally

From this project folder, with Node.js installed:

```sh
node preview.mjs
```

Open [http://127.0.0.1:4173](http://127.0.0.1:4173) in a browser. Refresh after editing files. Press `Ctrl+C` in the terminal to stop the server.

If the port is already in use, set `PORT` before running the same command. In PowerShell:

```powershell
$env:PORT = '4174'
node preview.mjs
```

The preview server binds only to this computer. Node.js is needed for this preview command; GitHub Pages serves the website files directly.

## Publish with GitHub Pages

The intended repository is [fullstackprocrastinator/thistle-creative-photography](https://github.com/fullstackprocrastinator/thistle-creative-photography).

1. Keep `index.html`, `styles.css`, `script.js`, `.nojekyll` and the `assets` folder at the root of the repository's `main` branch.
2. Open the repository's **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Select branch **main** and folder **/ (root)**, then click **Save**.
5. Wait for the Pages deployment to complete. The Pages settings display the published address; the repository's **Actions** tab shows deployment progress or errors.

Once enabled, the expected address is [https://fullstackprocrastinator.github.io/thistle-creative-photography/](https://fullstackprocrastinator.github.io/thistle-creative-photography/). Later commits to `main` publish automatically. This project does not need a custom GitHub Actions workflow. See [GitHub's publishing-source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Enquiries

The form prepares an email addressed to **thistlecreativephotography@gmail.com**. It opens the visitor's configured email app using `mailto:`; the visitor must press **Send** in that app. The website does not send or store form submissions, and it does not report an enquiry as sent. The direct email link and Instagram/Facebook links provide alternative ways to contact Rachel.

To change the address, update its occurrences in both `index.html` and `script.js`, including the page's structured data. Rachel's biography and session descriptions are in `index.html`. No location, prices or booking availability have been assumed.

## Update the photographs

Current photographs are `assets/dance.jpg`, `assets/gymnastics.jpg` and `assets/pets.jpg`. Replacing one while keeping the same filename updates every place it appears. Preserve image orientation where possible, and update the HTML `width` and `height` attributes if the replacement dimensions differ.

To add a gallery photograph:

1. Add the image to `assets`, using a simple lowercase filename without spaces.
2. Copy a complete `.gallery-item` button inside `#gallery` in `index.html`.
3. Set `data-category` to `dance`, `gymnastics` or `pets`. Update `data-image`, `data-title`, `data-description`, the button's `aria-label`, its image `src`, descriptive `alt`, dimensions and visible caption.
4. Update the counts in the **Everything** and subject filters, their accessible count labels, and `#gallery-status`. Filtering and lightbox navigation calculate their counts automatically after interaction.

Keep asset paths relative, such as `assets/dance.jpg`, so they work under the GitHub Pages repository path. If the repository or domain changes, update the absolute image URLs in the social metadata and structured data near the top of `index.html`.

## Design and interactions

Colours, typography and responsive layouts are in `styles.css`. `script.js` handles the mobile menu, gallery filters, keyboard-accessible photo viewer, email draft and entrance animations. Visitors who request reduced motion receive the content without animation. The photographs and page content remain visible when JavaScript is unavailable.

After editing, check a desktop and mobile layout, keyboard navigation, all gallery filters, opening/closing photographs, and the enquiry draft. Do not send a test email unless you intend to contact Rachel.
