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


