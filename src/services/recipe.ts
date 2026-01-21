import { API_URL, getAccessToken, getAuthHeaders, handleResponse } from "@/lib/auth";
import { ContentStatus, Like } from "@/types/common";
import { Recipe, RecipeCreateRequest, RecipeFilter, RecipeUpdateRequest } from "@/types/recipe";

export const getRecipes = async (filter?: RecipeFilter): Promise<Recipe[]> => {
  const params = new URLSearchParams();
  
  if (filter) {
    if (filter.title) params.append('title', filter.title);
    if (filter.recipeDifficulty) params.append('difficulty', filter.recipeDifficulty.toString());
    if (filter.recipeTypeIds && filter.recipeTypeIds.length > 0) {
      params.append('recipeTypeIds', filter.recipeTypeIds.join(','));
    }
    if (filter.regionIds && filter.regionIds.length > 0) {
      params.append('regionIds', filter.regionIds.join(','));
    }
    if (filter.cookTimeMin !== null) params.append('cookTimeMin', filter.cookTimeMin.toString());
    if (filter.cookTimeMax !== null) params.append('cookTimeMax', filter.cookTimeMax.toString());
    if (filter.available !== null) params.append('available', filter.available.toString());
    if (filter.sort) params.append('sort', filter.sort);
  }
  
  const response = await fetch(`${API_URL}/api/recipes?${params.toString()}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const getRecipeById = async (id: string): Promise<Recipe> => {
  const response = await fetch(`${API_URL}/api/recipes/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const createRecipe = async (data: RecipeCreateRequest): Promise<Recipe> => {
  const response = await fetch(`${API_URL}/api/recipes`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updateRecipe = async (id: string, data: RecipeUpdateRequest): Promise<Recipe> => {
  const response = await fetch(`${API_URL}/api/recipes/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const deleteRecipe = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/api/recipes/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete eecipe');
  }
};

export const uploadRecipeImage = async (id: string, file: File): Promise<{ imageId: string }> => {
  const token = getAccessToken();
  const formData = new FormData();
  formData.append('file', file, file.name);
  const response = await fetch(`${API_URL}/api/recipes/${id}/image`, {
    method: 'POST',
    headers: {
      'Authorization' : `Bearer ${token}`
    },
    body: formData
  });
  
  return handleResponse(response);
};

export const getRecipeComments = async (RecipeId: string): Promise<Comment[]> => {
  const response = await fetch(`${API_URL}/api/recipes/${RecipeId}/comments`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const getRecipeLikes = async (RecipeId: string): Promise<Like[]> => {
  const response = await fetch(`${API_URL}/api/recipes/${RecipeId}/likes`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const changeRecipeStatus = async (RecipeId: string, status: ContentStatus) : Promise<void> => {
  const response = await fetch(`${API_URL}/api/recipes/${RecipeId}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(status)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to change recipe status');
  }
}

export const getMyRecipes = async (): Promise<Recipe[]> => {
  const response = await fetch(`${API_URL}/api/recipes/my`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};
