import { ContentStatus } from "./common";
import { RecipeType } from "./recipe-type";
import { Region } from "./region";

export enum RecipeDifficulty {
  Easy = 1,
  Medium = 2,
  Hard = 3,
  Expert = 4
}

export interface Recipe {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  difficulty: RecipeDifficulty;
  ingredients: string;
  instructions: string;
  cookTimeMinutes: number;
  imageId: string;
  userId: string;
  username: string;
  status: ContentStatus;
  likesCount: number;
  commentsCount: number;
  createdOn: Date;
  modifiedOn: Date;
  recipeTypes: RecipeType[];
  regions: Region[];
}

export interface RecipeCreateRequest {
  title: string;
  difficulty: RecipeDifficulty;
  ingredients: string;
  instructions: string;
  cookTimeMinutes: number;
  recipeTypeIds: string[];
  regionIds: string[];
}

export interface RecipeFilter {
  title: string | null;
  recipeDifficulty: RecipeDifficulty | null;
  recipeTypeIds: string[] | null;
  regionIds: string[] | null;
  cookTimeMin: number | null;
  cookTimeMax: number | null;
  available: boolean | null;
  sort: 'cooktime_asc' | 'cooktime_desc' | 'difficulty_asc' | 'difficulty_desc' | 'created_desc' |  null;
}

export interface RecipeUpdateRequest {
  title: string;
  difficulty: RecipeDifficulty;
  ingredients: string;
  instructions: string;
  status: ContentStatus;
  cookTimeMinutes: number;
  recipeTypeIds: string[];
  regionIds: string[];
}