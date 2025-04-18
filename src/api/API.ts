import axios from 'axios';

const API_URL = 'http://localhost:8000';  // Change to your backend URL later

export const executeCode = async (code: string, language: string) => {
  try {
    const response = await axios.post(`${API_URL}/execute`, { code, language });
    return response.data;
  } catch (error) {
    console.error("Execution error:", error);
    return { error: "Failed to execute code" };
  }
};