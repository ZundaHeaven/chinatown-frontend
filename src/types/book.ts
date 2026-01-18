import { ContentStatus } from "./common";

export interface GenreDto {
  id: string;
  name: string;
}

export interface BookDto {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  authorName: string;
  description: string;
  pageAmount: number;
  yearOfPublish: number;
  fileSizeBytes: number;
  createdOn: Date;
  modifiedOn: Date;
  genres: GenreDto[];
  coverFileId: string;
  bookFileId: string;
  contentStatus: string;
  userId: string;
  username: string;
  likesCount: number;
  commentsCount: number;
}