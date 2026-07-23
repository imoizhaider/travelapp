export const TOKEN_KEY = 'travelapp_token';

export const ROLE_LABELS = {
  'Registered Traveler': 'Traveler',
  'Trip Collaborator': 'Collaborator',
  Administrator: 'Admin',
  Guest: 'Guest'
};

export const TRIP_STATUSES = ['draft', 'planned', 'active', 'completed'];

export const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'Dashboard', to: '/dashboard', protected: true },
  { label: 'My Trips', to: '/trips', protected: true },
  { label: 'Profile', to: '/profile', protected: true }
];

export const ITINERARY_CATEGORIES = [
  { id: 1, name: 'Flight' },
  { id: 2, name: 'Accommodation' },
  { id: 3, name: 'Transportation' },
  { id: 4, name: 'Meal' },
  { id: 5, name: 'Activity' },
  { id: 6, name: 'Sightseeing' },
  { id: 7, name: 'Shopping' },
  { id: 8, name: 'Other' }
];

export const BUDGET_CATEGORIES = [
  { id: 1, name: 'Transportation' },
  { id: 2, name: 'Accommodation' },
  { id: 3, name: 'Food & Dining' },
  { id: 4, name: 'Activities' },
  { id: 5, name: 'Shopping' },
  { id: 6, name: 'Emergency' },
  { id: 7, name: 'Other' }
];