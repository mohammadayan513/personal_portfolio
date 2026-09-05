# Alex Morgan — Portfolio Website

A premium, fully-responsive personal portfolio built with pure HTML, CSS and JavaScript.

## Folder Structure

```
portfolio/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── images/
│   ├── profile.jpg        ← Replace with your photo
│   ├── about.jpg          ← Replace with a casual/work photo
│   ├── project1.jpg       ← Project screenshots (600×360 px recommended)
│   ├── project2.jpg
│   ├── project3.jpg
│   ├── project4.jpg
│   ├── project5.jpg
│   └── project6.jpg
├── assets/
│   ├── icons/
│   └── resume/
│       └── resume.pdf     ← Place your CV here
└── README.md
```

## Quick-start Checklist

1. **Profile image** — drop `profile.jpg` into `images/`
2. **About image**   — drop `about.jpg` into `images/`
3. **Name & title**  — search for `Alex Morgan` in `index.html` and replace everywhere
4. **Bio text**      — update the `<p>` blocks inside `#hero` and `#about`
5. **Skills**        — edit `data-width` attributes on `.skill-fill` elements (0–100)
6. **Projects**      — update titles, descriptions, GitHub links and Live Demo links
7. **Project images**— drop `project1.jpg` … `project6.jpg` into `images/`
8. **Contact info**  — update email, phone, location and social URLs in `#contact`
9. **Resume**        — drop `resume.pdf` into `assets/resume/`
10. **Social links** — update all `href="https://github.com/"` and LinkedIn URLs

## Adding a New Project

Copy the block between `<!-- ══ PROJECT CARD N ══ -->` markers in `index.html`,
paste it after the last card (before the `<!-- ADD NEW ... -->` comment),
then update the image src, title, description, tags and button links.

## Connecting the Contact Form

In `js/script.js`, find the `handleSubmit` function and replace the `setTimeout`
block with a real fetch call to Formspree, EmailJS, or any SMTP service.

## Tech Stack

- HTML5 (semantic, SEO-friendly)
- CSS3 (custom properties, Grid, Flexbox, animations)
- Vanilla JavaScript (ES6+, IntersectionObserver, no dependencies)
- Google Fonts: Space Grotesk, Inter, JetBrains Mono

## License

Free to use for your own portfolio.
