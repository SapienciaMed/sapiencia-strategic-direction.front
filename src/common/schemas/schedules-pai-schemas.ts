import * as yup from "yup";

export const schedulePAIValidator = yup.object({
    idRol: yup.number().required("El campo es obligatorio"),
    idStatus: yup.number().required("El campo es obligatorio"),
    bimester: yup.number().required("El campo es obligatorio"),
    startDate: yup.string().required("El campo es obligatorio"),
    endDate: yup.string().required("El campo es obligatorio"),
});