import * as yup from "yup";

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