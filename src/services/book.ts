import { API_URL, authFetch, getAccessToken, getAuthHeaders, handleResponse } from "@/lib/auth";
import { Book, BookCreateRequest, BookFilter, BookUpdateRequest } from "@/types/book";
import { ContentStatus, Like } from "@/types/common";

export const getBooks = async (filter?: BookFilter): Promise<Book[]> => {
  const params = new URLSearchParams();
  
  if (filter) {
    if (filter.title) params.append('title', filter.title);
    if (filter.authorName) params.append('authorName', filter.authorName);
    if (filter.genreIds && filter.genreIds.length > 0) {
      params.append('genreIds', filter.genreIds.join(','));
    }
    if (filter.yearMin !== null) params.append('yearMin', filter.yearMin.toString());
    if (filter.yearMax !== null) params.append('yearMax', filter.yearMax.toString());
    if (filter.available !== null) params.append('available', filter.available.toString());
    if (filter.sort) params.append('sort', filter.sort);
  }
  
  const response = await fetch(`${API_URL}/api/books?${params.toString()}`, {
  });
  return handleResponse(response);
};

export const getBookById = async (id: string): Promise<Book> => {
  const response = await fetch(`${API_URL}/api/books/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const createBook = async (data: BookCreateRequest): Promise<Book> => {
  const response = await authFetch(`${API_URL}/api/books`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updateBook = async (id: string, data: BookUpdateRequest): Promise<Book> => {
  const response = await authFetch(`${API_URL}/api/books/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const deleteBook = async (id: string): Promise<void> => {
  const response = await authFetch(`${API_URL}/api/books/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete book');
  }
};

export const uploadBookCover = async (id: string, file: File): Promise<{ coverFileId: string }> => {
  const token = getAccessToken();
  const formData = new FormData();
  formData.append('file', file, file.name);
  const response = await fetch(`${API_URL}/api/books/${id}/cover`, {
    method: 'POST',
    headers: {
      "Authorization" : `Bearer ${token}`
    },
    body: formData

  });
  
  return handleResponse(response);
};

export const uploadBookFile = async (id: string, file: File): Promise<{ coverFileId: string }> => {
  const token = getAccessToken();
  const formData = new FormData();
  formData.append('bookFile', file, file.name);
  const response = await fetch(`${API_URL}/api/books/${id}/file`, {
    method: 'POST',
    headers: {
      "Authorization" : `Bearer ${token}`
    },
    body: formData

  });
  
  return handleResponse(response);
};

export const readBook = async (id: string): Promise<Blob> => {
  const response = await fetch(`${API_URL}/api/books/${id}/read`, {
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to read book');
  }
  
  return response.blob();
};

export const getBookComments = async (bookId: string): Promise<Comment[]> => {
  const response = await fetch(`${API_URL}/api/books/${bookId}/comments`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const getBookLikes = async (bookId: string): Promise<Like[]> => {
  const response = await fetch(`${API_URL}/api/books/${bookId}/likes`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const changeBookStatus = async (bookId: string, status: ContentStatus) : Promise<void> => {
  const response = await authFetch(`${API_URL}/api/books/${bookId}/status`, {
    method: 'PATCH',
    body: JSON.stringify(status)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to change book status');
  }
}

export const getMyBooks = async (): Promise<Book[]> => {
  const response = await fetch(`${API_URL}/api/books/my`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};
