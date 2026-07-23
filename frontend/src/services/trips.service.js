import api from './api';

export const tripsService = {
  list: () => api.get('/trips'),
  getById: (tripId) => api.get(`/trips/${tripId}`),
  create: (payload) => api.post('/trips', payload),
  update: (tripId, payload) => api.put(`/trips/${tripId}`, payload),
  remove: (tripId) => api.delete(`/trips/${tripId}`),
  listItinerary: (tripId) => api.get(`/trips/${tripId}/itinerary`),
  addItineraryItem: (tripId, payload) => api.post(`/trips/${tripId}/itinerary`, payload),
  updateItineraryItem: (itineraryItemId, payload) => api.put(`/itineraries/${itineraryItemId}`, payload),
  deleteItineraryItem: (itineraryItemId) => api.delete(`/itineraries/${itineraryItemId}`),
  getBudget: (tripId) => api.get(`/trips/${tripId}/budget`),
  saveBudget: (tripId, payload) => api.put(`/trips/${tripId}/budget`, payload),
  addBudgetItem: (tripId, payload) => api.post(`/trips/${tripId}/budget/items`, payload),
  listShareLinks: (tripId) => api.get(`/trips/${tripId}/share-links`),
  createShareLink: (tripId, payload) => api.post(`/trips/${tripId}/share-links`, payload),
  listCollaborators: (tripId) => api.get(`/trips/${tripId}/collaborators`),
  addCollaborator: (tripId, payload) => api.post(`/trips/${tripId}/collaborators`, payload),
  updateCollaborator: (tripId, userId, payload) => api.patch(`/trips/${tripId}/collaborators/${userId}`, payload)
};
