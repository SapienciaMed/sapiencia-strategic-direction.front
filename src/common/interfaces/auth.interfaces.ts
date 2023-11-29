import { IRole } from "./role.interface";


export interface IAuthorization {
  user: IUser;
  allowedActions: Array<string>;
  allowedApplications: Array<{
    aplicationId: number;
    dateValidity: Date;
  }>;
  encryptedAccess: string;
}

export interface IUser {
  id?: number;
  names: string;
  lastNames: string;
  typeDocument: string;
  numberDocument: string;
  password?: string;
  userModify: string;
  dateModify?: Date;
  userCreate: string;
  dateCreate?: Date;
}

export interface IProfile {
  id?: number;
  userId: number;
  aplicationId: number;
  dateValidity: Date;
  roles: IRole[];
}
