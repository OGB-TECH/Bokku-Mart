# Bokku Mart — Code Review Corrections

**Branch reviewed:** `sub-branch`
**Date:** 2026-11-19

---

## 1. Commit Messages (Conventional Commits)

**Verdict:** ❌ Conventional Commits was not followed. None of the 4 commits use it.

Conventional Commits format:

```text
type(scope): short description in imperative mood
```

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `chore`.

### Commit-by-commit review

| Commit | Message | Problem | Suggested rewrite |
|---|---|---|---|
| `b553382` | first commit | No type, and it says nothing about what changed | `chore: initialize project structure` |
| `c1118a4` | I made the home page | No type, first person, past tense | `feat(home): add home page layout` |
| `25f4105` | HOME PAGE DONE | No type, all caps, doesn't say what changed | `feat(home): complete home page sections` |
| `aa85f62` | fixing errors on work-with-us | No type, "-ing" form, vague about which errors | `fix(work-with-us): correct <specific issue>` |

### Additional notes

- **Commits are too large:** "HOME PAGE DONE" bundles a whole page into one commit. Smaller commits, such as one per section or per component, make the history easier to review and to revert.
- **Commit bodies are missing:** fix commits should include a short body explaining what was broken and how it was fixed.
- **A misleading message:** `aa85f62` ("fixing errors on work-with-us") actually **builds the whole Work With Us page**. It adds 611 lines across 11 files, including new images, the page's HTML, CSS and JS, and changes to `variables.css`, `header.css`, `footer.css` and `index.html`. That's new features (`feat`), not a fix, and should have been split into several commits.

### Rules to follow going forward

1. Start every message with a type, such as `feat:`, `fix:` or `docs:`.
2. Add a scope where it helps, such as `feat(contact): ...`.
3. Use the imperative mood and lowercase: "add", not "added", "adding" or "ADDED".
4. Keep the subject line under about 72 characters, with no full stop at the end.
5. Make one logical change per commit.

---

## 2. Home Page Carousel (Hero Slider)

**Files:** `html/home/index.html`, `css/home/home.css`, `js/home/home.js`

**Verdict:** ⚠️ The slide logic in `home.js` is correct, but the carousel often can't be used because of the problems below.

### 2.1 The arrows do nothing when the page is opened directly (high)

`index.html:195` loads the script as a module:

```html
<script type="module" src="../../js/home/home.js"></script>
```

Browsers block module scripts on pages opened from disk (`file://`). Because of that, the slider script never runs, and clicking the arrows or pressing the arrow keys does nothing.

`home.js` doesn't use `import` or `export`, so it doesn't need to be a module.

**Fix:** use a normal deferred script:

```html
<script src="../../js/home/home.js" defer></script>
```

If modules are kept for later use, the README must say clearly that the site **only** works through a server, such as Live Server.

### 2.2 The arrow buttons sit outside the slider and leave the screen on mobile (high)

```css
.prev-btn { left: -60px; }
.next-btn { right: -60px; }
```

The hero only has `padding: 0 5%`. On a 375px phone, that's about 19px of padding, so each button sits about 41px off the edge of the screen and can't be tapped. There are also **no `@media` queries anywhere in the CSS**, so nothing corrects this on small screens. The README claims "Responsive website layout", but that isn't the case yet.

**Fix:** position the buttons inside the slider, using something like `left: 10px` and `right: 10px`, and add mobile breakpoints.

### 2.3 Slides are not links (medium)

Each slide is just a `<div>` containing an `<img>`, so clicking a banner does nothing. On a store site, a banner usually takes the user somewhere, like a promotion, the gift card page or locations. This needs checking against the live site, bokku.com.

**Fix:** wrap each slide image in an `<a href="...">` that points to the matching page.

### 2.4 Missing carousel features (low)

- **No autoplay:** slides only change when the user clicks.
- **No dots or indicators:** users can't see how many slides there are or jump to one.
- **No swipe support** on touch devices.

### 2.5 Minor issues

- **Global arrow keys:** the keyboard listener is attached to `document`, so arrow keys change slides from anywhere on the page. It would be better to listen only when the slider has focus.
- **Hidden slides still read by screen readers:** inactive slides are hidden with only `opacity: 0`, so screen readers still read all 4 images. Add `aria-hidden="true"` to inactive slides, or use `visibility: hidden`.
- **Duplicate alt text:** slides 2 and 3 have the same alt text ("Bokku Mart products").

---

## 3. Header & Navigation

**Files:** `html/home/index.html`, `html/pages/work-with-us.html`, `css/components/header.css`, `css/base/variables.css`, `js/shared/navigation.js`

**Verdict:** ❌ The header only works on the home page, on a wide screen, and even there the menu text can't be read.

### 3.1 Menu text is the same colour as the header background (high)

```css
/* variables.css */
--bg-header: #001DDD;
--text-secondary: #001DDD;

/* header.css */
#main-header   { background-color: var(--bg-header); }
.nav-links a   { color: var(--text-secondary); }
```

The menu links are `#001DDD` text on a `#001DDD` background, so they're invisible until hovered (they turn yellow on hover).

**Fix:** use a light colour for the links, such as `var(--primary-color)` (white) or the yellow `var(--secondary-color)`.

### 3.2 The header is not reusable, and Work With Us has no menu (high)

The README says "Reusable header and footer", but:

- The header HTML is copied by hand into `index.html`.
- `work-with-us.html` only contains a placeholder comment ("Add the same header and navigation HTML you used on the homepage"), so that page has **no menu at all**.
- `js/shared/navigation.js` is **empty (0 bytes)**, even though `work-with-us.html` loads it.

**Fix:** pick one approach and apply it to every page. Either copy the same header markup into each page, or have `navigation.js` insert the header from one shared template. Then update the README to match.

### 3.3 No mobile menu, and the layout breaks on smaller screens (high)

- There are no `@media` queries in `header.css`, and no hamburger menu.
- The 5 links plus the globe icon use `gap: 55px` and `font-size: 20px`. Together with the 200px logo and the side padding, the bar needs roughly **1,150px** of width. On a laptop narrower than that, or on any tablet or phone, the links squeeze, wrap or overflow.

**Fix:** add breakpoints, such as reducing the gap and font size below about 1200px. Below about 768px, hide the links behind a toggle button, which `navigation.js` can handle.

### 3.4 The header height depends on the screen height (medium)

```css
#main-header { height: 15vh; border-bottom: 20px solid ...; }
main         { padding-top: 15vh; }
```

`15vh` is 15% of the *window height*. Because of `border-box`, the 20px border also comes out of that height.

- On a 600px-high window, 15vh is 90px, leaving 70px for content. The navbar needs about 83px (15px padding, a 48px logo with a 5px margin, then 15px padding), so it spills over the border.
- On tall screens, the header becomes needlessly large.

**Fix:** use a fixed height, such as `height: 90px`, or `height: auto` with a matching fixed `padding-top` on `main`. Store the value in a CSS variable, such as `--header-height`, so the header and `main` stay in sync.

### 3.5 Invalid or hacky CSS (medium)

| Line | Code | Problem |
|---|---|---|
| `header.css:32` | `align-items: right;` | `right` is **not a valid value** for `align-items`, so the browser ignores it. Use `center`. To push the links right, `justify-content: space-between` on `.navbar` already does that. |
| `header.css:25` | `margin-left: -30px;` | A negative margin is used to undo the navbar's padding. Adjust the padding instead. |
| `header.css:61` | `margin-right: -10px;` | Same problem on the globe icon. |
| `header.css:60` | `text-decoration: none;` on `<i>` | Has no effect on the icon. The underline rule belongs on the `<a>`, and `typography.css` already sets it. |
| `header.css:22-23` | `width: 200px; height: 48px;` | Setting both dimensions on the logo can distort it. Set only `height` and let the width follow. |
| `header.css:3-7` | `position: fixed` without `top: 0; left: 0;` | Works by accident. State `top: 0` explicitly. |

### 3.6 Links and menu items (medium)

- **Links to blank pages:** `about.html`, `partner-with-us.html`, `locations.html` and `contact.html` are all **empty (0 bytes)**, so 3 of the 5 menu links open a blank page.
- **Contact Us is missing:** the README lists "Contact Us" as a page, but it isn't in the menu.
- **The globe icon isn't a real control:** it's `<a href="#">`, so clicking it just jumps to the top of the page. It should be a `<button>` that opens a language menu, or be removed until that exists.
- **The active state is hard-coded:** `class="active"` is typed by hand into each page. Once the header is shared, `navigation.js` should set it based on the current URL.

### 3.7 Accessibility (low)

- There are no `:focus-visible` styles, so keyboard users can't see which link is focused.
- `<nav>` has no `aria-label="Main navigation"`.
- There's no "Skip to content" link, even though the header is fixed.

### 3.8 Colour variables (low)

- The variable names don't describe what they're used for. `--primary-color` is **white**, but it's used for the slider background, the active underline and the arrow icon colour. Names like `--color-white` or `--color-brand-blue` are clearer.
- Several variables hold the same value: `--bg-header`, `--bg-footer` and `--text-secondary` are all `#001DDD`, and `--accent-color` and `--btn-primary` are both `#0078ff`. Define each brand colour once and refer to it from the other variables.
- `buttons.css`, `forms.css` and `helpers.js` are empty files, but `work-with-us.html` still loads `buttons.css`.

---

## 4. Work With Us Page

**Files:** `html/pages/work-with-us.html`, `css/pages/work-with-us.css`, `js/pages/work-with-us.js`

**Verdict:** ⚠️ The pop-up logic in the JS is well done: it uses the native `<dialog>`, `data-dialog` attributes, closes on a backdrop click and has two close buttons. The page itself is unfinished, though, and not responsive.

### 4.1 Unfinished content (high)

- **No header or footer:** both contain only placeholder comments (see 3.2).
- **Placeholder text in two pop-ups:** Sales and Administration only show `Job Position Title` / `Job description goes here.`
- **The Apply button goes nowhere:** it links to `#application`, but no element on the page has `id="application"`. There's also no application form, even though the README lists a "Contact form" feature.

### 4.2 The pop-ups don't open when the page is opened from disk (high)

Both scripts use `type="module"`, which has the same problem as 2.1. Opened from disk, the job category buttons do nothing. Neither script uses `import` or `export`, so use `<script src="..." defer></script>` instead.

### 4.3 Not responsive (high)

There are no `@media` queries in this file either.

| Rule | Problem on mobile |
|---|---|
| `.job-categories { grid-template-columns: repeat(3, 1fr); }` | Three cards stay side by side on a 375px phone, about 100px each. |
| `.apply-button { font-size: 60px; padding: 25px; }` | "Click here to Apply" at 60px is wider than a phone screen. |
| `.work-apply { height: 28vh; }` | A fixed height based on the window height. The content can overflow on short screens. |
| `.work-intro p { font-size: 25px; text-align: justify; word-spacing: 6px; }` | Very large body text. Justified text with extra word spacing leaves big gaps between words on narrow screens. |

**Fix:** use `repeat(auto-fit, minmax(220px, 1fr))` for the grid. Use `clamp()` or breakpoints for font sizes. Replace the fixed `vh` heights with padding.

### 4.4 Text sizes don't show which text matters most (medium)

- The `h1` "Work with us!" is `25px`, the **same size as the paragraph text** (`25px`), so the page title doesn't stand out.
- Body text is `25px`, while the shared `typography.css` sets `p` to `16px`. The page overrides the shared styles instead of using them.

### 4.5 CSS quality (medium)

- **Duplicated `main` rule:** the same `main { padding-top: 15vh; ... }` block is copied in both `home.css` and `work-with-us.css`. It belongs in a shared file, such as a `layout.css`.
- **Hard-coded colours** in `.dialog-close-button`: `#3285cf`, `#246eaf` and `#ffffff` bypass `variables.css`. Add them as variables.
- **`buttons.css` is empty:** the button styles were written inside the page CSS instead of in the shared component file.
- `.work-banner img { object-fit: contain; height: auto; }`: `object-fit` has no effect when the height is `auto`.

### 4.6 HTML and accessibility (low)

- **Repeated labels for screen readers:** each category button contains `<span>Logistics</span>` and `<img alt="Logistics">`, so screen readers announce "Logistics Logistics". The image is decorative here, so use `alt=""`.
- **A `<section>` used as a wrapper:** `<section class="work-with-us-page">` wraps other sections and has no heading of its own. It should be a `<div>`.
- **Decorative `<hr>`:** the `<hr>` at the end is used only as a yellow stripe. A CSS border is better for that.

### 4.7 Content and code typos (low)

- "Logistic Manager" should be "**Logistics** Manager".
- "Deliver goods to our stores, safe and efficiently" should be "**safely** and efficiently".
- `work-with-us.js:8`: "dailogs" should be "dialogs".
- Missing semicolons in `work-with-us.js` at lines 9, 44 and 56, while other lines have them. Pick one style and use it consistently, or add Prettier.

---

## 5. Footer

**Files:** `html/home/index.html`, `css/components/footer.css`

**Verdict:** ⚠️ It looks fine on the home page, but has the same reuse and sizing problems as the header.

- **(High) Missing on Work With Us:** that page only has a placeholder comment (see 3.2).
- **(Medium) Fixed `height: 24vh`:** on short windows, the heading, icons and copyright overflow the footer. Remove the fixed height and let padding control the size.
- **(Medium) Dead social links:** 6 of the 7 social links are `href="#"`. Add the real Bokku profile URLs with `target="_blank" rel="noopener"`, or remove the links until the URLs are known.
- **(Low) Out-of-date year:** "© Copyright 2024" is hard-coded. Update it, or set it with JS (`new Date().getFullYear()`).
- **(Low) Icons too small to tap:** the icons are `22px` with `10px` padding, about 42px in total, which is just under the recommended 44px minimum.
- **(Low) Footer heading level:** "Get in Touch" is an `<h2>`, which places it inside the page's heading outline. That's acceptable, but check it fits the page's heading order.

---

## 6. Assets & Performance

**Verdict:** ❌ The home page loads about **14 MB** of images.

| File | Size |
|---|---|
| `home-card-1.jpeg` | 4.1 MB |
| `home-card-2.jpeg` | 3.4 MB |
| `home-card-3.jpeg` | 3.4 MB |
| `home-card-4.jpeg` | 3.4 MB |

All 4 slider images load immediately, even though only one is visible. On a mobile data connection, the home page would take a long time to appear.

**Fix:**
- Resize the images to their display size (about 1600px wide at most) and compress them, or convert them to WebP. Each should be under about 300 KB.
- Add `loading="lazy"` to slides 2–4.
- The `store*.jpg` images, at about 600 KB each, should also be compressed before they're used.

**Inconsistent filename casing:** `store1.jpg` is lowercase, but `Store2.jpg` to `Store5.jpg` are capitalised. Most web servers treat `Store2.jpg` and `store2.jpg` as different files, so a link written in lowercase will show a broken image once the site is deployed. Rename them all to lowercase.

---

## 7. README

**Verdict:** ⚠️ The README is well organised, but it **describes features that don't exist yet**.

| README says | Reality |
|---|---|
| 6 pages: Home, About, Work With Us, Partner, Locations, Contact | Only **2** have content. The other 4 HTML files are empty (0 bytes). |
| "Responsive website layout" | There are **no media queries** anywhere in the project. |
| "Contact form" | `contact.html`, `forms.css` and `validations.js` are all empty. |
| "Reusable header and footer" | The header and footer are copied by hand, are missing on Work With Us, and `navigation.js` is empty. |

**Other fixes:**
- **How to run:** explain that the site **must** be served (by Live Server or `python -m http.server`), because `type="module"` scripts don't run from `file://`. Alternatively, drop `type="module"` (see 2.1).
- **Project team:** list the two developers' names or GitHub handles and who did what.
- **Missing pieces:** add a screenshot or a live demo link, such as GitHub Pages, and a "Status / TODO" section listing the unfinished pages.
- **Brand content:** say clearly that this is a **learning project**, not affiliated with Bokku, and that the logo, images and copied text belong to their owners.
- **Missing final newline:** the file doesn't end with a newline.

---

## Summary — Priority Fix List

1. Make the menu text readable, since it's currently blue on blue (3.1).
2. Share the header and footer across all pages, and fill in `navigation.js` (3.2).
3. Remove `type="module"`, or document that a server is required (2.1, 4.2).
4. Add responsive breakpoints and a mobile menu (2.2, 3.3, 4.3).
5. Compress the slider images (6).
6. Finish the placeholder content and the Apply link, and build the 4 empty pages (4.1, 7).
7. Fix the hacky or invalid CSS and move hard-coded values into variables (3.5, 4.5).
8. Use Conventional Commits and smaller commits from now on (1).
