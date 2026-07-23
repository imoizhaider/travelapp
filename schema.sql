-- PostgreSQL schema for the Travel Planner application

CREATE TABLE roles (
    role_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    role_description TEXT
);

CREATE TABLE users (
    user_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    role_id BIGINT NOT NULL REFERENCES roles(role_id) ON DELETE RESTRICT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_profiles (
    user_id BIGINT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    timezone VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_travel_preferences (
    user_id BIGINT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    home_country VARCHAR(100),
    preferred_currency CHAR(3),
    preferred_travel_style VARCHAR(50),
    preferred_budget_level VARCHAR(30),
    preferred_season VARCHAR(30),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_preferred_currency_len CHECK (preferred_currency IS NULL OR CHAR_LENGTH(preferred_currency) = 3)
);

CREATE TABLE destinations (
    destination_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    destination_name VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    summary TEXT,
    average_cost_level VARCHAR(30),
    popularity_score INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_destination_popularity CHECK (popularity_score IS NULL OR popularity_score BETWEEN 1 AND 100)
);

CREATE TABLE destination_attractions (
    attraction_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    destination_id BIGINT NOT NULL REFERENCES destinations(destination_id) ON DELETE CASCADE,
    attraction_name VARCHAR(200) NOT NULL,
    attraction_description TEXT,
    estimated_visit_cost NUMERIC(12,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_attraction_visit_cost CHECK (estimated_visit_cost IS NULL OR estimated_visit_cost >= 0)
);

CREATE TABLE trips (
    trip_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    owner_user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    destination_id BIGINT NOT NULL REFERENCES destinations(destination_id) ON DELETE RESTRICT,
    trip_title VARCHAR(200) NOT NULL,
    trip_purpose VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    traveler_count INTEGER NOT NULL DEFAULT 1,
    trip_status VARCHAR(30) NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_trip_dates CHECK (end_date >= start_date),
    CONSTRAINT chk_traveler_count CHECK (traveler_count > 0)
);

CREATE TABLE trip_collaborators (
    trip_id BIGINT NOT NULL REFERENCES trips(trip_id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    invited_by_user_id BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
    access_level VARCHAR(20) NOT NULL,
    collaborator_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    PRIMARY KEY (trip_id, user_id),
    CONSTRAINT chk_trip_collab_access_level CHECK (access_level IN ('view', 'edit')),
    CONSTRAINT chk_trip_collab_status CHECK (collaborator_status IN ('pending', 'accepted', 'declined', 'revoked'))
);

CREATE TABLE trip_share_links (
    share_link_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    trip_id BIGINT NOT NULL REFERENCES trips(trip_id) ON DELETE CASCADE,
    created_by_user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    share_token UUID NOT NULL UNIQUE,
    access_level VARCHAR(20) NOT NULL,
    expires_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_share_link_access_level CHECK (access_level IN ('view', 'edit'))
);

CREATE TABLE itinerary_categories (
    category_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE itinerary_items (
    itinerary_item_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    trip_id BIGINT NOT NULL REFERENCES trips(trip_id) ON DELETE CASCADE,
    category_id BIGINT NOT NULL REFERENCES itinerary_categories(category_id) ON DELETE RESTRICT,
    destination_id BIGINT REFERENCES destinations(destination_id) ON DELETE SET NULL,
    item_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    item_title VARCHAR(200) NOT NULL,
    location_name VARCHAR(200),
    notes TEXT,
    estimated_cost NUMERIC(12,2),
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_itinerary_cost CHECK (estimated_cost IS NULL OR estimated_cost >= 0),
    CONSTRAINT chk_itinerary_times CHECK (end_time IS NULL OR start_time IS NULL OR end_time >= start_time)
);

CREATE TABLE favorite_destinations (
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    destination_id BIGINT NOT NULL REFERENCES destinations(destination_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, destination_id)
);

CREATE TABLE favorite_attractions (
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    attraction_id BIGINT NOT NULL REFERENCES destination_attractions(attraction_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, attraction_id)
);

CREATE TABLE hotel_listings (
    hotel_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    destination_id BIGINT NOT NULL REFERENCES destinations(destination_id) ON DELETE CASCADE,
    hotel_name VARCHAR(200) NOT NULL,
    hotel_description TEXT,
    room_type VARCHAR(100) NOT NULL,
    nightly_rate NUMERIC(12,2) NOT NULL,
    currency_code CHAR(3) NOT NULL,
    star_rating NUMERIC(2,1),
    is_mock BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_hotel_rate CHECK (nightly_rate >= 0),
    CONSTRAINT chk_currency_code_len CHECK (CHAR_LENGTH(currency_code) = 3),
    CONSTRAINT chk_star_rating CHECK (star_rating IS NULL OR star_rating BETWEEN 1 AND 5)
);

CREATE TABLE hotel_amenities (
    amenity_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    amenity_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE hotel_amenity_map (
    hotel_id BIGINT NOT NULL REFERENCES hotel_listings(hotel_id) ON DELETE CASCADE,
    amenity_id BIGINT NOT NULL REFERENCES hotel_amenities(amenity_id) ON DELETE CASCADE,
    PRIMARY KEY (hotel_id, amenity_id)
);

CREATE TABLE favorite_hotels (
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    hotel_id BIGINT NOT NULL REFERENCES hotel_listings(hotel_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, hotel_id)
);

CREATE TABLE weather_forecasts (
    weather_forecast_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    destination_id BIGINT NOT NULL REFERENCES destinations(destination_id) ON DELETE CASCADE,
    forecast_date DATE NOT NULL,
    temperature_high_c NUMERIC(5,2),
    temperature_low_c NUMERIC(5,2),
    weather_condition VARCHAR(100) NOT NULL,
    precipitation_chance INTEGER,
    source_name VARCHAR(100),
    fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (destination_id, forecast_date),
    CONSTRAINT chk_precipitation_chance CHECK (precipitation_chance IS NULL OR precipitation_chance BETWEEN 0 AND 100),
    CONSTRAINT chk_temperature_range CHECK (
        temperature_high_c IS NULL OR temperature_low_c IS NULL OR temperature_high_c >= temperature_low_c
    )
);

CREATE TABLE budget_estimates (
    budget_estimate_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    trip_id BIGINT NOT NULL UNIQUE REFERENCES trips(trip_id) ON DELETE CASCADE,
    currency_code CHAR(3) NOT NULL,
    total_estimated NUMERIC(12,2) NOT NULL DEFAULT 0,
    contingency_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_budget_currency_len CHECK (CHAR_LENGTH(currency_code) = 3),
    CONSTRAINT chk_budget_amounts CHECK (total_estimated >= 0 AND contingency_amount >= 0)
);

CREATE TABLE budget_categories (
    budget_category_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE budget_items (
    budget_item_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    budget_estimate_id BIGINT NOT NULL REFERENCES budget_estimates(budget_estimate_id) ON DELETE CASCADE,
    budget_category_id BIGINT NOT NULL REFERENCES budget_categories(budget_category_id) ON DELETE RESTRICT,
    item_description VARCHAR(200) NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    planned_date DATE,
    sort_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_budget_item_amount CHECK (amount >= 0)
);

CREATE TABLE mock_hotel_bookings (
    mock_booking_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    trip_id BIGINT NOT NULL REFERENCES trips(trip_id) ON DELETE CASCADE,
    hotel_id BIGINT NOT NULL REFERENCES hotel_listings(hotel_id) ON DELETE RESTRICT,
    booked_by_user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    guests_count INTEGER NOT NULL DEFAULT 1,
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    booking_status VARCHAR(20) NOT NULL DEFAULT 'mocked',
    confirmation_code VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_booking_dates CHECK (check_out_date > check_in_date),
    CONSTRAINT chk_booking_guests CHECK (guests_count > 0),
    CONSTRAINT chk_booking_amount CHECK (total_amount >= 0)
);

CREATE INDEX idx_destinations_country_city ON destinations (country, city);
CREATE INDEX idx_trips_owner_user_id ON trips (owner_user_id);
CREATE INDEX idx_trips_destination_id ON trips (destination_id);
CREATE INDEX idx_itinerary_items_trip_date ON itinerary_items (trip_id, item_date, sort_order);
CREATE INDEX idx_weather_destination_date ON weather_forecasts (destination_id, forecast_date);
CREATE INDEX idx_hotels_destination_id ON hotel_listings (destination_id);
CREATE INDEX idx_mock_bookings_trip_id ON mock_hotel_bookings (trip_id);
