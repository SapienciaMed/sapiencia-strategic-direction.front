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
        .test("dateFrom", "El periodo inicial debe ser anterior al periodo final", function (value) {
            const { dateTo } = this.parent;
            if (!dateTo || !value) {
                return true;
            }
            return parseInt(value, 10) <= parseInt(dateTo, 10);
        })
        .matches(/^[0-9]+$/, "Ingrese un año válido")
        .required("El campo es obligatorio")
        .max(4, "Solo se permiten 4 caracteres"),
    dateTo: yup
        .string()
        .required("El campo es obligatorio")
        .max(4, "Solo se permiten 4 caracteres")
        .test("dateTo", "El periodo final debe ser posterior al periodo inicial", function (value) {
            const { dateFrom } = this.parent;
            if (!dateFrom || !value) {
                return true;
            }
            return parseInt(value, 10) >= parseInt(dateFrom, 10);
        })
        .matches(/^[0-9]+$/, "Ingrese un año válido"),
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
    problemDescription: yup.string().required("El campo es obligatorio").max(800, "Solo se permiten 800 caracteres"),
    magnitude: yup.string().required("El campo es obligatorio").max(500, "Solo se permiten 500 caracteres"),
    centerProblem: yup.string().required("El campo es obligatorio").max(300, "Solo se permiten 300 caracteres"),
});

export const effectsValidator = yup.object({
});

export const causesValidator = yup.object({
    consecutive: yup.string().required("El campo es obligatorio"),
    description: yup.string().required("El campo es obligatorio").max(300, "Solo se permiten 300 caracteres"),
    childrens: yup.array().required("La causa directa debe tener mínimo una causa indirecta agregada").min(1, "La causa directa debe tener mínimo una causa indirecta agregada").of(
        yup.object().shape({
            consecutive: yup.string().required("El campo es obligatorio"),
            description: yup.string().required("El campo es obligatorio").max(300, "Solo se permiten 300 caracteres"),
        })
    ),
});

export const planDevelopmentValidator = yup.object({
    pnd_pacto: yup
        .string()
        .max(500, "Solo se permiten 500 caracteres")
        .required("El campo es obligatorio"),
    pnd_linea: yup
        .string()
        .required("El campo es obligatorio")
        .max(500, "Solo se permiten 500 caracteres"),
    pnd_programa: yup
        .string()
        .required("El campo es obligatorio")
        .max(500, "Solo se permiten 500 caracteres"),
    pdd_linea: yup
        .string()
        .required("El campo es obligatorio")
        .max(500, "Solo se permiten 500 caracteres"),
    pdd_componentes: yup
        .string()
        .required("El campo es obligatorio")
        .max(500, "Solo se permiten 500 caracteres"),
    pdd_programa: yup
        .string()
        .required("Debe Seleccionar una opcion")
        .max(500, "Solo se permiten 500 caracteres"),
    pdi_linea: yup
        .string()
        .required("El campo es obligatorio")
        .max(500, "Solo se permiten 500 caracteres"),
    pdi_componentes: yup
        .string()
        .required("El campo es obligatorio")
        .max(500, "Solo se permiten 500 caracteres"),
    pdi_programa: yup
        .string()
        .required("El campo es obligatorio")
        .max(500, "Solo se permiten 500 caracteres"),
});

export const capacityValidator = yup.object({
    description: yup
        .string()
        .max(600, "Solo se permiten 600 caracteres")
        .required("El campo es obligatorio"),
    unit: yup
        .string()
        .required("El campo es obligatorio"),
    capacity: yup.number().transform((value) => Number.isNaN(value) ? null : value ).nullable().required("El campo es obligatorio")
});


export const actorsFormValidator = yup.object({ 
    actor : yup 
    .string()
    .required("El campo es obligatorio")
    .max(100, "Solo se permiten 100 caracteres"),
    expectation: yup  
    .string()
    .required("El campo es obligatorio")
    .max(300, "Solo se permiten 300 caracteres"),
    position: yup
    .string()
    .required("Debe seleccionar una opción"),
    contribution: yup  
    .string()
    .required("El campo es obligatorio")
    .max(300, "Solo se permiten 300 caracteres"),
});

export const actorsValidator = yup.object({
    actors: yup.array().required("El campo es obligatorio").min(1, "El campo es obligatorio"),
});

export const objectivesValidator = yup.object({
    generalObjective: yup.string().required("El campo es obligatorio").max(300, "Solo se permiten 300 caracteres"),
    specificObjectives: yup.array().required("El campo es obligatorio").min(1, "El campo es obligatorio"),
    purposes: yup.array().required("El campo es obligatorio").min(1, "El campo es obligatorio"),
    indicators: yup.string().required("El campo es obligatorio").max(500, "Solo se permiten 500 caracteres"),
    measurement: yup.string().required("El campo es obligatorio"),
    goal: yup.number().transform((value) => Number.isNaN(value) ? null : value ).nullable().required("El campo es obligatorio")
});

export const needsValidator = yup.object({
    objetives: yup.array().required("El campo es obligatorio").min(1, "El campo es obligatorio")
});

export const needsObjectivesValidator = yup.object({
    objectiveSelect: yup.string().required("El campo es obligatorio"),
    interventionActions: yup.string().required("El campo es obligatorio").max(300, "Solo se permiten 300 caracteres"),
    quantification: yup.number().transform((value) => Number.isNaN(value) ? null : value ).nullable().required("El campo es obligatorio").min(0, "El número tiene que ser positivo"),
    estatesService: yup.array().required("Debe haber al menos un bien y/o servicio").min(1, "Debe haber al menos un bien y/o servicio").of(
        yup.object().shape({
            description: yup.string().required("El campo es obligatorio").max(300, "Solo se permiten 300 caracteres"),
        })
    ),
});


