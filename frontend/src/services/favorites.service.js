import api from './api';

export const favoritesService = {
  list: () => api.get('/me/favorites'),
  addDestination: (destinationId) => api.post(`/me/favorites/destinations/${destinationId}`),
  removeDestination: (destinationId) => api.delete(`/me/favorites/destinations/${destinationId}`),
  addHotel: (hotelId) => api.post(`/me/favorites/hotels/${hotelId}`),
  removeHotel: (hotelId) => api.delete(`/me/favorites/hotels/${hotelId}`),
  addAttraction: (attractionId) => api.post(`/me/favorites/attractions/${attractionId}`),
  removeAttraction: (attractionId) => api.delete(`/me/favorites/attractions/${attractionId}`)
};
