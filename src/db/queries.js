const authQueries = {
  getRoleByName: 'SELECT role_id, role_name FROM roles WHERE LOWER(role_name) = LOWER($1) LIMIT 1',
  findUserByEmail: `
    SELECT u.user_id, u.role_id, u.email, u.password_hash, u.is_active,
           r.role_name,
           p.full_name, p.avatar_url, p.bio, p.timezone
    FROM users u
    JOIN roles r ON r.role_id = u.role_id
    LEFT JOIN user_profiles p ON p.user_id = u.user_id
    WHERE u.email = $1
    LIMIT 1
  `,
  findUserByEmailPublic: `
    SELECT u.user_id, u.email, p.full_name
    FROM users u
    LEFT JOIN user_profiles p ON p.user_id = u.user_id
    WHERE u.email = $1
    LIMIT 1
  `,
  createUser: `
    INSERT INTO users (role_id, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING user_id, role_id, email, is_active, created_at
  `,
  createProfile: `
    INSERT INTO user_profiles (user_id, full_name, avatar_url, bio, timezone)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING user_id, full_name, avatar_url, bio, timezone
  `,
  getUserById: `
    SELECT u.user_id, u.email, u.is_active, u.created_at, u.updated_at,
           r.role_name,
           p.full_name, p.avatar_url, p.bio, p.timezone,
           pref.home_country, pref.preferred_currency, pref.preferred_travel_style,
           pref.preferred_budget_level, pref.preferred_season
    FROM users u
    JOIN roles r ON r.role_id = u.role_id
    LEFT JOIN user_profiles p ON p.user_id = u.user_id
    LEFT JOIN user_travel_preferences pref ON pref.user_id = u.user_id
    WHERE u.user_id = $1
    LIMIT 1
  `
};

const destinationQueries = {
  list: 'SELECT * FROM destinations ORDER BY destination_name ASC',
  getById: 'SELECT * FROM destinations WHERE destination_id = $1 LIMIT 1',
  create: `
    INSERT INTO destinations
      (destination_name, city, region, country, latitude, longitude, summary, average_cost_level, popularity_score)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `,
  update: `
    UPDATE destinations
    SET destination_name = COALESCE($2, destination_name),
        city = COALESCE($3, city),
        region = COALESCE($4, region),
        country = COALESCE($5, country),
        latitude = COALESCE($6, latitude),
        longitude = COALESCE($7, longitude),
        summary = COALESCE($8, summary),
        average_cost_level = COALESCE($9, average_cost_level),
        popularity_score = COALESCE($10, popularity_score),
        updated_at = NOW()
    WHERE destination_id = $1
    RETURNING *
  `,
  remove: 'DELETE FROM destinations WHERE destination_id = $1 RETURNING destination_id'
};

const tripQueries = {
  listAccessible: `
    SELECT DISTINCT t.*,
           d.destination_name, d.city, d.country,
           r.role_name AS owner_role_name
    FROM trips t
    JOIN destinations d ON d.destination_id = t.destination_id
    JOIN users u ON u.user_id = t.owner_user_id
    JOIN roles r ON r.role_id = u.role_id
    LEFT JOIN trip_collaborators tc
      ON tc.trip_id = t.trip_id
     AND tc.user_id = $1
     AND tc.collaborator_status = 'accepted'
    WHERE t.owner_user_id = $1 OR tc.user_id IS NOT NULL
    ORDER BY t.created_at DESC
  `,
  getByIdAccessible: `
    SELECT t.*,
           d.destination_name, d.city, d.country
    FROM trips t
    JOIN destinations d ON d.destination_id = t.destination_id
    LEFT JOIN trip_collaborators tc
      ON tc.trip_id = t.trip_id
     AND tc.user_id = $2
     AND tc.collaborator_status = 'accepted'
    WHERE t.trip_id = $1 AND (t.owner_user_id = $2 OR tc.user_id IS NOT NULL)
    LIMIT 1
  `,
  create: `
    INSERT INTO trips
      (owner_user_id, destination_id, trip_title, trip_purpose, start_date, end_date, traveler_count, trip_status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `,
  update: `
    UPDATE trips
    SET destination_id = COALESCE($2, destination_id),
        trip_title = COALESCE($3, trip_title),
        trip_purpose = COALESCE($4, trip_purpose),
        start_date = COALESCE($5, start_date),
        end_date = COALESCE($6, end_date),
        traveler_count = COALESCE($7, traveler_count),
        trip_status = COALESCE($8, trip_status),
        updated_at = NOW()
    WHERE trip_id = $1 AND owner_user_id = $9
    RETURNING *
  `,
  remove: 'DELETE FROM trips WHERE trip_id = $1 AND owner_user_id = $2 RETURNING trip_id',
  checkEditable: `
    SELECT 1
    FROM trips t
    LEFT JOIN trip_collaborators tc
      ON tc.trip_id = t.trip_id
     AND tc.user_id = $2
     AND tc.access_level = 'edit'
     AND tc.collaborator_status = 'accepted'
    WHERE t.trip_id = $1 AND (t.owner_user_id = $2 OR tc.user_id IS NOT NULL)
    LIMIT 1
  `,
  listCollaborators: `
    SELECT tc.trip_id, tc.user_id, tc.invited_by_user_id, tc.access_level, tc.collaborator_status,
           tc.created_at, tc.accepted_at,
           u.email, p.full_name
    FROM trip_collaborators tc
    JOIN users u ON u.user_id = tc.user_id
    LEFT JOIN user_profiles p ON p.user_id = u.user_id
    WHERE tc.trip_id = $1
    ORDER BY tc.created_at DESC
  `,
  addCollaborator: `
    INSERT INTO trip_collaborators (trip_id, user_id, invited_by_user_id, access_level, collaborator_status)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (trip_id, user_id)
    DO UPDATE SET invited_by_user_id = EXCLUDED.invited_by_user_id,
                  access_level = EXCLUDED.access_level,
                  collaborator_status = EXCLUDED.collaborator_status,
                  created_at = NOW()
    RETURNING *
  `,
  updateCollaborator: `
    UPDATE trip_collaborators
    SET access_level = COALESCE($3, access_level),
        collaborator_status = COALESCE($4, collaborator_status),
        accepted_at = CASE WHEN $4 = 'accepted' THEN NOW() ELSE accepted_at END
    WHERE trip_id = $1 AND user_id = $2
    RETURNING *
  `
};

const itineraryQueries = {
  listByTrip: `
    SELECT i.*, c.category_name, d.destination_name
    FROM itinerary_items i
    JOIN itinerary_categories c ON c.category_id = i.category_id
    LEFT JOIN destinations d ON d.destination_id = i.destination_id
    WHERE i.trip_id = $1
    ORDER BY i.item_date ASC, i.sort_order ASC, i.start_time ASC NULLS LAST
  `,
  create: `
    INSERT INTO itinerary_items
      (trip_id, category_id, destination_id, item_date, start_time, end_time, item_title, location_name, notes, estimated_cost, is_completed, sort_order)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, COALESCE($11, FALSE), COALESCE($12, 1))
    RETURNING *
  `,
  update: `
    UPDATE itinerary_items
    SET category_id = COALESCE($2, category_id),
        destination_id = COALESCE($3, destination_id),
        item_date = COALESCE($4, item_date),
        start_time = COALESCE($5, start_time),
        end_time = COALESCE($6, end_time),
        item_title = COALESCE($7, item_title),
        location_name = COALESCE($8, location_name),
        notes = COALESCE($9, notes),
        estimated_cost = COALESCE($10, estimated_cost),
        is_completed = COALESCE($11, is_completed),
        sort_order = COALESCE($12, sort_order),
        updated_at = NOW()
    WHERE itinerary_item_id = $1
    RETURNING *
  `,
  remove: 'DELETE FROM itinerary_items WHERE itinerary_item_id = $1 RETURNING itinerary_item_id'
};

const favoritesQueries = {
  listDestinations: `
    SELECT fd.user_id, d.* , fd.created_at AS favorited_at
    FROM favorite_destinations fd
    JOIN destinations d ON d.destination_id = fd.destination_id
    WHERE fd.user_id = $1
    ORDER BY fd.created_at DESC
  `,
  addDestination: 'INSERT INTO favorite_destinations (user_id, destination_id) VALUES ($1, $2) RETURNING *',
  removeDestination: 'DELETE FROM favorite_destinations WHERE user_id = $1 AND destination_id = $2 RETURNING *',
  listHotels: `
    SELECT fh.user_id, h.*, fh.created_at AS favorited_at
    FROM favorite_hotels fh
    JOIN hotel_listings h ON h.hotel_id = fh.hotel_id
    WHERE fh.user_id = $1
    ORDER BY fh.created_at DESC
  `,
  addHotel: 'INSERT INTO favorite_hotels (user_id, hotel_id) VALUES ($1, $2) RETURNING *',
  removeHotel: 'DELETE FROM favorite_hotels WHERE user_id = $1 AND hotel_id = $2 RETURNING *',
  listAttractions: `
    SELECT fa.user_id, a.*, fa.created_at AS favorited_at
    FROM favorite_attractions fa
    JOIN destination_attractions a ON a.attraction_id = fa.attraction_id
    WHERE fa.user_id = $1
    ORDER BY fa.created_at DESC
  `
};

const weatherQueries = {
  getByDestination: `
    SELECT *
    FROM weather_forecasts
    WHERE destination_id = $1
      AND ($2::date IS NULL OR forecast_date = $2::date)
    ORDER BY forecast_date ASC
  `
};

const budgetQueries = {
  getEstimateByTrip: 'SELECT * FROM budget_estimates WHERE trip_id = $1 LIMIT 1',
  upsertEstimate: `
    INSERT INTO budget_estimates (trip_id, currency_code, total_estimated, contingency_amount)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (trip_id)
    DO UPDATE SET currency_code = EXCLUDED.currency_code,
                  total_estimated = EXCLUDED.total_estimated,
                  contingency_amount = EXCLUDED.contingency_amount,
                  updated_at = NOW()
    RETURNING *
  `,
  listItems: `
    SELECT bi.*, bc.category_name
    FROM budget_items bi
    JOIN budget_categories bc ON bc.budget_category_id = bi.budget_category_id
    WHERE bi.budget_estimate_id = $1
    ORDER BY bi.sort_order ASC, bi.created_at ASC
  `,
  createItem: `
    INSERT INTO budget_items (budget_estimate_id, budget_category_id, item_description, amount, planned_date, sort_order)
    VALUES ($1, $2, $3, $4, $5, COALESCE($6, 1))
    RETURNING *
  `,
  updateItem: `
    UPDATE budget_items
    SET budget_category_id = COALESCE($2, budget_category_id),
        item_description = COALESCE($3, item_description),
        amount = COALESCE($4, amount),
        planned_date = COALESCE($5, planned_date),
        sort_order = COALESCE($6, sort_order)
    WHERE budget_item_id = $1
    RETURNING *
  `,
  removeItem: 'DELETE FROM budget_items WHERE budget_item_id = $1 RETURNING budget_item_id'
};

const hotelQueries = {
  listByDestination: 'SELECT * FROM hotel_listings WHERE destination_id = $1 ORDER BY star_rating DESC NULLS LAST, nightly_rate ASC',
  getById: 'SELECT * FROM hotel_listings WHERE hotel_id = $1 LIMIT 1',
  create: `
    INSERT INTO hotel_listings
      (destination_id, hotel_name, hotel_description, room_type, nightly_rate, currency_code, star_rating, is_mock)
    VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, TRUE))
    RETURNING *
  `,
  update: `
    UPDATE hotel_listings
    SET hotel_name = COALESCE($2, hotel_name),
        hotel_description = COALESCE($3, hotel_description),
        room_type = COALESCE($4, room_type),
        nightly_rate = COALESCE($5, nightly_rate),
        currency_code = COALESCE($6, currency_code),
        star_rating = COALESCE($7, star_rating),
        is_mock = COALESCE($8, is_mock),
        updated_at = NOW()
    WHERE hotel_id = $1
    RETURNING *
  `,
  remove: 'DELETE FROM hotel_listings WHERE hotel_id = $1 RETURNING hotel_id',
  createBooking: `
    INSERT INTO mock_hotel_bookings
      (trip_id, hotel_id, booked_by_user_id, check_in_date, check_out_date, guests_count, total_amount, booking_status, confirmation_code)
    VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, 'mocked'), $9)
    RETURNING *
  `
};

const sharingQueries = {
  createShareLink: `
    INSERT INTO trip_share_links
      (trip_id, created_by_user_id, share_token, access_level, expires_at, revoked_at)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `,
  listShareLinks: 'SELECT * FROM trip_share_links WHERE trip_id = $1 ORDER BY created_at DESC',
  createCollaborator: `
    INSERT INTO trip_collaborators (trip_id, user_id, invited_by_user_id, access_level, collaborator_status)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (trip_id, user_id)
    DO UPDATE SET invited_by_user_id = EXCLUDED.invited_by_user_id,
                  access_level = EXCLUDED.access_level,
                  collaborator_status = EXCLUDED.collaborator_status,
                  created_at = NOW()
    RETURNING *
  `,
  updateCollaborator: `
    UPDATE trip_collaborators
    SET access_level = COALESCE($3, access_level),
        collaborator_status = COALESCE($4, collaborator_status),
        accepted_at = CASE WHEN $4 = 'accepted' THEN NOW() ELSE accepted_at END
    WHERE trip_id = $1 AND user_id = $2
    RETURNING *
  `,
  listCollaborators: tripQueries.listCollaborators
};

module.exports = {
  authQueries,
  destinationQueries,
  tripQueries,
  itineraryQueries,
  favoritesQueries,
  weatherQueries,
  budgetQueries,
  hotelQueries,
  sharingQueries
};
