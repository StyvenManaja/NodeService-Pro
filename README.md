# NodeService-Pro

A professional Node.js REST API for managing clients, quotes, invoices, and services, with secure authentication, email notifications, and PDF generation.

## Features

- **User Management**: Registration, login, password reset, account deletion
- **Client Management**: CRUD operations, per-user uniqueness
- **Quote & Invoice Management**: Create, list, update, PDF generation
- **Service Management**: CRUD for prestations
- **Secure Authentication**: JWT-based, password hashing, validation
- **Email Notifications**: All emails (quotes, invoices, reminders, verification, reset, payment) use centralized HTML templates in `/src/templates/` and support dynamic variable injection. Attachments (PDFs) are sent as buffers for reliability.
- **PDF Generation**: Professional PDF documents for quotes and invoices, generated from HTML/CSS templates using Puppeteer (not PDFKit). All data is injected dynamically for modern, branded output.
- **Reminders**: Automated invoice reminders with cron jobs
- **Validation**: Joi-based request validation
- **Extensible Architecture**: MVC, services, repositories, middlewares

- **Payment & Subscription (LemonSqueezy)**: Users can subscribe, cancel, resume, and expire their subscription. Webhooks ensure real-time sync of subscription status. Only one active subscription per user is allowed. Secure signature verification for all webhooks.

## Payment & Subscription

- `POST /api/subscriptions/checkout` — Initiate LemonSqueezy checkout for subscription
- Webhook endpoint `/api/webhook/lemonsqueezy` — Handles subscription events (created, cancelled, resumed, expired, etc.)


## Tech Stack

- Node.js, Express
- MongoDB & Mongoose
- JWT, bcryptjs
- Joi
- Nodemailer
- Puppeteer (HTML-to-PDF)

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

## Customizing Email & PDF Templates

- All email and PDF templates are in `/src/templates/` (e.g. `devis.html`, `invoice.html`, `devisPdf.html`, `invoicePdf.html`, etc.).
- Use `{{variable}}` placeholders in templates; variables are injected from the service layer.
- To add new variables, update the relevant service (e.g. `devis.service.js`) to pass them in `templateVars`.
- For PDF templates, all data is injected before rendering with Puppeteer.

## Attachments & Email Sending

- PDF attachments are sent as buffers (not file paths) for reliability and performance.
- The mail sender (`src/utils/mail.sender.js`) supports both buffer and path-based attachments, but buffer is preferred.
- All mail sending requires the following environment variables:
  - `BREVO_USER`, `BREVO_PASS`, `PROD_EMAIL`

## Troubleshooting

- If emails with PDF attachments fail:
  - Ensure the PDF buffer is generated and passed to the mail sender.
  - Check the `[MAIL] attachments:` log in the console for attachment details.
  - Make sure all required environment variables are set.
- If a template variable is blank in an email or PDF, check that the service passes it in `templateVars` or the PDF data object.

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
