# Ovarc Bookstore API

Express + Sequelize API for managing stores, authors, books, and inventory uploads.

## Prerequisites
- Node.js 18+ and npm
- PostgreSQL
- Docker + Docker Compose (optional, for containerized setup)

## Setup
1) Install dependencies
```bash
npm install
```
2) Create a `.env` file in the project root (same folder as `server.js`):
```bash
PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_NAME=bookstore
DB_USER=postgres
DB_PASSWORD=mysecretpassword
```
3) Ensure PostgreSQL is running and the database named in `DB_NAME` exists (Sequelize will create/alter tables on start).
 
4) (Optional) Place store logos under `uploads/logos/` if you plan to reference local paths in CSV imports.

## Run
- Development (auto-restart):
```bash
npm run dev
```
- Direct start:
```bash
node server.js
```
The API listens on `http://localhost:${PORT}` (default 3000).

## Health Check
- `GET /health` returns service status and environment.

## Endpoints
- `POST /api/inventory/upload` — upload an inventory CSV via `multipart/form-data` field `file`.
- `GET /api/store/:id/download-report` — download a PDF report for a store.

## CSV Import Format
- Required headers (case-insensitive, snake_case recommended): `store_name`, `book_name`, `author_name`, `price`, `pages`
- Optional headers:
	- `store_address` — defaults to `N/A` if omitted
	- `logo` or `logo_url` —
		- HTTP(S) URL: downloaded and saved under `uploads/logos/store-<id>.*`
		- Local path: reference an existing file such as `uploads/logos/favicon.ico`

Example:
```
store_name,store_address,book_name,author_name,price,pages,logo
Bookstore A,123 Main St,Book 1,Author X,19.99,250,uploads/logos/favicon.ivo
Bookstore B,456 Market St,Book 2,Author Y,9.99,150,uploads/logos/favicon.ivo
```

## Database Models
- Authors, Books, Stores with a many-to-many relationship via StoreBook (defined in `src/models`).

## Project Scripts
- `npm run dev` — starts the api with `nodemon` watching for changes.
 
## Docker Compose
1) Ensure Docker is running.
2) Build and start services:
```bash
docker compose up --build -d
```
3) Inspect logs to ensure they are running(app + database):
```bash
docker compose logs -f
```
4) The API will be available at http://localhost:3000 and PostgreSQL at localhost:5432 (user/password from the compose file).
5) To stop services:
```bash
docker compose down
```
