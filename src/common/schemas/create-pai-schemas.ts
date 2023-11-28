import * as yup from "yup";

export const CreatePAIValidator = yup.object({
    yearPAI: yup.number().required("Debe seleccionar una opcion"),
    budgetPAI: yup.number().required("Debe seleccionar una opcion"),
    typePAI: yup.number().required("Debe seleccionar una opcion"),
    namePAI: yup.number().required("Debe seleccionar una opcion"),
    objectivePAI: yup.string().required("El campo es obligatorio"),
    articulationPAI: yup.string().required("El campo es obligatorio").max(200, "Solo se permiten 200 caracteres"),
    selectedRisk: yup.number().required("Debe seleccionar una opcion"),
});