import { API_URL, getAuthHeaders, handleResponse } from "@/lib/auth";
import { ArticleType, ArticleTypeCreateRequest, ArticleTypeUpdateRequest } from "@/types/article-type";

export const getArticleTypes = async (): Promise<ArticleType[]> => {
  const response = await fetch(`${API_URL}/api/article-types`);
  return handleResponse(response);
};

export const getArticleTypeById = async (id: string): Promise<ArticleType> => {
  const response = await fetch(`${API_URL}/api/article-types/${id}`);
  return handleResponse(response);
};

export const createArticleType = async (data: ArticleTypeCreateRequest): Promise<ArticleType> => {
  const response = await fetch(`${API_URL}/api/article-types`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updateArticleType = async (id: string, data: ArticleTypeUpdateRequest): Promise<ArticleType> => {
  const response = await fetch(`${API_URL}/api/article-types/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const deleteArticleType = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/api/article-types/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete article type');
  }
};

