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
    
}

export interface IProjectTemp {
    register?: IRegisterForm;
    identification?: {
        problemDescription?: IProblemDescriptionForm;
    }
}