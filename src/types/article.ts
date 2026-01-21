import { ContentStatus } from "./common";

export interface Article 
{
  id : string;
  title : string;
  slug: string;
  excerpt: string;
  body: string;
  readingTimeMinutes: number;
  status: ContentStatus;
  articleType: string;
  articleTypeId: string;
  authorId: string;
  authorName: string;
  likesCount: number;
  commentsCount: number;
  createdOn: Date;
  modifiedOn: Date;
}

export interface ArticleCreateRequest
{
  title: string;
  body: string;
  excerpt: string;
  articleTypeId: string;
  readingTimeMinutes: number;
}

export interface ArticleUpdateRequest
{
  title: string;
  body: string;
  excerpt: string;
  articleTypeId: string;
  readingTimeMinutes: number;
  status: ContentStatus;
}

export interface ArticleFilter
{
  search: string | null;
  type: string | null;
  authorId: string | null;
  sort: "oldest" | "most_liked" | "most_commented" | null;
  status: ContentStatus | null;
}