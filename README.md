Smart Anonymous Feedback & Insight System
 Kumar's Kitchen, Bengaluru

A QR-based anonymous restaurant feedback platform that bridges the communication gap between customers and the restaurant owner — without any confrontation.


Live Demo
Customer App:
Admin Dashboard:


The Problem
Customers feel socially uncomfortable complaining directly to the owner. When they do complain, it leads to arguments. The owner never gets honest feedback, so problems never get fixed.

The Solution
Customers scan a QR code on their table, select a dish, give a star rating, and submit anonymous feedback. The owner sees real-time insights on a dashboard — no confrontation needed.


 Features
- QR code per table — opens instantly in phone browser
- 100% anonymous — no login, no personal data collected
- Star rating (1–5) per dish
- AI-powered sentiment analysis (Positive / Neutral / Negative)
- Smart email alerts when repeated complaints are detected
- Firebase push notifications for instant owner alerts
- Admin dashboard with charts, trends, best/worst dish tracking
- Customer won-back tracking — detects when unhappy customers return happy
- Multi-language support — English, Hindi, Kannada
- Voice input in all three languages
- Export feedback to CSV
- Owner can mark feedback as Reviewing / Resolved
- Discount coupon shown after feedback submission
- Chef/Owner profile page


Tech Stack

**Frontend:** React.js, Chart.js, i18next, QRCode.react, Web Speech API, Canvas Confetti

**Backend:** Node.js, Express.js, Sentiment.js, Nodemailer, Multer, Firebase Admin SDK

**Database:** MongoDB

**Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas (database)


Project Structure
kumars-kitchen-feedback/
├── backend/
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API routes
│   ├── utils/         # Mailer, Firebase, alerts
│   └── server.js      # Express server
├── frontend/
│   ├── public/        # Static files
│   └── src/
│       ├── pages/     # All React pages
│       ├── components/# Reusable components
│       └── utils/     # Helper functions
└── README.md



Project built for Kumar's Kitchen, Bengaluru
