import { ITableElement } from "../../../common/interfaces/table.interfaces";

export interface IRegisterForm {
    id?: string;
    diagnosis: string;
    effects: IFfectRegister[]
}

export interface IFfectRegister {
    id?: string;
    type: string;
    impact: string;
    classification: string;
    level: string;
    measures: string;
}

export interface IFfectForm {
    id?: string;
    type?: string;
    impact?: string;
    classification?: string;
    level?: string;
    measures?: string;
}

export interface IEnvironmentAnalysisForm {
    id?: string;
    diagnosis: string;
    effects: IFfectForm[]
}


export interface IProjectTemp {
    register?: IRegisterForm;
}

export const effectsColumns: ITableElement<IFfectForm>[] = [
    {
        fieldName: "type",
        header: "Tipo de impacto",
    },
    {
        fieldName: "impact",
        header: "Impacto",
    },
    {
        fieldName: "level",
        header: "Nivel de impacto",
    },
    {
        fieldName: "classification",
        header: "Clasificación",
    },
    {
        fieldName: "measures",
        header: "Medidas de mitigación",
    },
];
