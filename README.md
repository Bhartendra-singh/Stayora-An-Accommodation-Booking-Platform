<div align="center">

# 🏨 Stayora


### A full-stack accommodation booking platform with Guest, Hotel Owner and Admin experiences

[![Live Demo](https://img.shields.io/badge/Live%20Demo-stayora--mocha.vercel.app-black?style=for-the-badge&logo=vercel)](https://stayora-mocha.vercel.app)

![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF)
![Razorpay](https://img.shields.io/badge/Payments-Razorpay-0C2451)

**[🌐 Live Demo](https://stayora-mocha.vercel.app)** · **[🐞 Report a Bug](https://github.com/Bhartendra-singh/Stayora-An-Accommodation-Booking-Platform/issues)**


*Originally built as WanderLust and renamed Stayora. Some UI screens still show the old name.*

</div>

> ⏳ **Heads up:** the backend runs on a free tier and sleeps after 15 minutes of inactivity. The first request after a break can take 30 to 50 seconds. Open the live demo, wait a moment, and refresh.

---

## 📸 Screenshots

### Guest experience

| Home | Featured Destinations |
|---|---|
| ![Home](docs/screenshots/01-home.png) | ![Featured](docs/screenshots/02-featured-destinations.png) |

| Exclusive Offers | Rooms with Filters |
|---|---|
| ![Offers](docs/screenshots/03-offers.png) | ![Rooms](docs/screenshots/04-rooms-filters.png) |

| Room Details | Location on Google Maps |
|---|---|
| ![Room details](docs/screenshots/10-room-details.png) | ![Room map](docs/screenshots/11-room-map.png) |

| Reviews | Wishlist |
|---|---|
| ![Reviews](docs/screenshots/12-room-reviews.png) | ![Wishlist](docs/screenshots/13-wishlist.png) |

### Booking and payment

![My Bookings](docs/screenshots/14-my-bookings.png)

| Razorpay Checkout | Payment Successful |
|---|---|
| ![Checkout](docs/screenshots/15-razorpay-checkout.png) | ![Success](docs/screenshots/16-payment-success.png) |

### Mobile

<img src="docs/screenshots/20-mobile-home.png" alt="Mobile home" width="260">

### Hotel Owner Dashboard

![Owner Dashboard](docs/screenshots/08-owner-dashboard.png)
![Recent Bookings](docs/screenshots/09-owner-recent-bookings.png)

| My Hotel | Offers | Coupons |
|---|---|---|
| ![My Hotel](docs/screenshots/17-owner-my-hotel.png) | ![Offers](docs/screenshots/18-owner-offers.png) | ![Coupons](docs/screenshots/19-owner-coupons.png) |

### Admin Panel

![Admin Overview](docs/screenshots/05-admin-overview.png)

| Manage Hotels | Manage Bookings |
|---|---|
| ![Admin Hotels](docs/screenshots/06-admin-hotels.png) | ![Admin Bookings](docs/screenshots/07-admin-bookings.png) |

---

## 💡 The Idea

Booking a stay usually involves separate tools for each side: guests search on one platform, hotel owners track rooms and bookings somewhere else, and nobody has a single view of the whole system.

Stayora puts all three roles in one platform, so a guest can find and book a room, an owner can list rooms and track revenue, and an admin can oversee users, hotels and bookings.

## ✅ The Solution

A MERN application with **three role-based experiences**, secure authentication, online payments, cloud image hosting and email confirmations. The frontend and backend are deployed separately, the way production apps commonly are.

---

## ✨ Features

### 👤 Guests
- Search rooms by destination
- Filter by room type and price range, and sort by price or newest
- Room details with images, amenities, discount badge and a Google Maps location
- Room reviews and ratings
- Wishlist to save favourite rooms
- Exclusive offers and discount coupons
- Online payment with Razorpay
- Booking confirmation by email
- My Bookings page: pay later with Pay Now, cancel a booking, download an invoice
- Guest testimonials on the home page
- Responsive layout that works on mobile

### 🏨 Hotel Owners
- Register a hotel and edit its details (My Hotel)
- Add rooms with multi-image upload (Cloudinary)
- Dashboard with total bookings, total revenue and a 6-month performance chart
- Recent bookings table with guest name, room, amount and payment status
- Create and manage offers and coupons

### 🛡️ Admins
- Platform overview: total hotels, rooms, users, bookings and revenue
- View and delete hotels
- View all users and change their role (user, hotelOwner, admin) from the UI
- View and cancel bookings

### 🔐 Platform and Security
- Authentication with Clerk (Google and email)
- Clerk webhooks sync users to MongoDB, with a fallback that creates the user on the first authenticated API call
- Role-based route protection on the server (admin-only middleware) and on the client
- Rate limiting and secure HTTP headers (Helmet)
- Upload validation: image types only, 5 MB limit
- CORS restricted to the configured frontend origin
- Secrets kept in environment variables and out of Git history

---

## 🏗️ Architecture

```mermaid
flowchart LR
    U[User's Browser] -->|loads UI| V[Vercel: React + Vite]
    V -->|REST API| R[Render: Node + Express]
    V -->|sign in / sign up| C[Clerk]
    C -->|webhooks: user.created / updated / deleted| R
    R --> M[(MongoDB Atlas)]
    R --> CL[Cloudinary: images]
    R --> RP[Razorpay: payments]
    R --> E[SMTP: booking emails]
```

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Tailwind CSS, Axios |
| Backend | Node.js, Express |
| Database | MongoDB Atlas with Mongoose |
| Auth | Clerk |
| Payments | Razorpay |
| Images | Cloudinary, Multer |
| Email | Nodemailer |
| Security | Helmet, express-rate-limit, CORS |
| Hosting | Vercel (frontend), Render (backend) |

## 🗂️ Data Models

`User` · `Hotel` · `Room` · `Booking` · `Coupon` · `RoomReview` · `Offer` · `Testimonial`

---

## 🚀 Run Locally

**Prerequisites:** Node.js 18+, a MongoDB Atlas cluster, and free accounts on Clerk, Cloudinary and Razorpay (test mode).

```bash
# 1. Clone
git clone https://github.com/Bhartendra-singh/Stayora-An-Accommodation-Booking-Platform.git
cd Stayora-An-Accommodation-Booking-Platform
```

**Backend**
```bash
cd server
npm install
cp .env.example .env     # then fill in your own values
node server.js
```

**Frontend** (in a second terminal)
```bash
cd client
npm install
cp .env.example .env     # then fill in your own values
npm run dev
```

**Optional: seed sample hotels and rooms**
```bash
cd server
node seed.js
```

### Environment Variables

**`server/.env`**

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string, without a database name at the end |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `CLERK_WEBHOOK_SECRET` | Signing secret of the Clerk webhook endpoint |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Cloudinary credentials |
| `SENDER_EMAIL`, `SMTP_USER`, `SMTP_PASS` | Email sending via SMTP |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | Razorpay test keys |
| `CLIENT_URL` | Frontend URL allowed by CORS (for local use `http://localhost:5173`) |

**`client/.env`**

| Variable | Description |
|---|---|
| `VITE_BACKEND_URL` | Backend URL (for local use `http://localhost:3000`) |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `VITE_CURRENCY` | Currency symbol shown in the UI (₹) |
| `VITE_RAZORPAY_KEY_ID` | Razorpay Key ID (public) |

### Clerk Webhook

Point a Clerk webhook to `https://<your-backend>/api/clerk` and subscribe to `user.created`, `user.updated` and `user.deleted`. Use its signing secret as `CLERK_WEBHOOK_SECRET`.

### Roles

New users start as `user`. Listing a hotel makes a user a `hotelOwner`. To create the first admin, set `role` to `"admin"` on that user in the database. After that, admins can change roles from the Admin Panel.

---

## ☁️ Deployment

| Part | Platform | Notes |
|---|---|---|
| Frontend | Vercel | Root directory `client`, framework Vite, SPA rewrite in `vercel.json` |
| Backend | Render | Root directory `server`, start command `node server.js` |
| Database | MongoDB Atlas | Network access opened for the hosted backend |

> This is a demo deployment: payments run in Razorpay **test mode** and authentication uses Clerk **development keys**.

---

## 🔮 Roadmap

- [ ] Clerk production instance with a custom domain
- [ ] Email delivery through a transactional email API
- [ ] Availability calendar to block already booked dates
- [ ] Automated tests for booking and payment flows

---

## 👨‍💻 Author

**Bhartendra Singh**

- GitHub: [@Bhartendra-singh](https://github.com/Bhartendra-singh)
- LinkedIn: [Bhartendra Singh](https://www.linkedin.com/in/bhartendra-singh-17764a282/)


