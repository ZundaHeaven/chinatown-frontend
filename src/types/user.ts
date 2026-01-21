export interface User {
  id: string;
  username: string;
  email: string;
  avatarId: string | null;
  role: string;
  createdOn: Date;
  modifiedOn: Date;
}

export interface UserUpdateRequest {
  username: string;
  email: string;
}

export interface AvatarUpdateRequest {
    avatarFile: File;
}