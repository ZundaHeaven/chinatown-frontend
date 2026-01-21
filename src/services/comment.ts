import { API_URL, getAuthHeaders, handleResponse } from "@/lib/auth";
import { CommentAdd } from "@/types/common";
import {Comment} from '@/types/common'

export const addComment = async (data: CommentAdd): Promise<Comment> => {
  const response = await fetch(`${API_URL}/api/comments`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updateComment = async (commentId: string, content: string): Promise<Comment> => {
  const response = await fetch(`${API_URL}/api/comments/${commentId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ content }),
  });
  return handleResponse(response);
};

export const deleteComment = async (commentId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/api/comments/${commentId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete comment');
  }
};

export const getComments = async (contentId: string) : Promise<Comment[]> => {
  const response = await fetch(`${API_URL}/api/comments/content/${contentId}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete comment');
  }

  return handleResponse(response);
};

export const getUserComments = async (userId: string) : Promise<Comment[]> => {
  const response = await fetch(`${API_URL}/api/comments/user/${userId}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete comment');
  }

  return handleResponse(response);
}