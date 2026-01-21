export interface Genre {
  id: string;
  name: string;
}

export interface GenreCreateRequest
{
    name: string;
}

export interface GenreUpdateRequest
{
    name: string;
}