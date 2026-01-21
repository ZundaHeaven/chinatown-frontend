import { Article } from "@/types/article";
import { Book } from "@/types/book";
import { Like } from "@/types/common";
import { Recipe } from "@/types/recipe";

export interface ArticleWithDetails extends Article {
  comments: Comment[];
  likes: Like[];
  userHasLiked: boolean;
}

export interface BookWithDetails extends Book {
  comments: Comment[];
  likes: Like[];
  userHasLiked: boolean;
}

export interface RecipeWithDetails extends Recipe {
  comments: Comment[];
  likes: Like[];
  userHasLiked: boolean;
}
