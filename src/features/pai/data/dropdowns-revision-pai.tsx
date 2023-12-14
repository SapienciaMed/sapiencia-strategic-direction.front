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