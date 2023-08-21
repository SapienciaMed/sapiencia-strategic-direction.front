import * as yup from "yup";

export const registerValidator = yup.object({
    bpin: yup
        .string()
        .matches(/^[0-9]+$/, "Solo se permiten números")
        .max(20, "Solo se permiten 20 caracteres")
        .required("El campo es obligatorio"),
    project: yup
        .string()
        .required("El campo es obligatorio")
        .max(80, "Solo se permiten 80 caracteres"),
    dateFrom: yup
        .string()
        .matches(/^[0-9]+$/, "Ingrese un año válido")
        .required("El campo es obligatorio")
        .max(4, "Solo se permiten 4 caracteres"),
    dateTo: yup
        .string()
        .matches(/^[0-9]+$/, "Ingrese un año válido")
        .required("El campo es obligatorio")
        .max(4, "Solo se permiten 4 caracteres"),
    process: yup
        .string()
        .required("Debe Seleccionar una opcion")
        .max(250, "Solo se permiten 250 caracteres"),
    localitation: yup
        .string()
        .required("Debe Seleccionar una opcion")
        .max(250, "Solo se permiten 250 caracteres"),
    dependency: yup
        .string()
        .required("Debe Seleccionar una opcion")
        .max(250, "Solo se permiten 250 caracteres"),
    object: yup
        .string()
        .required("El campo es obligatorio")
        .max(500, "Solo se permiten 500 caracteres"),
});

export const problemDescriptionValidator = yup.object({
    problemDescription: yup.string().required("El campo es obligatorio"),
    magnitude: yup.string().required("El campo es obligatorio"),
    centerProblem: yup.string().required("El campo es obligatorio"),
});

export const causesEffectsValidator = yup.object({
    consecutive: yup.string().required("El campo es obligatorio"),
    description: yup.string().required("El campo es obligatorio").max(300),
    childrens: yup.array().required("Se necesita al menos una causa").min(1, "Se necesita al menos una causa").of(
        yup.object().shape({
            consecutive: yup.string().required("El campo es obligatorio"),
            description: yup.string().required("El campo es obligatorio").max(300),
        })
    ),
});