import api from './api';

export const hotelsService = {
  listByDestination: (destinationId) => api.get(`/destinations/${destinationId}/hotels`),
  create: (destinationId, payload) => api.post(`/destinations/${destinationId}/hotels`, payload),
  update: (hotelId, payload) => api.put(`/hotels/${hotelId}`, payload),
  remove: (hotelId) => api.delete(`/hotels/${hotelId}`),
  createMockBooking: (hotelId, payload) => api.post(`/hotels/${hotelId}/mock-bookings`, payload)
};
