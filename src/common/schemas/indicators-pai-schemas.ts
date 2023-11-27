import * as yup from "yup";

export const indicatorsPAIValidator = yup.object({
    projectIndicator: yup.number()
    .required("El campo es obligatorio"),
    indicatorType: yup.number()
    .required("El campo es obligatorio"),
    indicatorDesc: yup.string()
    .required("El campo es obligatorio"),
    bimesters: yup.array().required().of(
        yup.object().shape(({
            bimester: yup.string()
            .optional()
            .nullable(),
            value: yup.number()
            .required()
        }))
    ),
    totalPlannedGoal: yup.number()
    .notRequired()
    .nullable(),
    products: yup.array().of(
        yup.object().shape(({
            product: yup.string()
            .required("El campo es obligatorio")
            .max(500, "Solo se permiten 500 caracteres"),
        }))
    ),
    responsibles: yup.array().of(
        yup.object().shape(({
            responsible: yup.string()
            .required("El campo es obligatorio")
            .max(500, "Solo se permiten 500 caracteres"),
        }))
    ),
    coresponsibles: yup.array().of(
        yup.object().shape(({
            coresponsible: yup.string()
            .required("El campo es obligatorio")
            .max(100, "Solo se permiten 100 caracteres"),
        }))
    )
});