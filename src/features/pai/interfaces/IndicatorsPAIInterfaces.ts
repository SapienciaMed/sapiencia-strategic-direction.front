
import { IDropdownProps } from "../../../common/interfaces/select.interface";

export interface IPAIIndicatorType extends IDropdownProps {
    name: "Número" | "Porcentaje" | "A demanda";
}

export interface IPAI {
    PAIType: "project" | "process";
    indicators: IIndicatorsPAI[];
}

export interface IIndicatorsPAI {
    id?: number;
    projectIndicator: number;
    indicatorType: number;
    indicatorDesc: string;
    bimesters: IBimester[];
    totalPlannedGoal: number;
    products: IProducts[];
    responsibles: IResponsible[];
    coresponsibles: ICoResponsible[];
}

export interface IBimester {
    bimester?: string;
    value: number;
}

export interface IProducts {
    id?: number;
    product: string;
}

export interface IResponsible {
    id?: number;
    responsible: string;
}

export interface ICoResponsible {
    id?: number;
    coresponsible: string;
}