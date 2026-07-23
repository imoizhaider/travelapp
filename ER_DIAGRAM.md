# Travel Planner PostgreSQL ER Diagram

```text
roles 1---< users 1---1 user_profiles
                    └---1 user_travel_preferences

users 1---< trips >---1 destinations
trips 1---< trip_collaborators >---1 users
trips 1---< trip_share_links
trips 1---1 budget_estimates 1---< budget_items >---1 budget_categories
trips 1---< itinerary_items >---1 itinerary_categories
itinerary_items >---0..1 destinations

destinations 1---< destination_attractions
destinations 1---< weather_forecasts
destinations 1---< hotel_listings 1---< hotel_amenity_map >---1 hotel_amenities

users 1---< favorite_destinations >---1 destinations
users 1---< favorite_attractions >---1 destination_attractions
users 1---< favorite_hotels >---1 hotel_listings

trips 1---< mock_hotel_bookings >---1 hotel_listings
users 1---< mock_hotel_bookings
```

## Relationship Explanation

- `roles` defines the global application roles and each `users` row references exactly one role.
- `users` is the core parent table for all account-specific data, including profiles, preferences, favorites, collaborators, shares, and bookings.
- `destinations` is the master location table. Trips point to one destination, while attractions, weather forecasts, and hotel listings extend destination data in separate normalized child tables.
- `trips` is the central planning entity. It owns itinerary items, budget estimates, collaborator assignments, share links, and mock hotel bookings.
- `itinerary_items` stores one row per scheduled activity and references lookup data in `itinerary_categories`. It can optionally reference a destination for location-level traceability.
- `budget_estimates` gives each trip a single budget summary, while `budget_items` captures the category-level breakdown for lodging, food, transport, activities, and other costs.
- `hotel_listings` stores reusable mock hotel data by destination. `hotel_amenities` and `hotel_amenity_map` normalize the many-to-many relationship between hotels and amenities.
- Favorites are split into `favorite_destinations`, `favorite_attractions`, and `favorite_hotels` so each saved entity has a real foreign key and no polymorphic ambiguity.
- Trip sharing is modeled with two tables: `trip_collaborators` for invited users and `trip_share_links` for link-based sharing. Both support `view` and `edit` access.
- `mock_hotel_bookings` records simulated booking actions only; it links a trip, a hotel, and the user who created the mock booking.

## Normalization Notes

- Repeating groups are removed by using child tables for itinerary items, budget items, amenities, favorites, and collaborations.
- Lookup tables are used where values repeat frequently, such as roles, itinerary categories, and budget categories.
- Many-to-many relationships are resolved through junction tables like `hotel_amenity_map` and the favorites tables.
- Constraint-driven design ensures the model rejects invalid dates, negative amounts, duplicate favorites, and invalid share permissions.