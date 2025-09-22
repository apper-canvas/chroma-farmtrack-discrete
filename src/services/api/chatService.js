class ChatService {
  constructor() {
    this.apiClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apiClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async sendMessage(message, conversationHistory = []) {
    try {
      if (!this.apiClient) {
        this.initializeClient();
      }

      if (!this.apiClient) {
        throw new Error('ApperClient not available');
      }

      const result = await this.apiClient.functions.invoke(import.meta.env.VITE_CHAT_GPT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message,
          conversationHistory
        })
      });

      if (!result.success) {
        throw new Error(result.message || 'Failed to get ChatGPT response');
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('Error sending message to ChatGPT:', error);
      return {
        success: false,
        message: error.message || 'Failed to communicate with ChatGPT'
      };
    }
  }
}

export const chatService = new ChatService();