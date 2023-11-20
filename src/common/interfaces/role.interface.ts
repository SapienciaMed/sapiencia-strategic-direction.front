import { DateTime } from "luxon";
import { IActions } from "./options.interface";
import { IProfile } from "./auth.interfaces";

export interface IRole {
    id?: number;
    name: string;
    description: string;
    aplicationId: number;
    userModify?: string;
    dateModify?: Date;
    userCreate?: string;
    dateCreate?: DateTime;

    actions?: IActions[];
    aplications?: {
        id?: number;
        name?: string;
        url?: string;
        showInHome?: boolean;
        order?: number;  
    };
    profiles?: IProfile[];
}

export interface IRoleFilters {
    page: number;
    perPage: number;
    name?: string;
}

export interface IRequestRole {
    nombreRol: string;
    descripcionRol: string;
    accionesRol: object;
}