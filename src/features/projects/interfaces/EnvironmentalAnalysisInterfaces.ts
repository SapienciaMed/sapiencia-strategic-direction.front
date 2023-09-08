
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
    type?: string | number;
    impact?: string;
    classification?: string | number;
    level?: string | number;
    measures?: string;
}

export interface IEnvironmentAnalysisForm {
    diagnosis: string;
    effects: IFfectForm[]
}
