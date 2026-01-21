import { API_URL, getAuthHeaders, handleResponse } from "@/lib/auth";
import { Genre, GenreCreateRequest, GenreUpdateRequest } from "@/types/genre";

export const getGenres = async (): Promise<Genre[]> => {
  const response = await fetch(`${API_URL}/api/genres`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const getGenreById = async (id: string): Promise<Genre> => {
  const response = await fetch(`${API_URL}/api/genres/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const createGenre = async (data: GenreCreateRequest): Promise<Genre> => {
  const response = await fetch(`${API_URL}/api/genres`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updateGenre = async (id: string, data: GenreUpdateRequest): Promise<Genre> => {
  const response = await fetch(`${API_URL}/api/genres/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const deleteGenre = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/api/genres/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete genre');
  }
};