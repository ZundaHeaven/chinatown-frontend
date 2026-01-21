import { API_URL, authFetch, getAuthHeaders, handleResponse } from "@/lib/auth";
import { Like } from "@/types/common";

export const toggleLike = async (contentId: string): Promise<{likes: Like[], likesCount: string}> => {
  const response = await authFetch(`${API_URL}/api/likes/content/${contentId}/toggle`, 
    {
        method: 'POST',
    }
  );
  return handleResponse(response);
};


export const getLikes = async(contentId: string): Promise<Like[]> => {
  const response = await authFetch(`${API_URL}/api/likes/content/${contentId}`);
  return handleResponse(response);
}

export const getMyLikes = async(): Promise<Like[]> => {
  const response = await authFetch(`${API_URL}/api/likes/my`);
  return handleResponse(response);
}

export const checkIfLiked = async(contentId: string): Promise<boolean> => {
  const response = await authFetch(`${API_URL}/api/likes/content/${contentId}/check`);
  return handleResponse(response);
}