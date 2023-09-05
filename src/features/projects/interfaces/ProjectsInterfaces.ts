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
    bpin?: string;
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
    position: number;
    contribution: string;
}

export interface IActorsForm {
    actors?: IParticipatingActors[];
}


export interface IDemographicCharacteristics{
    id?:number;
    clasification?:number;
    detail?:number;
    numPerson?:number;
    InfoSource?:string;
}


export interface IPoblationForm{
    objectivePeople:string;
    informationSource:string;
    region:number;
    departament:number;
    district:number;
    shelter:string;
    demographic:IDemographicCharacteristics[];
}


export interface IDemographicCharacteristics{
    id?:number;
    clasification?:number;
    detail?:number;
    numPerson?:number;
    InfoSource?:string;
}


export interface IPoblationForm{
    objectivePeople:string;
    informationSource:string;
    region:number;
    departament:number;
    district:number;
    shelter:string;
    demographic:IDemographicCharacteristics[];
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
    user: string;
    status: boolean;
    register?: IRegisterForm;
    identification?: {
        problemDescription?: IProblemDescriptionForm;
        planDevelopment?: IPlanDevelopmentForm;
        objectives?: IObjectivesForm;
        actors?:IActorsForm;
        poblation?:IPoblationForm;
        
    };
    preparation?: {
        needs?: INeedsForm
    }
}

export interface IProject {
    id: number;
    user: string;
    status: boolean;
    bpin: string | null;
    project: string | null;
    dateFrom: string | null;
    dateTo: string | null;
    process: number | null;
    localitation?: number;
    dependency: number | null;
    object?: string;
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
    measurement: number | null;
    goal: number | null;
    causes: ICause[] | null;
    effects: IEffect[] | null;
    actors: IParticipatingActors[] | null;
  }
