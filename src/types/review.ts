export interface Review {
  id: string;
  userId: string;
  turfId: string;
  rating: number;
  comment: string;
  images?: string[];
  user: {
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ReviewRequest {
  turfId: string;
  rating: number;
  comment: string;
  images?: string[];
}