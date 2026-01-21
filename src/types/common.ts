export type ContentStatus = 'Draft' | 'Published' | 'Archived';


export type ContentType = 'articles' | 'recipes' | 'books';

export interface Comment
{
  id: string;
  text: string;
  userId: string;
  username: string;
  avatarId: string;
  contentType: ContentType;
  contentId: string;
  createdOn: Date;
  modifiedOn: Date;
}

export interface CommentAdd
{
  contentId: string;
  content: string
}

export interface Like
{
  id: string;
  userId: string;
  username: string;
  contentType: string;
  contentId: string;
  createdOn: Date;
  modifiedOn: Date;
  slug: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  status: ContentStatus;
}
