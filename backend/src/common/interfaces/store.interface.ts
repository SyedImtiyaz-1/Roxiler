export interface IStore {
  id: string;
  name: string;
  address: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStoreWithOwner extends IStore {
  owner: IUser;
}

export interface IStoreWithRatings extends IStore {
  ratings: IRating[];
  _count: {
    ratings: number;
  };
  _avg: {
    ratingValue: number | null;
  };
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  address: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRating {
  id: string;
  ratingValue: number;
  userId: string;
  storeId: string;
  createdAt: Date;
  updatedAt: Date;
} 