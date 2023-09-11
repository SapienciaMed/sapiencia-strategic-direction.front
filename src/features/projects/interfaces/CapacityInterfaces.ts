export interface IRegisterForm {
    id?: number;
    alternativa: number;
    descripcion: string;
    unidad: string;
    capacidad: string;
}

export interface ICapacityForm {
    alternative?: string;
    description?: string;
    unit?: string;
    capacity?: string;
}


export interface IProjectTemp {
    register?: IRegisterForm;
}