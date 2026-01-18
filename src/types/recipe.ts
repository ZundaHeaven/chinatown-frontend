export enum RecipeDifficulty {
  Easy = 1,
  Medium = 2,
  Hard = 3,
  Expert = 4
}

export interface RegionDto {
  id: string;
  name: string;
}

export interface RecipeTypeDto {
  id: string;
  name: string;
}

export interface RecipeDto {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  difficulty: RecipeDifficulty;
  ingredients: string;
  instructions: string;
  cookTimeMinutes: number;
  imageId: string;
  authorId: string;
  authorName: string;
  likesCount: number;
  commentsCount: number;
  createdOn: Date;
  modifiedOn: Date;
  recipeTypeClaims: RecipeTypeDto[];
  recipeRegions: RegionDto[];
}