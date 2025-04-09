import apiService from './apiService';

/**
 * Service for handling chat functionality
 */
class ChatService {
  /**
   * Start a new chat with an ex-girlfriend or get an existing one
   * @param {string} exGirlfriendId - ID of the ex-girlfriend
   * @returns {Promise<any>} Chat session
   */
  async startChat(exGirlfriendId) {
    return apiService.post(`/chats/start?exGirlfriendId=${exGirlfriendId}`, {});
  }

  /**
   * Get all chats for the current user
   * @returns {Promise<any[]>} List of chat sessions
   */
  async getUserChats() {
    return apiService.get('/chats/user');
  }

  /**
   * Get a specific chat by ID
   * @param {string} chatId - Chat ID
   * @returns {Promise<any>} Chat session
   */
  async getChat(chatId) {
    return apiService.get(`/chats/${chatId}`);
  }

  /**
   * Get all messages for a chat
   * @param {string} chatId - Chat ID
   * @returns {Promise<any[]>} List of messages
   */
  async getChatMessages(chatId) {
    return apiService.get(`/chats/${chatId}/messages`);
  }

  /**
   * Get recent messages for a chat (last 20)
   * @param {string} chatId - Chat ID
   * @returns {Promise<any[]>} List of recent messages
   */
  async getRecentMessages(chatId) {
    return apiService.get(`/chats/${chatId}/recent-messages`);
  }

  /**
   * Send a message in a chat and get AI response
   * @param {string} chatId - Chat ID
   * @param {string} content - Message content
   * @returns {Promise<any>} AI response
   */
  async sendMessage(chatId, content) {
    const response = await apiService.post(`/chats/${chatId}/messages`, { content });
    
    console.log('Raw API response for sendMessage:', response);
    console.log('AI response structure:', response.aiResponse);
    console.log('Is AI response isFromUser set?', response.aiResponse?.isFromUser);
    
    return response;
  }

  /**
   * Delete a chat and all its messages
   * @param {string} chatId - Chat ID
   * @returns {Promise<any>} Deletion confirmation
   */
  async deleteChat(chatId) {
    return apiService.delete(`/chats/${chatId}`);
  }
}

export default new ChatService();