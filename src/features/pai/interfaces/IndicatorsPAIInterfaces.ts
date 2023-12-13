
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
    firstBimester?: number,
    secondBimester?: number,
    thirdBimester?: number,
    fourthBimester?: number,
    fifthBimester?: number,
    sixthBimester?: number,
    totalPlannedGoal: number;
    products: IProduct[];
    responsibles: IResponsible[];
    coresponsibles: ICoResponsible[];
}

export interface IIndicatorsPAITemp extends IIndicatorsPAI {
    bimesters: IBimester[];
}

export interface IBimester {
    bimester?: string;
    value?: number;
    disaggregate?: IDisaggregate[];
    showDisaggregate?: boolean;
    sumOfPercentage?: number;
}

export interface IDisaggregate {
    id?: number;
    index?: number;
    indexBimester?: number;
    percentage: number,
    description: string;
    totalPercentage?: number;
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