
import { IDropdownProps } from "../../../common/interfaces/select.interface";

export interface IPAIIndicatorType extends IDropdownProps {
    id?: number;
    description?: "Número" | "Porcentaje" | "A demanda";
}

export interface IPAI {
    PAIType: "project" | "process";
    indicators: IIndicatorsPAI[];
}

export interface IIndicatorsPAI {
    id?: number;
    actionId?: number;
    typePAI?: number;
    projectIndicator?: number;
    indicatorType: number;
    indicatorDesc?: string;
    bimesters: IBimester[];
    totalPlannedGoal: number;
    products: IProduct[];
    responsibles: IResponsible[];
    coresponsibles: ICoResponsible[];
}

export interface IBimester {
    bimester?: string;
    value: number;
}

export interface IProduct {
    id?: number;
    idIndicatorPAI?: number;
    product: string;
}

export interface IResponsible {
    id?: number;
    idIndicatorPAI?: number;
    responsible: string;
}

export interface ICoResponsible {
    id?: number;
    idIndicatorPAI?: number;
    coresponsible: string;
}