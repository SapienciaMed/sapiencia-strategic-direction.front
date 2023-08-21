import * as yup from "yup";

export const ProjectsValidator = yup.object({});

export const ProjectsCreateValidator = yup.object({
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
    Object: yup
        .string()
        .required("El campo es obligatorio")
        .max(500, "Solo se permiten 500 caracteres"),
});