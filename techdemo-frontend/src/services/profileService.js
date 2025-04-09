import apiService from './apiService';

/**
 * Service for handling user and ex-girlfriend profiles
 */
class ProfileService {
  /**
   * Get the main user profile
   * @returns {Promise<any>} User profile
   */
  async getUserProfile() {
    return apiService.get('/profiles/user');
  }

  /**
   * Create or update user profile
   * @param {string} username - User's name
   * @param {File} profilePicture - User's profile picture
   * @returns {Promise<any>} Updated user profile
   */
  async updateUserProfile(username, profilePicture) {
    const formData = new FormData();
    
    if (username) {
      formData.append('username', username);
    }
    
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }
    
    return apiService.post('/profiles/user', formData, true);
  }

  /**
   * Get all ex-girlfriend profiles
   * @returns {Promise<any[]>} List of ex-girlfriend profiles
   */
  async getAllExGirlfriends() {
    return apiService.get('/profiles/exgirlfriend');
  }

  /**
   * Get a specific ex-girlfriend profile by ID
   * @param {string} id - Ex-girlfriend ID
   * @returns {Promise<any>} Ex-girlfriend profile
   */
  async getExGirlfriend(id) {
    return apiService.get(`/profiles/exgirlfriend/${id}`);
  }

  /**
   * Create a new ex-girlfriend profile
   * @param {string} name - Ex-girlfriend's name
   * @param {File} profilePicture - Ex-girlfriend's profile picture
   * @param {string} personality - Optional personality description
   * @param {string} backstory - Optional backstory with the user
   * @returns {Promise<any>} Created ex-girlfriend profile
   */
  async createExGirlfriend(name, profilePicture, personality = '', backstory = '') {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('profilePicture', profilePicture);
    
    if (personality) {
      formData.append('personality', personality);
    }
    
    if (backstory) {
      formData.append('backstory', backstory);
    }
    
    return apiService.post('/profiles/exgirlfriend', formData, true);
  }

  /**
   * Update an existing ex-girlfriend profile
   * @param {string} id - Ex-girlfriend ID
   * @param {Object} updateData - Data to update
   * @param {File} profilePicture - New profile picture (optional)
   * @returns {Promise<any>} Updated ex-girlfriend profile
   */
  async updateExGirlfriend(id, updateData, profilePicture = null) {
    const formData = new FormData();
    
    if (updateData.name) {
      formData.append('name', updateData.name);
    }
    
    if (updateData.personality !== undefined) {
      formData.append('personality', updateData.personality);
    }
    
    if (updateData.backstory !== undefined) {
      formData.append('backstory', updateData.backstory);
    }
    
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }
    
    return apiService.put(`/profiles/exgirlfriend/${id}`, formData, true);
  }

  /**
   * Delete an ex-girlfriend profile
   * @param {string} id - Ex-girlfriend ID
   * @returns {Promise<any>} Deletion confirmation
   */
  async deleteExGirlfriend(id) {
    return apiService.delete(`/profiles/exgirlfriend/${id}`);
  }
}

export default new ProfileService();