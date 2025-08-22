import { IStore } from './store.interface';
import { IRating } from './rating.interface';

export interface IUser {
  id: string;
  name: string;
  email: string;
  address: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserWithStores extends IUser {
  ownedStores: IStore[];
}

export interface IUserWithRatings extends IUser {
  ratings: IRating[];
} 