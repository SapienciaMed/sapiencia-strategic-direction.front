export interface IProblemDescriptionForm {
    problemDescription?: string;
    magnitude?: string;
    centerProblem?: string;
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

export interface IObjectivesForm {
    generalObjective?: string;
    specificObjectives?: ICause[];
    purposes?: IEffect[];
    indicators?: string;
    measurement?: number;
    goal?: number;
}

export interface IRegisterForm {
    bpin?: number;
    project?: string;
    dateFrom?: string;
    dateTo?: string;
    process?: number;
    localitation?: number;
    dependency?: number;
    object?: string;
}

export interface IPlanDevelopmentForm {
    pnd_pacto?: string;
    pnd_linea?: string;
    pnd_programa?: string;
    pdd_linea?: string;
    pdd_componentes?: string;
    pdd_programa?: string;
    pdi_linea?: string;
    pdi_componentes?: string;
    pdi_programa?: string;
}


export interface IParticipatingActors {
    id?: number;
    actor: string;
    expectation: string;
    position: string;
    contribution: string;
}

export interface IActorsForm {
    actors?: IParticipatingActors[];
}

export interface IEstatesService {
    id?: number;
    description: string;
}

export interface INeedObjetive {
    id?: number;
    objectiveSelect: string;
    objetive: ICause;
    interventionActions: string;
    quantification: number;
    estatesService: IEstatesService[];
}

export interface INeedsForm {
    alternative?: string;
    generalObjetive?: string;
    objetives: INeedObjetive[];
}

export interface IProjectTemp {
    id?: number;
    register?: IRegisterForm;
    identification?: {
        problemDescription?: IProblemDescriptionForm;
        planDevelopment?: IPlanDevelopmentForm;
        objectives?: IObjectivesForm;
        actors?: IActorsForm;
    };
    preparation?: {
        needs?: INeedsForm
    }
}

export interface IProject {
    id: number;
    bpin: number | null;
    project: string | null;
    dateFrom: string | null;
    dateTo: string | null;
    process: number | null;
    dependency: number | null;
    pnd_pacto: string | null;
    pnd_linea: string | null;
    pnd_programa: string | null;
    pdd_linea: string | null;
    pdd_componentes: string | null;
    pdd_programa: string | null;
    pdi_linea: string | null;
    pdi_componentes: string | null;
    pdi_programa: string | null;
    problemDescription: string | null;
    magnitude: string | null;
    centerProblem: string | null;
    indicators: string | null;
    measurement: string | null;
    goal: number | null;
    causeId: number | null;
    effectId: number | null;
    causes: ICause | null;
    effects: IEffect | null;
}
