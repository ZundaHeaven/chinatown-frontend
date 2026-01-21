import { ContentStatus } from "./common";
import { Genre } from "./genre";

export interface Book {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  authorName: string;
  pageAmount: number;
  yearOfPublish: number;
  description: string;
  fileSizeBytes: number;
  createdOn: Date;
  modifiedOn: Date;
  genres: Genre[];
  coverFileId: string;
  bookFileId: string;
  status: ContentStatus;
  userId: string;
  username: string;
  likesCount: number;
  commentsCount: number;
}

export interface BookCreateRequest
{
  title: string;
  authorName: string;
  pageAmount: string;
  yearOfPublish: number;
  genreIds: string[];
  description: string;
}

export interface BookUpdateRequest
{
  title: string;
  authorName: string;
  status: string
  pageAmount: string;
  yearOfPublish: number;
  genreIds: string[];
  description: string;
}


export interface BookFilter
{
  title: string | null;
  authorName: string | null;
  genreIds: string[];
  yearMin: number | null;
  yearMax: number | null;
  available: boolean | null;
  sort: 'year_desc' | 'year_asc' | 'created_desc' | null;
}