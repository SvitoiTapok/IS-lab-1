
const API_BASE_URL = 'http://localhost:8080/api';

const humanService = {

    getAllHumans: async (page, size, sortBy, sortOrder) => {
        try {
            const response = await fetch(`${API_BASE_URL}/getHumans?page=${page}&size=${size}&sortBy${sortBy}&sortOrder${sortOrder}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching humans:', error);
            throw error;
        }
    },
    addHuman: async (humanData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/addHuman`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(humanData)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching humans:', error);
            throw error;
        }
    },

};

export default humanService;