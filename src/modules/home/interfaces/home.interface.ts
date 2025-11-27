import {
  INamedModelAttribute,
  IUUIDModelAttribute,
} from '../../../common/models/interfaces/named-model.attribute.interface';
import { Home, HomeContact, HomeCoverPhoto, HomeType } from '../models';
import { HomeStatus } from '../enums/home-status.enum';
import { AuthUser } from '../../auth-user/models/auth.user.model';
import { HomeContactType } from '../enums/home-contact-type.enum';
import { HasMany } from 'sequelize-typescript';

export interface IHomeType extends INamedModelAttribute {
  uuid?: string;
  name: string;
  description?: string | null;
}

export interface IHome extends IUUIDModelAttribute {
  typeId?: number | null;
  name: string;
  briefDescription: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  lat: number;
  lng: number;

  logoUrl?: string;
  landmark?: string;
  websiteUrl?: string;
  status?: HomeStatus;
  createdById?: number;
  walletBalance?: number;
  uuid?: string;
  foundedAt?: string;
  type?: HomeType;
  createdBy?: AuthUser;
  coverPhotos?: HomeCoverPhoto[];
  contacts?: HomeContact[];
}

export interface IHomeCoverPhoto extends IUUIDModelAttribute {
  homeId: number;
  imageUrl: string;
  home?: Home;
}

export interface IHomeAdmin extends IUUIDModelAttribute {
  homeId: number;
  authUserId: number;
  isCreator: boolean;

  authUser?: AuthUser;
  home?: Home;
}

export interface IHomeContact extends IUUIDModelAttribute {
  homeId: number;
  type: HomeContactType;
  value: string;

  home?: Home;
}
