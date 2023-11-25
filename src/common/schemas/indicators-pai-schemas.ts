import * as yup from "yup";

export const indicatorsPAIValidator = yup.object({
    projectIndicator: yup.number()
    .required("El campo es obligatorio"),
    indicatorType: yup.number()
    .required("El campo es obligatorio"),
    indicatorDesc: yup.string()
    .required("El campo es obligatorio"),
    firstBimester: yup.number()
    .required("El campo es obligatorio"),
    secondBimester: yup.number()
    .required("El campo es obligatorio"),
    thirdBimester: yup.number()
    .required("El campo es obligatorio"),
    fourthBimester: yup.number()
    .required("El campo es obligatorio"),
    fifthBimester: yup.number()
    .required("El campo es obligatorio"),
    sixthBimester: yup.number()
    .required("El campo es obligatorio"),
    totalPlannedGoal: yup.number()
    .notRequired()
    .nullable(),
    bimesters: yup.array().required().of(
        yup.object().shape(({
            ref: yup.string()
            .optional()
            .nullable(),
            value: yup.number()
            .required()
        }))
    ),
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