import { API_URL, authFetch, getAuthHeaders, handleResponse } from "@/lib/auth";
import { RecipeType, RecipeTypeCreateRequest, RecipeTypeUpdateRequest } from "@/types/recipe-type";

export const getRecipeTypes = async (): Promise<RecipeType[]> => {
  const response = await fetch(`${API_URL}/api/recipe-types`);
  return handleResponse(response);
};

export const getRecipeTypeById = async (id: string): Promise<RecipeType> => {
  const response = await fetch(`${API_URL}/api/recipe-types/${id}`);
  return handleResponse(response);
};

export const createRecipeType = async (data: RecipeTypeCreateRequest): Promise<RecipeType> => {
  const response = await authFetch(`${API_URL}/api/recipe-types`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updateRecipeType = async (id: string, data:  RecipeTypeUpdateRequest): Promise<RecipeType> => {
  const response = await authFetch(`${API_URL}/api/recipe-types/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const deleteRecipeType = async (id: string): Promise<void> => {
  const response = await authFetch(`${API_URL}/api/recipe-types/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete  Recipe type');
  }
};

