import axios from 'axios';

const API_URL = "http://localhost:4000/funds";

export const subscribeFund = async (userId: string, fundId: string) => {
    const response = await axios.post(`${API_URL}/subscribe`, {
        data: { userId, fundId }
    });
    return response.data;
};

export const cancelFund = async (userId: string, fundId: string) => {
    const response = await axios.post(`${API_URL}/cancel`, {
        data: { userId, fundId }
    });
    return response.data;
};

export const getAllFunds = async () => {
    const response = await axios.get(`${API_URL}`);
    return response.data;
};
