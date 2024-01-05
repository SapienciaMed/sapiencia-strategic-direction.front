import * as yup from "yup";

export const antiCorruptionPlanValidator = yup.object({
    year: yup.number().required("El año es obligatorio"),
    component_desc: yup.string().required("El campo es obligatorio")
});

export const antiCorruptionPlanActivityValidator = yup.object({
    description: yup.string().required(),
});


export const antiCorruptionPlanIndicatorValidator = yup.object({
    description: yup.string().required(),
    quarterly_goal1: yup.string().required(),
    unit1: yup.string().required(),
    quarterly_goal2: yup.string().required(),
    unit2: yup.string().required(),
    quarterly_goal3: yup.string().required(),
    unit3: yup.string().required(),
});

