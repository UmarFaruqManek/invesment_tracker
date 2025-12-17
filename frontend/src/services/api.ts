import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * API Service untuk komunikasi dengan backend
 */
const api = {
  /**
   * GET semua transaksi
   */
  getTransactions: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/transactions`);
      return response.data;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  },

  /**
   * GET transaksi by ID
   * @param {number} id - Transaction ID
   */
  getTransactionById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/transactions/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching transaction:", error);
      throw error;
    }
  },

  /**
   * POST transaksi baru dengan file upload
   * @param {FormData} formData - Form data dengan fields dan file
   */
  createTransaction: async (formData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/transactions`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  },

  /**
   * PUT update transaksi
   * @param {number} id - Transaction ID
   * @param {FormData} formData - Updated form data
   */
  updateTransaction: async (id, formData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/transactions/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  },

  /**
   * DELETE transaksi
   * @param {number} id - Transaction ID
   */
  deleteTransaction: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/transactions/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  },

  /**
   * GET summary (total spent & composition)
   */
  getSummary: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/summary`);
      return response.data;
    } catch (error) {
      console.error("Error fetching summary:", error);
      throw error;
    }
  },
};

export default api;
