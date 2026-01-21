import { API_URL } from "./auth"

export const getImageUrl = (id: string) : string => {
    return `${API_URL}/images/${id}`;
}