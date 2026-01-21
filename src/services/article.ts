import { API_URL, getAuthHeaders, handleResponse } from "@/lib/auth";
import { ArticleFilter, Article, ArticleCreateRequest, ArticleUpdateRequest } from "@/types/article";
import { ContentStatus, Like } from "@/types/common";

export const getArticles = async (filter?: ArticleFilter): Promise<Article[]> => {
  const params = new URLSearchParams();
  
  if (filter) {
    if (filter.search) params.append('search', filter.search);
    if (filter.type) params.append('type', filter.type);
    if (filter.authorId) params.append('authorId', filter.authorId);
    if (filter.sort) params.append('sort', filter.sort);
    if (filter.status) params.append('status', filter.status);
  }
  
  const response = await fetch(`${API_URL}/api/articles?${params.toString()}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const getArticleById = async (id: string): Promise<Article> => {
  const response = await fetch(`${API_URL}/api/articles/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const getArticleBySlug = async (slug: string): Promise<Article> => {
  const response = await fetch(`${API_URL}/api/articles/by-slug/${slug}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const createArticle = async (data: ArticleCreateRequest): Promise<Article> => {
  const response = await fetch(`${API_URL}/api/articles`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updateArticle = async (id: string, data: ArticleUpdateRequest): Promise<Article> => {
  const response = await fetch(`${API_URL}/api/articles/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const deleteArticle = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/api/articles/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete article');
  }
};

export const getMyArticles = async (): Promise<Article[]> => {
  const response = await fetch(`${API_URL}/api/articles/my`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const getArticleComments = async (articleId: string): Promise<Comment[]> => {
  const response = await fetch(`${API_URL}/api/articles/${articleId}/comments`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const getArticleLikes = async (articleId: string): Promise<Like[]> => {
  const response = await fetch(`${API_URL}/api/articles/${articleId}/likes`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const changeArticleStatus = async (articleId: string, status: ContentStatus) : Promise<void> => {
  const response = await fetch(`${API_URL}/api/articles/${articleId}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(status)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to change article status');
  }
}