export interface IProblemDescriptionForm {
    problemDescription: string;
    magnitude: string;
    centerProblem: string;
    causes?: ICause[];
    effects?: IEffect[];
}

export interface ICause {
    id?: number;
    consecutive: string;
    description: string;
    childrens?: ICause[];
}

export interface IEffect {
    id?: number;
    consecutive: string;
    description: string;
    childrens?: IEffect[];
}

export interface IRegisterForm {
    id?: number;
    bpin: number;
    project: string;
    dateFrom: string;
    dateTo: string;
    process: string;
    localitation: string;
    dependency: string;
    object: string;
}

export interface IProjectTemp {
    register?: IRegisterForm;
    identification?: {
        problemDescription?: IProblemDescriptionForm;
        planDevelopment?:IPlanDevelopmentForm;
    }

}

export interface IPlanDevelopmentForm {
    id?: number;
    pnd_pacto?: string;
    pnd_linea?: string;
    pnd_programa?: string;
    pdd_linea?: string;
    pdd_componentes?: string;
    pdd_programa?: string;
    pdi_linea?: string;
    pdi_componentes?: string;
    pdi_programa?:string;
}