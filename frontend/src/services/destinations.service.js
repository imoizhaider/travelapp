import api from './api';

export const destinationsService = {
  list: () => api.get('/destinations'),
  getById: (destinationId) => api.get(`/destinations/${destinationId}`),
  getWeather: (destinationId, date) => api.get(`/weather/${destinationId}`, { params: date ? { date } : {} }),
  getHotels: (destinationId) => api.get(`/destinations/${destinationId}/hotels`)
};
