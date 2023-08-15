import * as yup from "yup";

export const problemDescriptionValidator = yup.object({
    Prueba1: yup.string().required("El campo es obligatorio"),
    Prueba2: yup.string().required("El campo es obligatorio"),
});