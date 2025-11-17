
const API_BASE_URL = 'http://localhost:8080/api';

const coordService = {
    getAllCoordinates: async (page, size, sortBy, sortOrder) => {
        try {
            const response = await fetch(`${API_BASE_URL}/getCoordinates?page=${page}&size=${size}&sortBy${sortBy}&sortOrder${sortOrder}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching humans:', error);
            throw error;
        }
    },
    addCoordinates: async (coordinatesData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/addCoordinates`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(coordinatesData)
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
    patchCoord: async (coordId, coordData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/updateCoord/${coordId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(coordData)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error updating city:', error);
            throw error;
        }
    },
    getCitiesByCoord: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/getCitiesByCoordId?id=${id}`, {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.text().then()}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error updating city:', error);
            throw error;
        }
    },
    deleteCoord: async (coordId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/deleteCoord/${coordId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.text().then()}`);
            }
            return 0;
        } catch (error) {
            console.error('Error updating city:', error);
            throw error;
        }
    }

};

export default coordService;