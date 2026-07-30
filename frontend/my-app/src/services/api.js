
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const sendContactMessage = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData), 
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.errors?.[0]?.msg || 'Failed to send message');
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};