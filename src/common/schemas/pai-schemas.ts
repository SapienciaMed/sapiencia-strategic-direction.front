import * as yup from "yup";

export const CreatePAIValidator = yup.object({
    yearPAI: yup.number().required("Debe seleccionar una opción"),
    budgetPAI: yup.number().required("El campo es obligatorio"),
    typePAI: yup.number().required("Debe seleccionar una opción"),
    namePAI: yup.number().required("Debe seleccionar una opción"),
    actionsPAi: yup.array().of(
        yup.object().shape(({
            action: yup.number()
            .notRequired()
            .nullable(),
            description: yup.string()
            .notRequired()
            .nullable()
        }))
    ),
    objectivePAI: yup.string().required("El campo es obligatorio"),
    articulationPAI: yup.string().required("El campo es obligatorio").max(200, "Solo se permiten 200 caracteres"),
    selectedRisk: yup.number().required("Debe seleccionar una opción"),
});

export const revisionPAIValidator = yup.object({
    field: yup.string().required("Debe seleccionar una opción"),
    observations: yup.string().required("El campo es obligatorio").max(5000, "Solo se permiten 5000 caracteres"),
});

export const approvePAIValidator = yup.object({
    approved: yup.boolean().required("Debes seleccionar una opción"),
    comments: yup.string().required("El campo es obligatorio").max(5000, "Solo se permiten 5000 caracteres")
});