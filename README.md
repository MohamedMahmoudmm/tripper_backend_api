**Project Overview**

This repository contains the backend API for the Tripper application (Express + MongoDB). The README below documents the repository layout, where code and files live, and quick run / next-step suggestions.

**Folder Structure**

- **Root files**: `app.js`, `server.js`, `dbConnection.js`, `package.json`
	- `app.js`: Express application, middleware registration, and global configuration.
	- `server.js`: Loads `app.js` and starts the HTTP server.
	- `dbConnection.js`: MongoDB connection setup using `MONGO_URI`.
	- `package.json`: Project dependencies and npm scripts.
- **`config/`**: Third-party and environment integrations
	- `cloudinary.js`: Cloudinary client configuration (reads `CLOUDINARY_*` env vars).
- **`controller/`**: Route handlers and business logic
	- Example files: `user.controller.js`, `place.controller.js`, `hotel.controller.js`, `payment.controller.js`, `reservation.controller.js`, `messageController.js`, `conversationController.js`, `Review.js`, etc.
- **`route/`**: API route definitions
	- Each file maps HTTP routes to controller functions (e.g., `user.route.js`, `place.route.js`).
- **`models/`**: Database schemas / Mongoose models
	- Domain models such as `user_model.js`, `place_model.js`, `hotel_model.js`, `reservation_model.js`, `review_model.js`, `message_model.js`, `conversation_model.js`, etc.
- **`middlewares/`**: Express middlewares used across routes
	- Auth & role checks: `is_Auth.js`, `is_Admin.js`, `is_Host.js`.
	- Validation and upload middleware: `isEmailExists.js`, `uploadProfileImage.js`, `placeUpload.js`, `hotelUpload.js`, `experianceUpload.js`.
	- Error handling: `errorHandler.js`.
- **`email/`**: Email sending utilities and templates
	- `email.js` and `emailTemplate.js` for transactional emails.
- **`Validators/`**: Request validation helpers
	- `signupValidations.js`, `addPlace.js`, `handleValidationErrors.js`.

**Where files and data are stored**

- Uploaded images: Stored in Cloudinary (see `config/cloudinary.js`). Upload middlewares in `middlewares/` use `multer-storage-cloudinary` with folders such as `profile_images`, `tripper_places`, etc.
- Persistent data: Stored in MongoDB. Connection is initialized in `dbConnection.js` using the `MONGO_URI` environment variable.

**Quick Start (local)**

1. Copy environment variables to `.env` (create `.env` in project root):

	- `MONGO_URI` — MongoDB connection string
	- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
	- Any JWT / email / payment keys used by the app

2. Install & run:

```powershell
npm install
npm run dev
```

(Adjust `npm` script names according to `package.json`.)

**Next steps / Suggestions**

- Add an `.env.example` listing required environment variables.
- Add a `Scripts` section in this README showing `start`, `dev`, and `test` commands from `package.json`.
- Document main routes (or add an OpenAPI / Swagger spec) for easier onboarding.

If you want, I can also add an `.env.example` and a short `Scripts` section now.
