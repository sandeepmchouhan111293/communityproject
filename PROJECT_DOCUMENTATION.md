# Sen Community Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Project Structure](#project-structure)
4. [Setup & Installation](#setup--installation)
5. [Core Technologies](#core-technologies)
6. [Authentication (Supabase)](#authentication-supabase)
7. [Internationalization (i18n)](#internationalization-i18n)
8. [Routing](#routing)
9. [Component Overview](#component-overview)
10. [Styling & Theming](#styling--theming)
11. [Testing](#testing)
12. [Assets & Public Files](#assets--public-files)
13. [Deployment](#deployment)
14. [Contributing](#contributing)
15. [License](#license)

---

## Project Overview
Sen Community is a modern, multilingual React web application for spiritual community engagement. It features authentication, a dashboard, profile management, family tree, events, and more. The project is built with React, Supabase, and supports both English and Hindi.

## Features
- User authentication (sign up, login) via Supabase
- Multilingual support (English/Hindi)
- Dashboard with news, stats, quick actions, and member highlights
- Profile management with editable personal info
- Family tree and community features (planned/partial)
- Responsive, modern UI with custom theming
- Accessible and mobile-friendly

## Project Structure
```
communityproject/
├── public/
│   ├── favicon.ico
│   ├── images/
│   │   ├── Sen Ji Maharaj 1.png
│   │   └── Sen Ji Maharaj 2.png
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── Dashboard.css
│   ├── Dashboard.js
│   ├── index.css
│   ├── index.js
│   ├── LanguageContext.js
│   ├── LanguageToggle.css
│   ├── LanguageToggle.js
│   ├── Login.css
│   ├── Login.js
│   ├── logo.svg
│   ├── reportWebVitals.js
│   ├── setupTests.js
│   ├── Signup.css
│   ├── Signup.js
│   ├── supabaseClient.js
│   └── translations.js
├── package.json
├── README.md
└── ...
```

## Setup & Installation
1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd communityproject
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the development server:**
   ```sh
   npm start
   ```
   The app runs at [http://localhost:3000](http://localhost:3000).

## Core Technologies
- **React 19**: UI library
- **React Router v7**: Routing
- **Supabase**: Auth & backend
- **Jest/Testing Library**: Testing
- **CSS**: Custom theming, responsive design

## Authentication (Supabase)
- Configured in `src/supabaseClient.js` with project URL and anon key.
- Used in `Login.js` and `Signup.js` for user authentication.
- Auth state is monitored in `App.js`.

## Internationalization (i18n)
- Language context in `LanguageContext.js`.
- Translations in `translations.js` (English/Hindi).
- Language toggle UI in `LanguageToggle.js`/`.css`.
- All major UI strings are translated using the `t` function.

## Routing
- Managed by `react-router-dom` in `App.js`.
- Main routes:
  - `/` or `/login`: Login page
  - `/signup`: Signup page
  - `/dashboard`: Main dashboard (protected)

## Component Overview
- **App.js**: Root, sets up router, language provider, and auth listener.
- **Login.js**: Login form, language toggle, Supabase auth.
- **Signup.js**: Registration form, Supabase sign up, validation.
- **Dashboard.js**: Main dashboard, home view, profile view, news, stats, quick actions, member highlight, and more.
- **LanguageContext.js**: Provides language state and toggle.
- **LanguageToggle.js**: UI for switching languages.
- **translations.js**: All translation strings.
- **supabaseClient.js**: Supabase client setup.

## Styling & Theming
- Custom CSS for each major component (`Login.css`, `Signup.css`, `Dashboard.css`, etc.)
- Responsive layouts, modern cards, gradients, and avatars.
- Google Fonts for Devanagari/Hindi support.

## Testing
- Tests in `App.test.js` using Jest and React Testing Library.
- Setup in `setupTests.js`.

## Assets & Public Files
- Images in `public/images/` (e.g., Sen Ji Maharaj images for branding)
- Favicon, manifest, and meta tags in `public/`
- `index.html` is the main HTML template

## Deployment
- Build with `npm run build`.
- Deploy the `build/` folder to your preferred static hosting (Vercel, Netlify, Firebase, etc.)

## Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your fork and open a Pull Request

## License
This project is licensed under the MIT License.

---

## Additional Notes
- **Security:** Never commit your real Supabase anon key to a public repo. Use environment variables for production.
- **Extensibility:** The project is modular and ready for new features (family tree, events, discussions, etc.).
- **Accessibility:** Follows best practices for accessible forms and navigation.
- **Mobile Friendly:** All layouts are responsive and tested on mobile.

For any questions, please contact the project maintainer.
