

export interface IActionPlanFiltersPaginated {
    page: number;
    perPage: number;
    yearPAI?: number;
    namePAI?: string;
    status?: number;
  }

export interface IActionPlanFilters {
  yearPAI?: number;
  namePAI?: string;
  status?: number;
  }