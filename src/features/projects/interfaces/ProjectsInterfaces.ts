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

export interface IPosition {
  name: string,
  value: string | number;
}

export interface IActorsForm {
  actors?: IParticipatingActors[];
}

export interface IEffectEnviromentForm {
  id?: number;
  type?: number;
  impact?: string;
  classification?: number;
  level?: number;
  measures?: string;
}

export interface IPoblationForm {
  objectivePeople?: number;
  informationSource?: string;
  region?: number;
  departament?: number;
  district?: number;
  shelter?: string;
  demographic?: IDemographicCharacteristics[];
}

export interface IDemographicCharacteristics {
  id?: number;
  clasification: number;
  detail: number;
  numPerson?: number;
  infoSource?: string;
}

export interface IEstatesService {
  id?: number;
  description: string;
}

export interface ICapacityForm {
  alternativeCapacity?: string;
  descriptionCapacity?: string;
  unitCapacity?: number;
  capacityGenerated?: number;
}

export interface IEnvironmentAnalysisForm {
  environmentDiagnosis?: string;
  effects?: IEffectEnviromentForm[]
}


export interface INeedObjetive {
  id?: number;
  objectiveSelect?: string;
  objetive: ICause;
  interventionActions: string;
  quantification: number;
  estatesService: IEstatesService[];
}

export interface INeedsForm {
  alternative?: string;
  generalObjetive?: string;
  objetives?: INeedObjetive[];
}

export interface ItechnicalAnalysisForm {
  alternative?: string;
  resumeAlternative?: string;
}

export interface IAddRisks {
  id?: number;
  level: number;
  risk:string;
  typeRisk:number;
  descriptionRisk: string;
  probability:number;
  impact:number;
  effects:string;
  mitigation:string;
}

export interface IRisks {
  risks?: IAddRisks[];
}


export interface IprofitsIncome {
  id?: number;
  type: string;
  description: string;
  unit: number;
  period: Iperiod[];
}

export interface ISourceFunding {
  id?: number;
  stage: number;
  typeEntity: number;
  resource: number;
  entity:string;
  year0:number;
  year1:number;
  year2:number;
  year3:number;
  year4:number;
}

export interface IproftisIncomeForm {
  profitsIncome?: IprofitsIncome[];
}

export interface ISourceFundingForm {
  sourceFunding?: ISourceFunding[];
}

export interface Iperiod {
  id?: number;
  period: number;
  quantity:number;
  unitValue:number;
  financialValue:number;
}

export interface IBudgetMGA {
  year0: {
    validity: number;
    budget: number;
  };
  year1: {
    validity: number;
    budget: number;
  };
  year2: {
    validity: number;
    budget: number;
  };
  year3: {
    validity: number;
    budget: number;
  };
  year4: {
    validity: number;
    budget: number;
  };
}

export interface IDetailActivity {
  consecutive: string;
  detailActivity: string;
  component: number;
  measurement: number;
  amount: number;
  unitCost: number;
  totalCost?: string;
  pospre?: number;
  validatorCPC?: string;
  clasificatorCPC?: number;
  sectionValidatorCPC?: string;
}

export interface IActivityMGA {
  objectiveSelect?: string;
  objetiveActivity: ICause;
  stageActivity: number;
  productMGA: string;
  activityMGA: string;
  productDescriptionMGA: string;
  activityDescriptionMGA: string;
  budgetsMGA: IBudgetMGA;
  validity: number;
  year: number;
  detailActivities: IDetailActivity[];
}

export interface IActivitiesForm {
  activities?: IActivityMGA[];
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
    actors?: IActorsForm;
    poblation?: IPoblationForm;
  };
  preparation?: {
    technicalAnalysis?: ItechnicalAnalysisForm
    needs?: INeedsForm
    capacity?: ICapacityForm
    enviromentalAnalysis?: IEnvironmentAnalysisForm
    activities?: IActivitiesForm;
    risks?:IRisks
  }
  programation?:{
    profitsIncome?:IproftisIncomeForm;
    sourceFunding?:ISourceFundingForm;
  }
}

export interface IActivitiesProject {
  objectiveSelect?: string;
  objetiveActivity: ICause;
  stageActivity: number;
  productMGA: string;
  activityMGA: string;
  productDescriptionMGA: string;
  activityDescriptionMGA: string;
  budgetsMGA: {
    id?: number;
    activityId?: number;
    year: number;
    validity: number;
    budget: number;
  }[];
  validity: number;
  year: number;
  detailActivities: IDetailActivity[];
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
  alternative: string | null;
  resumeAlternative: string | null;
  descriptionCapacity: string | null;
  unitCapacity: number | null;
  capacityGenerated: number | null;
  environmentDiagnosis: string | null;
  objectivePeople: number | null;
  informationSource: string | null;
  region: number | null;
  departament: number | null;
  district: number | null;
  shelter: string | null;
  causes: ICause[] | null;
  effects: IEffect[] | null;
  actors: IParticipatingActors[] | null;
  classifications: IDemographicCharacteristics[] | null;
  specificObjectives: INeedObjetive[] | null;
  environmentalEffects: IEffectEnviromentForm[] | null;
  activities: IActivitiesProject[] | null;
  risks:IAddRisks[] | null;
  profitsIncome:IprofitsIncome[] | null;
  sourceFunding:ISourceFunding[] | null;
}
