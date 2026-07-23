INSERT INTO roles (role_name, role_description) VALUES
  ('Registered Traveler', 'Standard user who can create trips and manage personal data'),
  ('Trip Collaborator', 'User invited to collaborate on a specific trip'),
  ('Administrator', 'Full system access, manages destinations and configurations'),
  ('Guest', 'Read-only access to shared content')
ON CONFLICT (role_name) DO NOTHING;

INSERT INTO itinerary_categories (category_name) VALUES
  ('Flight'), ('Accommodation'), ('Transportation'), ('Meal'),
  ('Activity'), ('Sightseeing'), ('Shopping'), ('Other')
ON CONFLICT (category_name) DO NOTHING;

INSERT INTO budget_categories (category_name) VALUES
  ('Transportation'), ('Accommodation'), ('Food & Dining'),
  ('Activities'), ('Shopping'), ('Emergency'), ('Other')
ON CONFLICT (category_name) DO NOTHING;

INSERT INTO destinations (destination_name, city, region, country, latitude, longitude, summary, average_cost_level, popularity_score) VALUES
  ('Paris', 'Paris', 'Ile-de-France', 'France', 48.8566, 2.3522, 'The City of Light, known for its art, fashion, gastronomy, and culture.', 'High', 98),
  ('Tokyo', 'Tokyo', 'Kanto', 'Japan', 35.6762, 139.6503, 'A vibrant metropolis blending ultra-modern with traditional.', 'High', 95),
  ('Bali', 'Denpasar', 'Bali', 'Indonesia', -8.3405, 115.0920, 'Tropical paradise with terraced rice paddies, beaches, and temples.', 'Low', 92),
  ('New York', 'New York City', 'New York', 'United States', 40.7128, -74.0060, 'The Big Apple - iconic skyline, diverse culture, and endless attractions.', 'Very High', 96),
  ('Rome', 'Rome', 'Lazio', 'Italy', 41.9028, 12.4964, 'The Eternal City, home to ancient ruins, Renaissance art, and world-class cuisine.', 'Medium', 90),
  ('Dubai', 'Dubai', 'Dubai', 'United Arab Emirates', 25.2048, 55.2708, 'A futuristic desert city known for luxury shopping, skyscrapers, and nightlife.', 'Very High', 88)
ON CONFLICT DO NOTHING;

INSERT INTO weather_forecasts (destination_id, forecast_date, temperature_high_c, temperature_low_c, weather_condition, precipitation_chance) VALUES
  (1, '2026-08-10', 28, 18, 'Sunny', 10),
  (1, '2026-08-11', 26, 17, 'Partly cloudy', 20),
  (1, '2026-08-12', 24, 15, 'Light rain', 60),
  (2, '2026-08-10', 32, 25, 'Humid', 30),
  (2, '2026-08-11', 31, 24, 'Thunderstorms', 70),
  (3, '2026-08-10', 30, 24, 'Sunny', 5),
  (3, '2026-08-11', 29, 23, 'Sunny', 10),
  (4, '2026-08-10', 27, 20, 'Clear', 15),
  (5, '2026-08-10', 33, 22, 'Sunny', 10),
  (6, '2026-08-10', 42, 30, 'Hot', 0),
  (6, '2026-08-11', 41, 29, 'Hot', 5)
ON CONFLICT (destination_id, forecast_date) DO NOTHING;