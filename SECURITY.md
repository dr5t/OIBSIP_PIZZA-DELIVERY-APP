# Security Policy

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue in PizzaCraft, please report it responsibly.

### How to Report

1. **Do NOT open a public GitHub issue** for security vulnerabilities.
2. Email your findings to **shauryatiwari@proton.me** with the subject line: `[SECURITY] PizzaCraft Vulnerability Report`.
3. Include the following in your report:
   - A detailed description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact assessment
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: You will receive an acknowledgment within **48 hours**.
- **Assessment**: We will investigate and validate the vulnerability within **5 business days**.
- **Resolution**: A patch will be developed and released as a priority fix.
- **Disclosure**: We will coordinate with you on public disclosure timing.

### Scope

The following areas are in scope for security reports:

| Area                    | In Scope |
|-------------------------|----------|
| Authentication & JWT    | ✅        |
| Password hashing        | ✅        |
| API authorization       | ✅        |
| Payment flow (Razorpay) | ✅        |
| Database injection      | ✅        |
| XSS / CSRF              | ✅        |
| Dependency vulnerabilities | ✅     |
| Rate limiting           | ✅        |

### Out of Scope

- Vulnerabilities in third-party services (Razorpay, MongoDB Atlas, Mailtrap)
- Issues that require physical access to the server
- Social engineering attacks
- Denial of Service (DoS) attacks on development environments

## Security Best Practices Implemented

### Authentication
- Passwords hashed with **bcrypt** (12 salt rounds)
- JWT tokens with configurable expiration
- Email verification required before login
- Secure password reset with time-limited tokens

### Authorization
- Role-based access control (User / Admin)
- JWT middleware on all protected routes
- Admin-only middleware for inventory and order management endpoints

### Data Protection
- Input validation on all API endpoints via Mongoose schemas
- Environment variables for all secrets (never hardcoded)
- CORS restricted to configured client origin

### Payment Security
- Razorpay payment signature verification using HMAC SHA256
- Server-side order creation (amount cannot be tampered client-side)
- Payment verification before order confirmation

### Dependencies
- Regular dependency audits recommended via `npm audit`
- No deprecated packages in use

## Environment Variables

Never commit your `.env` file. The following secrets must be kept secure:

| Variable              | Sensitivity |
|-----------------------|-------------|
| `JWT_SECRET`          | 🔴 Critical |
| `RAZORPAY_KEY_SECRET` | 🔴 Critical |
| `EMAIL_PASS`          | 🔴 Critical |
| `MONGO_URI`           | 🟡 High     |
| `RAZORPAY_KEY_ID`     | 🟡 High     |
| `EMAIL_USER`          | 🟡 High     |

---

Thank you for helping keep PizzaCraft and its users safe.
