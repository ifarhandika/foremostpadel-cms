# Foremost Padel CMS - Frontend (React + Vite + Tailwind + AntD)

## Quick start

1. Copy files to your machine or extract the ZIP.
2. Install dependencies:
   ```
   npm install
   ```
3. Run dev server:
   ```
   npm run dev
   ```
4. Configure `.env` (copy from .env.example):
   ```
   VITE_API_BASE=https://api.foremostpadel.com
   ```

## Build for production
```
npm run build
```
Upload the `dist` contents to your cPanel `public_html` (or subdomain), include the provided `.htaccess` to ensure SPA routing works.

Notes:
- This frontend expects the backend to use cookie-based auth (`withCredentials: true`).
- Courts page supports image upload and preview. The backend must accept `multipart/form-data`.
