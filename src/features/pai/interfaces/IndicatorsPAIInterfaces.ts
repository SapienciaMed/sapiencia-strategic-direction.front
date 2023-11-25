
import { IDropdownProps } from "../../../common/interfaces/select.interface";

export interface IPAIIndicatorType extends IDropdownProps {
    name: "Número" | "Porcentaje" | "A demanda";
}

export interface IIndicatorsPAI {
    id?: number;
    projectIndicator: number;
    indicatorType: number;
    indicatorDesc: string;
    firstBimester: number;
    secondBimester: number;
    thirdBimester: number;
    fourthBimester: number;
    fifthBimester: number;
    sixthBimester: number;
    totalPlannedGoal: number;
    bimesters: IBimester[];
    products: IProducts[];
    responsibles: IResponsible[];
    coresponsibles: ICoResponsible[];
}

export interface IBimester {
    ref?: string;
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