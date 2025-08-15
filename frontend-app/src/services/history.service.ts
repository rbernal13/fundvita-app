import axios from "axios";
import type { History } from "../types/history";

const API_URL = "http://localhost:4000/history";

export const getHistory = async (userId: string) => {
    try {
        console.log("🚀 ~ getHistory ~ userId:", userId);
        const response = await axios.get(`${API_URL}/getHistoryByUser`, {
            params: { userId }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching history:", error);
    }
};
