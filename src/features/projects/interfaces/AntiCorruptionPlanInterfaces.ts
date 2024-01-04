export interface IAntiCorruptionPlan {
  id: number;
  name: string;
  date: string;
  status: number;
  year: string;
}

export interface IResponsible {
  uuid?: string;
  name?: string;
  indicator_uuid: string
}

export interface IIndicator {
  uuid: string;
  description?: string;
  quarterly_goal1?: number;
  unit1?: string;
  quarterly_goal2?: number;
  unit2?: string;
  quarterly_goal3?: number;
  unit3?: string;
  activity_uuid: string;
}

export interface IActivity {
  uuid: string;
  description: string;
  component_uuid: string
}

export interface IComponent {
  index: number;
  uuid: string;
  description: string;
  plan_uuid: string;
}

export interface ICreate {
  name: string;
  date: string;
  status: number;
  year: string;
  components?: IComponent[];
}

export interface IAntiCorruptionPlanTemp {
  id?: number;
  name: string;
  date: string;
  status: number;
  year: string;
}

export interface IAntiCorruptionPlanFields {
  year: number;
  component_desc: string;
  activity_description;
  indicator_description
}