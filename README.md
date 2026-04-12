# MONVAN25503_PTO2502_A_Monique-VanDenBerg_DJSPP# 🎙️ Podcast App

A fully-featured podcast browsing and listening application built with React. Browse shows, favourite episodes, and enjoy seamless audio playback across all pages.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Author](#author)

---

## 🧭 Overview

This podcast app was built as a portfolio piece for the DJS course. It allows users to browse a large catalogue of podcasts, filter and sort by genre, favourite specific episodes, and listen to audio content — all with a persistent global audio player and a light/dark theme toggle.

---

## ✨ Features

### 🏠 Landing Page
- Searchable, filterable, and sortable podcast grid
- Genre filter and sort by newest, oldest, A–Z, Z–A
- Recommended Shows carousel with looping navigation
- Pagination

### 🎧 Global Audio Player
- Fixed player bar at the bottom of every page
- Play, pause, seek, and volume control
- Next and previous episode navigation
- Audio continues playing across page navigation
- Confirmation prompt on page reload during playback

### ❤️ Favourites
- Favourite or unfavourite any episode with a heart button
- Visual feedback with filled/unfilled heart icon
- Favourites persist across sessions via localStorage
- Dedicated favourites page grouped by show
- Shows season and episode number for each favourite
- Date and time added to favourites
- Sort favourites by title (A–Z / Z–A) or date added (newest/oldest)

### 🎠 Recommended Shows Carousel
- Horizontally scrollable carousel on the landing page
- Shows image, title, and genre tags
- Loops continuously in both directions
- Click to navigate to show detail page

### 🌗 Theme Toggle
- Light and dark mode support
- Theme persists across sessions via localStorage
- Sun/moon icon indicates current mode
- All UI elements update smoothly on toggle

### 📺 Show Detail Page
- Full show information with cover image and metadata
- Season selector dropdown
- Episode list with play and favourite buttons
- Back navigation with filter state restoration

---

## 🛠️ Technologies Used

| React | Vite | CSS Modules |
| localStorage | Data persistence |
| Vercel | Deployment |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Moniquevdb109/MONVAN25503_PTO2502_A_Monique-VanDenBerg_DJSPP.git
```

2. Navigate into the project folder:
```bash
cd podcast-app
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser

---

## 📖 Usage

- **Browse shows** — use the search bar, genre filter, and sort dropdown on the landing page
- **View a show** — click any podcast card to see seasons and episodes
- **Play audio** — click the play button on any episode, the global player appears at the bottom
- **Favourite an episode** — click the heart icon on any episode card
- **View favourites** — click the Favourites link in the header
- **Toggle theme** — click the sun/moon button in the top right corner

---

## 👩‍💻 Author

**Monique Van Den Berg**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](http://linkedin.com/in/monique-van-den-berg)  
[![GitHub](https://img.shields.io/badge/GitHub-Profile-black?logo=github)](https://github.com/Moniquevdb109)
