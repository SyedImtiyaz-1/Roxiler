export interface IRating {
  id: string;
  ratingValue: number;
  userId: string;
  storeId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRatingWithUser extends IRating {
  user: IUser;
}

export interface IRatingWithStore extends IRating {
  store: IStore;
}

export interface IRatingWithUserAndStore extends IRating {
  user: IUser;
  store: IStore;
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

export interface IStore {
  id: string;
  name: string;
  address: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
} 