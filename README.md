<div align="center">

# 🍕 PizzaCraft

**A full-stack pizza delivery application with custom pizza builder, real-time order tracking, and integrated payment processing.**

[![MIT License](https://img.shields.io/badge/License-MIT-e94560?style=for-the-badge)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Razorpay](https://img.shields.io/badge/Razorpay-Integrated-0C2451?style=for-the-badge&logo=razorpay&logoColor=white)](https://razorpay.com)

<br />

[Features](#-features) · [Tech Stack](#-tech-stack) · [Quick Start](#-quick-start) · [API Reference](#-api-reference) · [Contributing](#-contributing) · [License](#-license)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔐 Authentication & Security
- JWT-based auth with role separation (User / Admin)
- Email verification on registration
- Forgot & reset password flow
- bcrypt password hashing (12 rounds)
- Protected API routes with middleware

</td>
<td width="50%">

### 🍕 Custom Pizza Builder
- 5-step interactive wizard
- Choose from 5 pizza bases
- Select from 5 sauce options
- Pick your cheese type
- Add veggies & meat toppings
- Live price calculation

</td>
</tr>
<tr>
<td width="50%">

### 💳 Payment Integration
- Razorpay checkout (test mode ready)
- Server-side order creation
- Payment signature verification (HMAC SHA256)
- Order confirmation on successful payment
- Test card details provided in UI

</td>
<td width="50%">

### 📦 Inventory Management
- Track stock across 5 categories
- Inline editing for quantity, price & threshold
- Low-stock visual indicators
- Auto stock deduction after orders
- Email alerts when stock falls below threshold

</td>
</tr>
<tr>
<td width="50%">

### 🚗 Order Tracking
- 4-stage status pipeline:
  `Order Received → In the Kitchen → Sent to Delivery → Delivered`
- Visual progress bar on user dashboard
- Auto-refresh every 30 seconds
- Admin status update via dropdown

</td>
<td width="50%">

### 📧 Email Notifications
- Styled HTML email templates
- Verification emails on registration
- Password reset links
- Low-stock alerts to admin
- Configurable SMTP (Mailtrap / Gmail)

</td>
</tr>
</table>

---

## 🛠 Tech Stack

| Layer       | Technology                                    |
|-------------|-----------------------------------------------|
| **Frontend**  | React 19, Vite, React Router, Axios, React Toastify |
| **Backend**   | Node.js, Express.js                          |
| **Database**  | MongoDB, Mongoose ODM                        |
| **Auth**      | JSON Web Tokens, bcryptjs                    |
| **Payments**  | Razorpay SDK (Test Mode)                     |
| **Email**     | Nodemailer                                   |
| **Styling**   | Custom CSS with design tokens, glassmorphism  |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** — [Local install](https://www.mongodb.com/docs/manual/installation/) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier)
- **Razorpay** — [Create a free account](https://razorpay.com) for test mode API keys

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/OIBSIP_PIZZA-DELIVERY-APP.git
cd OIBSIP_PIZZA-DELIVERY-APP
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create and configure the `.env` file (see [Environment Variables](#-environment-variables) below).

```bash
npm run dev
```

### 3. Seed the Database

Run this once to populate the inventory with 24 default ingredients:

```bash
curl -X POST http://localhost:5000/api/inventory/seed
```

### 4. Setup Frontend

```bash
cd client
npm install
npm run dev
```

### 5. Open the App

Navigate to **[http://localhost:5173](http://localhost:5173)** and register a new account to get started.

---

## 🔑 Environment Variables

Create a `server/.env` file with the following:

| Variable               | Description                          | Example                                      |
|------------------------|--------------------------------------|----------------------------------------------|
| `PORT`                 | Server port                          | `5000`                                       |
| `MONGO_URI`            | MongoDB connection string            | `mongodb://localhost:27017/pizza-delivery`    |
| `JWT_SECRET`           | Secret key for JWT signing           | `your_super_secret_key_here`                 |
| `EMAIL_HOST`           | SMTP host                            | `smtp.mailtrap.io`                           |
| `EMAIL_PORT`           | SMTP port                            | `2525`                                       |
| `EMAIL_USER`           | SMTP username                        | `your_mailtrap_user`                         |
| `EMAIL_PASS`           | SMTP password                        | `your_mailtrap_pass`                         |
| `RAZORPAY_KEY_ID`      | Razorpay test key ID                 | `rzp_test_xxxxxxxxxxxxx`                     |
| `RAZORPAY_KEY_SECRET`  | Razorpay test key secret             | `xxxxxxxxxxxxxxxxxxxxxxxx`                   |
| `CLIENT_URL`           | Frontend URL (for email links)       | `http://localhost:5173`                       |
| `ADMIN_EMAIL`          | Email for low-stock alerts           | `admin@example.com`                          |

> ⚠️ **Never commit your `.env` file.** See [SECURITY.md](SECURITY.md) for details.

---

## 📡 API Reference

### Authentication

| Method | Endpoint                          | Auth | Description                 |
|--------|-----------------------------------|------|-----------------------------|
| POST   | `/api/auth/register`              | ✗    | Register a new user         |
| POST   | `/api/auth/login`                 | ✗    | Login and receive JWT       |
| GET    | `/api/auth/verify/:token`         | ✗    | Verify email address        |
| POST   | `/api/auth/forgot-password`       | ✗    | Send password reset email   |
| POST   | `/api/auth/reset-password/:token` | ✗    | Reset password with token   |
| GET    | `/api/auth/me`                    | ✓    | Get current user profile    |

### Inventory

| Method | Endpoint                     | Auth  | Description                    |
|--------|------------------------------|-------|--------------------------------|
| GET    | `/api/inventory/available`   | User  | Get available items            |
| GET    | `/api/inventory`             | Admin | Get all items                  |
| PUT    | `/api/inventory/:id`         | Admin | Update item stock/price        |
| POST   | `/api/inventory/seed`        | ✗     | Seed default inventory         |
| GET    | `/api/inventory/stats`       | Admin | Get inventory statistics       |

### Orders

| Method | Endpoint                     | Auth  | Description                    |
|--------|------------------------------|-------|--------------------------------|
| POST   | `/api/orders`                | User  | Create order after payment     |
| GET    | `/api/orders/my-orders`      | User  | Get user's order history       |
| GET    | `/api/orders`                | Admin | Get all orders                 |
| GET    | `/api/orders/stats`          | Admin | Get order statistics           |
| PUT    | `/api/orders/:id/status`     | Admin | Update order status            |

### Payment

| Method | Endpoint                     | Auth | Description                    |
|--------|------------------------------|------|--------------------------------|
| POST   | `/api/payment/create-order`  | ✓    | Create Razorpay payment order  |
| POST   | `/api/payment/verify`        | ✓    | Verify payment signature       |

---

## 🧪 Testing

### Razorpay Test Card

| Field  | Value                  |
|--------|------------------------|
| Card   | `4111 1111 1111 1111`  |
| Expiry | Any future date        |
| CVV    | Any 3 digits           |
| OTP    | Any valid OTP          |

### Email Testing

Use [Mailtrap](https://mailtrap.io) (free tier) to catch verification and reset emails during development without sending real mail.

---

## 📁 Project Structure

```
├── server/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Auth handlers
│   │   ├── inventoryController.js# Inventory CRUD + seed
│   │   ├── orderController.js    # Order management
│   │   └── paymentController.js  # Razorpay integration
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   └── adminAuth.js          # Admin role guard
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Inventory.js          # Inventory schema
│   │   └── Order.js              # Order schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── inventoryRoutes.js
│   │   ├── orderRoutes.js
│   │   └── paymentRoutes.js
│   ├── utils/
│   │   ├── sendEmail.js          # Nodemailer + templates
│   │   └── stockChecker.js       # Stock deduction + alerts
│   ├── .env                      # Environment config
│   ├── package.json
│   └── server.js                 # Express entry point
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js          # Axios instance + interceptors
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Dynamic navigation
│   │   │   └── ProtectedRoute.jsx# Auth + role guard
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global auth state
│   │   ├── pages/
│   │   │   ├── auth/             # Login, Register, Verify, Reset
│   │   │   ├── user/             # Dashboard, Builder, Checkout, Orders
│   │   │   └── admin/            # Dashboard, Inventory, Order Mgmt
│   │   ├── App.jsx               # Router + app shell
│   │   ├── index.css             # Design system
│   │   └── main.jsx              # React entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── LICENSE
├── SECURITY.md
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** your feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'feat: add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Guidelines

- Follow existing code style and patterns
- Test your changes before submitting
- Write descriptive commit messages using [Conventional Commits](https://www.conventionalcommits.org/)
- Update documentation if you change APIs or add features

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by [Shaurya Tiwari](https://github.com/shauryatiwari)**

OIBSIP Task · Pizza Delivery Application

</div>
