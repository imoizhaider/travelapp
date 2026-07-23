# Travel Planner REST API Design

## Folder Structure

```text
travelapp/
├── ER_DIAGRAM.md
├── schema.sql
├── package.json
├── .env.example
└── src/
    ├── app.js
    ├── server.js
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── destinations.controller.js
    │   ├── trips.controller.js
    │   ├── itineraries.controller.js
    │   ├── favorites.controller.js
    │   ├── weather.controller.js
    │   ├── budget.controller.js
    │   ├── hotels.controller.js
    │   └── sharing.controller.js
    ├── db/
    │   └── queries.js
    ├── middlewares/
    │   ├── auth.middleware.js
    │   ├── error.middleware.js
    │   └── validate.middleware.js
    ├── routes/
    │   ├── index.js
    │   ├── auth.routes.js
    │   ├── destinations.routes.js
    │   ├── trips.routes.js
    │   ├── itineraries.routes.js
    │   ├── favorites.routes.js
    │   ├── weather.routes.js
    │   ├── budget.routes.js
    │   ├── hotels.routes.js
    │   └── sharing.routes.js
    └── utils/
        ├── apiError.js
        └── asyncHandler.js
```

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Destinations
- `GET /api/destinations`
- `GET /api/destinations/:destinationId`
- `POST /api/destinations`
- `PUT /api/destinations/:destinationId`
- `DELETE /api/destinations/:destinationId`

### Trips
- `GET /api/trips`
- `GET /api/trips/:tripId`
- `POST /api/trips`
- `PUT /api/trips/:tripId`
- `DELETE /api/trips/:tripId`
- `GET /api/trips/:tripId/collaborators`

### Itineraries
- `GET /api/trips/:tripId/itinerary`
- `POST /api/trips/:tripId/itinerary`
- `PUT /api/itineraries/:itineraryItemId`
- `DELETE /api/itineraries/:itineraryItemId`

### Favorites
- `GET /api/me/favorites`
- `POST /api/me/favorites/destinations/:destinationId`
- `DELETE /api/me/favorites/destinations/:destinationId`
- `POST /api/me/favorites/hotels/:hotelId`
- `DELETE /api/me/favorites/hotels/:hotelId`
- `POST /api/me/favorites/attractions/:attractionId`
- `DELETE /api/me/favorites/attractions/:attractionId`

### Weather
- `GET /api/weather/:destinationId?date=YYYY-MM-DD`

### Budget
- `GET /api/trips/:tripId/budget`
- `PUT /api/trips/:tripId/budget`
- `POST /api/trips/:tripId/budget/items`
- `PUT /api/budget/items/:budgetItemId`
- `DELETE /api/budget/items/:budgetItemId`

### Hotels
- `GET /api/destinations/:destinationId/hotels`
- `POST /api/destinations/:destinationId/hotels`
- `PUT /api/hotels/:hotelId`
- `DELETE /api/hotels/:hotelId`
- `POST /api/hotels/:hotelId/mock-bookings`

### Sharing
- `GET /api/trips/:tripId/share-links`
- `POST /api/trips/:tripId/share-links`
- `GET /api/trips/:tripId/collaborators`
- `POST /api/trips/:tripId/collaborators`
- `PATCH /api/trips/:tripId/collaborators/:userId`

## Controllers

- `auth.controller.js` handles registration, login, and profile retrieval with JWT issuance.
- `destinations.controller.js` handles destination CRUD.
- `trips.controller.js` handles trip CRUD plus collaborator listing.
- `itineraries.controller.js` handles itinerary CRUD and edit-access enforcement.
- `favorites.controller.js` handles saved destinations, hotels, and attractions.
- `weather.controller.js` returns destination forecast data.
- `budget.controller.js` handles budget summaries and budget item CRUD.
- `hotels.controller.js` handles mock hotel CRUD and mock booking creation.
- `sharing.controller.js` handles share links and collaborator invitations.

## Routes

- `src/routes/index.js` composes all feature routers under `/api`.
- Each route module validates input with `zod` before calling its controller.
- Protected routes use JWT authentication; admin-only destination management is restricted by role.

## Database Queries

- `src/db/queries.js` centralizes SQL by domain to keep controllers thin.
- `authQueries` supports user lookup, registration, and profile reads.
- `destinationQueries` supports destination CRUD.
- `tripQueries` supports trip CRUD, accessible trip listing, and collaborator lookups.
- `itineraryQueries` supports itinerary CRUD.
- `favoritesQueries` supports favorite destinations, hotels, and attractions.
- `weatherQueries` returns forecast rows by destination and optional date.
- `budgetQueries` supports budget summary upsert and budget item CRUD.
- `hotelQueries` supports hotel CRUD and mock booking creation.
- `sharingQueries` supports share links and collaborator management.

## Validation And Error Handling

- JWT auth is enforced by `auth.middleware.js`.
- Input validation is handled by `validate.middleware.js` using `zod` schemas.
- Database and application errors are normalized by `error.middleware.js`.
- `asyncHandler.js` removes repetitive `try/catch` blocks from controllers.