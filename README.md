# NodeService-Pro

A professional Node.js REST API for managing clients, quotes, invoices, and services, with secure authentication, email notifications, and PDF generation.

## Features

- **User Management**: Registration, login, password reset, account deletion
- **Client Management**: CRUD operations, per-user uniqueness
- **Quote & Invoice Management**: Create, list, update, PDF generation
- **Service Management**: CRUD for prestations
- **Secure Authentication**: JWT-based, password hashing, validation
- **Email Notifications**: Centralized HTML templates for all emails (quote, invoice, reminder, verification, reset, payment)
- **PDF Generation**: Professional PDF documents for quotes and invoices
- **Reminders**: Automated invoice reminders with cron jobs
- **Validation**: Joi-based request validation
- **Extensible Architecture**: MVC, services, repositories, middlewares

## Tech Stack

- Node.js, Express
- MongoDB & Mongoose
- JWT, bcryptjs
- Joi
- Nodemailer
- PDFKit

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/NodeService-Pro.git
   cd NodeService-Pro
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure environment variables**
   Create a `.env` file with:
   ```env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   BREVO_USER=your_brevo_smtp_user
   BREVO_PASS=your_brevo_smtp_pass
   PROD_EMAIL=your_sender_email
   NODE_ENV=production
   ```
4. **Start the server**
   ```bash
   npm start
   ```

## API Overview

- **Authentication**
  - `POST /api/users/register` — Register a new user
  - `POST /api/users/login` — Login
  - `POST /api/users/forgot-password` — Request password reset
  - `POST /api/users/reset-password` — Reset password
- **Clients**
  - `GET /api/clients` — List clients
  - `POST /api/clients` — Create client
  - `PUT /api/clients/:id` — Update client
  - `DELETE /api/clients/:id` — Delete client
- **Quotes**
  - `GET /api/devis` — List quotes
  - `POST /api/devis` — Create quote
- **Invoices**
  - `GET /api/invoices` — List invoices
  - `POST /api/invoices` — Create invoice
  - `POST /api/invoices/:id/pay` — Pay invoice
- **Services (Prestations)**
  - `GET /api/prestations` — List prestations
  - `POST /api/prestations` — Create prestation

## Email Templates

All emails use centralized HTML templates located in `/src/templates/`. You can customize these for branding and content.

## PDF Generation

Quotes and invoices are generated as professional PDFs and attached to emails automatically.

## Security

- Passwords are hashed
- JWT authentication for all protected routes
- Per-user data isolation
- Password reset links are limited to one active attempt per user

## Contribution

Feel free to fork, open issues, or submit pull requests!

## License

MIT
