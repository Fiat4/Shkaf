import ApiResponse from "./ApiResponse";

export interface IOrganizationReviewForm {
    username: string
    email: string
    review: string
    rating: number
}

export interface IProductReviewForm {
  userName: string;
  email: string;
  rating: number;
  review: string;
  avatar?: FileList | null;
  imgs?: FileList | null;
}


export type IReview = {
  id: string;
  username: string;
  rating: number;
  email: string;
  review: string;
  avatar: string | null;
  imgs: string[];
  created_at: string;
  updated_at: string;
  organization: boolean;
  productId: string | null;
};

export type ReviewsResponse = ApiResponse<IReview>