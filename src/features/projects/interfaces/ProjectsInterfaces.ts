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
    }
}