import { IDropdownProps } from "../../../common/interfaces/select.interface"

export const generalFieldsData: IDropdownProps[] = [
    {
        value: "yearPAI",
        name: "Año del plan de acción institucional"
    },
    {
        value: "budgetPAI",
        name: "Presupuesto"
    },
    {
        value: "namePAI",
        name: "Nombre proyecto/proceso"
    },
    {
        value: "objectivePAI",
        name: "Objetivo"
    },
    {
        value: "articulationPAI",
        name: "Articulación Plan de Desarrollo Distrital"
    }
]

export const indicatorFieldsData: IDropdownProps[] = [
    {
        value: "description",
        name: "Descripción de la Acción"
    },
    {
        value: "projectIndicator || indicatorDesc",
        name: "Indicador proyecto/Descripción indicador"
    },
    {
        value: "indicatorType",
        name: "Tipo indicador"
    },
    {
        value: "bimesters.0",
        name: "Bimestre 1"
    },
    {
        value: "bimesters.1",
        name: "Bimestre 2"
    },
    {
        value: "bimesters.2",
        name: "Bimestre 3"
    },
    {
        value: "bimesters.3",
        name: "Bimestre 4"
    },
    {
        value: "bimesters.4",
        name: "Bimestre 5"
    },
    {
        value: "bimesters.5",
        name: "Bimestre 6"
    },
    {
        value: "totalPlannedGoal",
        name: "Meta total planeada"
    },
    {
        value: "bimesters.0.disaggregate",
        name: "Desagregación bimestre 1"
    },
    {
        value: "bimesters.1.disaggregate",
        name: "Desagregación bimestre 2"
    },
    {
        value: "bimesters.2.disaggregate",
        name: "Desagregación bimestre 3"
    },
    {
        value: "bimesters.3.disaggregate",
        name: "Desagregación bimestre 4"
    },
    {
        value: "bimesters.4.disaggregate",
        name: "Desagregación bimestre 5"
    },
    {
        value: "bimesters.5.disaggregate",
        name: "Desagregación bimestre 6"
    }
]

export const typePAIData: IDropdownProps[] = [
    {
        name: "Proyecto",
        value: 1
    },
    {
        name: "Proceso",
        value: 2
    },
];