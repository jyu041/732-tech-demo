const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Base API service for handling HTTP requests
 */
class ApiService {
  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @returns {Promise<any>} - Response data
   */
  async get(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      
      if (!response.ok) {
        // For 404s, don't necessarily throw an error
        if (response.status === 404 && endpoint === '/profiles/user') {
          return null; // Return null for missing user profile
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {any} data - Request body data
   * @param {boolean} isFormData - Whether the data is FormData
   * @returns {Promise<any>} - Response data
   */
  async post(endpoint, data, isFormData = false) {
    try {
      const options = {
        method: 'POST',
        headers: isFormData ? {} : {
          'Content-Type': 'application/json',
        },
        body: isFormData ? data : JSON.stringify(data),
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Network response was not ok');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error posting data to ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {any} data - Request body data
   * @param {boolean} isFormData - Whether the data is FormData
   * @returns {Promise<any>} - Response data
   */
  async put(endpoint, data, isFormData = false) {
    try {
      const options = {
        method: 'PUT',
        headers: isFormData ? {} : {
          'Content-Type': 'application/json',
        },
        body: isFormData ? data : JSON.stringify(data),
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Network response was not ok');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating data at ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @returns {Promise<any>} - Response data
   */
  async delete(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Network response was not ok');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error deleting data at ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Upload a file with additional form data
   * @param {string} endpoint - API endpoint
   * @param {File} file - File to upload
   * @param {Object} additionalData - Additional form data
   * @param {string} fileFieldName - Name of the file field
   * @returns {Promise<any>} - Response data
   */
  async uploadFile(endpoint, file, additionalData = {}, fileFieldName = 'file') {
    try {
      const formData = new FormData();
      formData.append(fileFieldName, file);
      
      // Add additional data to form data
      Object.entries(additionalData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      
      return await this.post(endpoint, formData, true);
    } catch (error) {
      console.error(`Error uploading file to ${endpoint}:`, error);
      throw error;
    }
  }
}

export default new ApiService();