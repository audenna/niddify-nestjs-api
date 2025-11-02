export interface IUser {
  authUserId: number;
  latitude?: number | null;
  longitude?: number | null;
  dateOfBirth?: string | null;
}

export interface IUserFavourite {
  restaurantId: number;
  authUserId: number;
}
