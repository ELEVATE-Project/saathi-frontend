import { API_ENDPOINTS } from "../../constants/urls";
import { apiClient as axiosInstance } from "../client/index";


export async function getChatsFromDB(session) {
    try {
        const response = await axiosInstance.get(`${API_ENDPOINTS.GET_COMPANY_CHAT}?session=${session}`);

        return response?.data;
    } catch (error) {
        console.error('Error saving chats in db api:', error);
        throw error;
    }
}
