# Internshala Clone

A React-based clone of [Internshala](https://internshala.com) — a popular Indian internship and job portal. Built as a frontend portfolio project with mock data and localStorage-based state management.

## Features

- **Internship Listings** — Browse, search, and filter internships by category, location, and stipend
- **User Authentication** — Register, login with OTP verification, and logout
- **Application Tracking** — Apply to internships and track application status from your dashboard
- **Subscription Plans** — Free, Bronze, Silver, and Gold tiers with different application limits
- **Resume Builder** — Build and preview a professional resume (available on paid plans)
- **Public Space** — Community feed where users can post updates, like, and comment
- **Login History** — View past login sessions with device, browser, and IP info
- **Multi-Language Support** — Switch between English, Hindi, Spanish, Portuguese, Chinese, and French
- **Profile Management** — Update personal info, college, and degree details

## Getting Started

```bash
npm install
npm start
```


## Tech Stack

- **React 18** with hooks
- **React Router v6** for client-side routing
- **react-hot-toast** for notifications
- **localStorage** for data persistence (simulates a backend)
- **CSS Variables** for theming

## Project Structure

```
src/
├── context/
│   └── AppContext.js        # Global state: auth, internships, posts, subscriptions
├── components/
│   ├── Navbar.js            # Top navigation with language switcher
│   └── OTPModal.js          # Reusable OTP input modal
└── pages/
    ├── Home.js              # Landing page
    ├── Login.js             # Login with OTP verification
    ├── Register.js          # New user registration
    ├── ForgotPassword.js    # Password reset flow
    ├── Internships.js       # Browse and filter listings
    ├── InternshipDetail.js  # Internship details and apply
    ├── Dashboard.js         # User overview and applications
    ├── Profile.js           # Edit profile info
    ├── PublicSpace.js       # Community feed
    ├── ResumeBuilder.js     # Resume creation (premium)
    ├── Subscription.js      # Upgrade plan
    └── LoginHistory.js      # Past login sessions
```

## Deployment

  Netlify

## Notes

- All data is stored in the browser's localStorage — clearing site data will reset everything
- TODO: Replace localStorage with a real API once backend is ready
- TODO: Wire up actual email/SMS delivery for OTP flows
