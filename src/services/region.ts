import { API_URL, authFetch, getAuthHeaders, handleResponse } from "@/lib/auth";
import { Region, RegionCreateRequest, RegionUpdateRequest } from "@/types/region";

export const getRegions = async (): Promise<Region[]> => {
  const response = await fetch(`${API_URL}/api/regions`);
  return handleResponse(response);
};

export const getRegionById = async (id: string): Promise<Region> => {
  const response = await fetch(`${API_URL}/api/regions/${id}`);
  return handleResponse(response);
};

export const createRegion = async (data: RegionCreateRequest): Promise<Region> => {
  const response = await authFetch(`${API_URL}/api/regions`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updateRegion = async (id: string, data:  RegionUpdateRequest): Promise<Region> => {
  const response = await authFetch(`${API_URL}/api/regions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const deleteRegion = async (id: string): Promise<void> => {
  const response = await authFetch(`${API_URL}/api/regions/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete region type');
  }
};

