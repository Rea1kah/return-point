import api from './api';

const itemService = {
  async getItems(params = {}) {
    try {
      const response = await api.get('/items', { params });
      return response.data.data; 
    } catch (error) {
      console.error("Error fetching items:", error);
      return []; 
    }
  },

  async getItemById(id) {
    try {
      const response = await api.get(`/items/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch item' };
    }
  },

  // 3. Create Item
  async createItem(payload) {
    try {
      const response = await api.post('/items', payload);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create item' };
    }
  },

  async updateItem(id, payload) {
    try {
      const response = await api.put(`/items/${id}`, payload);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update item' };
    }
  },

  async updateStatus(id, status) {
    try {
      const response = await api.put(`/items/${id}/status`, { status });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update status' };
    }
  },

  async deleteItem(id) {
    try {
      const response = await api.delete(`/items/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete item' };
    }
  }
};

export default itemService;