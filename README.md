# Zaiki - Personal Developer Portfolio

A clean, responsive personal portfolio built with plain HTML, CSS, and JavaScript (no frameworks, no build tools). Designed to showcase my work, academic background, and technical skills as a computing student specialising in interactive media.

**Live site -> [zaiki505.github.io/Zaiki-Personal-Portfolio](https://zaiki505.github.io/Zaiki-Personal-Portfolio)**


## Overview

This portfolio was built from scratch as a personal project to establish a professional web presence while studying for my BSc in Computer Science (Interactive Media) at Universiti Teknikal Malaysia Melaka (UTeM).

The design follows a dark-first aesthetic with a toggleable light theme, minimal use of colour, and deliberate use of whitespace. The focus is on content clarity and smooth interaction without visual noise.

---

## Features

### Dark / Light Theme Toggle
A theme switch is available on every page. The user's preference is persisted via `localStorage` so it carries across pages and sessions without flashing on load.

### Skills Filter System
The Skills & Competency page features an interactive filter that lets visitors sort skills by category: **All**, **Languages**, **Tools**, **Design**, or **Personal Qualities**. Each skill card carries a `data-category` attribute that the filter reads, switching tabs instantly shows or hides the relevant cards without a page reload.

### Project Category Filter
The Projects page has the same filtering pattern, letting visitors sort work by type: **All**, **Web Development**, **System Design**, **Creative Content**, or **Personal Project**. Each project card is tagged accordingly.

### CGPA Tracker
The Education page includes a semester-by-semester academic record for the UTeM degree programme. Completed semesters display their CGPA, future semesters are reserved as empty slots. The tracker updates as new results are added.

### SPM Subject Breakdown Toggle
The secondary education section includes a collapsible panel showing individual subject grades from the Malaysian SPM examination. The breakdown is hidden by default and revealed on interaction to keep the page clean.

### Breadcrumb Navigation
Every sub-page displays a contextual breadcrumb (`Home › Page Name`) below the navigation bar, making it easy to navigate within the site.

### Contact Form
The contact page includes a form for direct messages with no server required. Fields include name, email, and message, all with required validation and correct input types.

---

## Pages

| Page | Path | Description |
|---|---|---|
| Home | `index.html` | Hero section, short about snapshot, featured projects, and contact links |
| About | `about.html` | Full bio, profile photo, contact details, viewing resume, and current focus  |
| Education | `education.html` | Academic timeline (UTeM, UiTM, IQKL), CGPA tracker, SPM results, MUET band, and notable achievements |
| Projects | `projects.html` | Full project listing with category filter |
| Skills | `qualities.html` | Technical skills by tier (Advanced / Intermediate / Beginner) with category filter, plus personal qualities |
| Contact | `contact.html` | Live availability status, social links, and contact form |
| Resume | `resume.html` | Viewable resume with download option |
| 404 | `404.html` | Custom error page, matching the site design, served automatically by GitHub Pages |

### Project Detail Pages

Each project card links to a dedicated detail page in the `projects/` subfolder:

| Project | Path |
|---|---|
| Attention Monitoring Detector | `projects/Attention Detector.html` |
| House Rental Management System | `projects/Workshop 1.html` |
| Network Design for Cyber Cat Café | `projects/Network-design.html` |
| CineTrack: Smart Movie Tracker | `projects/CineTrack.html` |
| CS Training Centre Application | `projects/CS-TCA.html` |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | Vanilla CSS (custom properties, backdrop-filter, CSS animations) |
| Scripting | Vanilla JavaScript (no libraries) |
| Fonts | JetBrains Mono via Google Fonts |
| Hosting | GitHub Pages |

No npm, no bundler, no framework. The entire site runs by opening an HTML file in a browser.

---

## Project Structure

```
/
├── index.html
├── about.html
├── education.html
├── projects.html
├── qualities.html
├── contact.html
├── resume.html
├── 404.html
├── reports/
│   └──... (list of all project reports)
├── css/
│   ├── achievements.css
│   ├── base.css
│   ├── education.css
│   ├── homepage.css
│   ├── misc.css
│   ├── projects.css
│   └── skills.css
├── assets/
│   ├── favicon.png
│   ├── profile-photo.jpg
│   ├── utem-logo.png
│   ├── uitm-logo.png
│   └── iqkl-logo.jpg
├── projects/
│   ├── Attention Detector.html
│   ├── Workshop 1.html
│   ├── Network-design.html
│   ├── CineTrack.html
│   └── CS-TCA.html
└── script.js

```


---

## Deployment

The site is deployed via **GitHub Pages** from the `main` branch root. Any push to `main` triggers an automatic redeploy - no CI/CD configuration needed.

Custom 404 handling is provided by `404.html` in the repo root, which GitHub Pages serves automatically for any unmatched route.

---

## Academic Context

| Detail | |
|---|---|
| Degree | BSc Computer Science (Interactive Media) |
| University | Universiti Teknikal Malaysia Melaka (UTeM) |
| Status | Ongoing - Year 2 of 3 |
| Dean's List | Semester 1, 2, and 3 |

The base layout of this portfolio was built independently before any coursework requirement, a personal project to establish a professional web presence early. It was later expanded in greater depth as part of a coursework assignment, adding additional pages, interactivity, and polish beyond what is required.

---

## Author

**Muhd Uzair** (zaiki), Selangor, Malaysia

- GitHub: [github.com/zaiki505](https://github.com/zaiki505)
- LinkedIn: [linkedin.com/in/muhd-uzair-473333378](https://www.linkedin.com/in/muhd-uzair-473333378/)
- Email: shamsulzire@gmail.com

---

## License

This project is open for reference and inspiration. Please do not copy the content, copy directly, or republish as your own portfolio. Code structure and implementation patterns are fine to adapt.
