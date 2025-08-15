import axios from 'axios';

const API_URL = "http://localhost:4000/users";

export const getAllUsers = async (userId: string) => {
    const response = await axios.get(`${API_URL}/getUserById`, {
        params: { userId }
    });
    return response.data;
};