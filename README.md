# Shubham Portfolio API

Express + MongoDB backend for the Angular portfolio.

## Local Setup

1. Copy `.env.example` to `.env`.
2. Start MongoDB locally or with the root `docker-compose.yml`.
3. Set SMTP values so contact form submissions are emailed to `shubh.karkhile@gmail.com`.
4. Run `npm install`.
5. Run `npm run seed`.
6. Run `npm run dev`.

## Main Endpoints

- `GET /api/health`
- `GET /api/portfolio`
- `GET /api/projects`
- `GET /api/projects/:slug`
- `POST /api/enquiries`
- `POST /api/auth/login`
- `GET /api/admin/enquiries`
- `POST /api/admin/projects`
- `PATCH /api/admin/projects/:id`
- `DELETE /api/admin/projects/:id`

## Email Notes

Gmail can work for testing with an app password, but a production portfolio should use a transactional provider such as Postmark, SendGrid, Mailgun, or Amazon SES for better deliverability.
