import { authFetch, handleResponse, getAuthHeaders, API_URL } from "@/lib/auth";
import { User, UserUpdateRequest } from "@/types/user";

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await authFetch(`${API_URL}/api/users`);
    return handleResponse<User[]>(response);
  } catch (error) {
    console.error('Ошибка при получении пользователей:', error);
    return [];
  }
};

export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const response = await authFetch(`${API_URL}/api/users/${id}`);
    return handleResponse<User>(response);
  } catch (error) {
    console.error('Ошибка при получении пользователя:', error);
    return null;
  }
};

export const updateUser = async (id: string, data: UserUpdateRequest): Promise<User> => {
  const response = await authFetch(`${API_URL}/api/users/${id}`, {
    method: 'PUt',
    body: JSON.stringify(data),
  });
  return handleResponse<User>(response);
};

export const deleteUser = async (id: string): Promise<void> => {
  const response = await authFetch(`${API_URL}/api/users/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Не удалось удалить пользователя');
  }
};

export const uploadAvatar = async (id: string, file: File): Promise<{ avatarId: string }> => {
  const formData = new FormData();
  formData.append('AvatarFile', file);
  
  const response = await authFetch(`${API_URL}/api/users/${id}/avatar`, {
    method: 'PATCH',
    body: formData,
    headers: getAuthHeaders()
  });
  
  return handleResponse<{ avatarId: string }>(response);
};

export const getAvatarUrl = (avatarId: string): string => {
  return `${API_URL}/api/users/avatar/${avatarId}`;
};

export const deleteAvatar = async (id: string): Promise<void> => {
  const response = await authFetch(`${API_URL}/api/users/${id}/avatar`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Не удалось удалить аватар');
  }
};