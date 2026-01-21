
export interface ArticleType
{
  id : string;
  name : string;
  createdOn: Date;
  modifiedOn: Date;
}

export interface ArticleTypeCreateRequest
{
  name : string;
}

export interface ArticleTypeUpdateRequest
{
  name : string;
}