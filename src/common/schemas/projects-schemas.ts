import * as yup from "yup";

export const registerValidator = yup.object({
    bpin: yup
        .string()
        .transform((value) => Number.isNaN(value) ? null : value ).nullable().required("El campo es obligatorio")
        .test('len', "Solo se permiten 20 caracteres", val => val.length <= 20),
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
    consecutive: yup.string().required("El campo es obligatorio"),
    description: yup.string().required("El campo es obligatorio").max(300, "Solo se permiten 300 caracteres"),
    childrens: yup.array().required("El efecto directo debe tener mínimo un efecto indirecto agregado").min(1, "El efecto directo debe tener mínimo un efecto indirecto agregado").of(
        yup.object().shape({
            consecutive: yup.string().required("El campo es obligatorio"),
            description: yup.string().required("El campo es obligatorio").max(300, "Solo se permiten 300 caracteres"),
        })
    ),
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
    descriptionCapacity: yup
        .string()
        .max(600, "Solo se permiten 600 caracteres")
        .required("El campo es obligatorio"),
    unitCapacity: yup
        .string()
        .required("El campo es obligatorio"),
    capacityGenerated: yup.number().transform((value) => Number.isNaN(value) ? null : value ).nullable().required("El campo es obligatorio")
});

export const environmentalFffectsValidator = yup.object({
    impact: yup
        .string().optional()
        .max(300, "Solo se permiten 300 caracteres"),
    measures: yup
        .string().optional()
        .max(500, "Solo se permiten 500 caracteres"),
});

export const environmentalAnalysisValidator = yup.object({
    diagnosis: yup
        .string().optional()
        .max(600, "Solo se permiten 600 caracteres"),

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
        yup.object(({
            description: yup.string().required("El campo es obligatorio").max(300, "Solo se permiten 300 caracteres"),
        }))
    ),
});

export const poblationValidator = yup.object().shape({
    objectivePeople : yup 
    .number()
    .required("El campo es obligatorio"),
    informationSource: yup  
    .string()
    .max(100, "Solo se permiten 100 caracteres")
    .required("El campo es obligatorio"),
    region: yup
    .number()
    .required("Debe seleccionar una opción"),
    departament: yup  
    .number()
    .required("Debe seleccionar una opción"),
    district: yup  
    .number()
    .required("Debe seleccionar una opción"),
    shelter:yup
    .string()
    .max(100, "Solo se permiten 100 caracteres"),
    demographic: yup.array().required("Debe haber almenos una caracterstica").min(1, "Debe haber almenos una caracterstica").of(
        yup.object().shape(({
            clasification:yup
            .number()
            .required("Debe seleccionar una opción"),
            detail:yup
            .number()
            .required("Debe seleccionar una opción"),
            infoSource:yup
            .string()
            .max(100, "Solo se permiten 100 caracteres"),
        }))
    ),
})

export const technicalAnalysisValidator = yup.object({
    alternative: yup.string()
    .required("El campo es obligatorio")
    .max(300, "Solo se permiten 300 caracteres"),
    resumeAlternative :yup.string()
    .required("El campo es obligatorio")
    .max(5000, "Solo se permiten 5000 caracteres"),
});


export const risksValidator = yup.object().shape({
    level : yup 
    .number()
    .required("Debe seleccionar una opción"),
    risk: yup  
    .string()
    .required("Debe seleccionar una opción"),
    typeRisk: yup
    .number()
    .required("Debe seleccionar una opción"),
    descriptionRisk: yup  
    .string()
    .required("El campo es obligatorio")
    .max(500, "Solo se permiten 500 caracteres"),
    probability: yup  
    .number()
    .required("Debe seleccionar una opción"),
    impact: yup  
    .number()
    .required("Debe seleccionar una opción"),
    effects: yup  
    .string()
    .required("El campo es obligatorio")
    .max(500, "Solo se permiten 500 caracteres"),
    mitigation: yup  
    .string()
    .required("El campo es obligatorio")
    .max(500, "Solo se permiten 500 caracteres"),
});

export const transfersValidator = yup.object().shape({
   formulation: yup  
    .string()
    .required("El campo es obligatorio")
    .max(100, "Solo se permiten 100 caracteres"),
    rol: yup
    .string()
    .required("El campo es obligatorio")
    .max(100, "Solo se permiten 100 caracteres"),
    order: yup  
    .string()
    .required("El campo es obligatorio")
    .max(100, "Solo se permiten 100 caracteres"),
    tecniques: yup
        .boolean(),
    ambiental: yup
        .boolean(),
    sociocultural: yup
        .boolean()
        .test('atLeastOneSelected', 'Debe seleccionar al menos una opción', function(value) {
            const { tecniques, ambiental } = this.parent;
            debugger;
            if (tecniques || ambiental || value) {
                return true; // Al menos una opción está seleccionada, la validación pasa
            } else {
                return false; // Ninguna opción está seleccionada, la validación falla
            }
        }),
    observations: yup  
    .string()
    .required("El campo es obligatorio")
    .max(300, "Solo se permiten 300 caracteres"),
});

export const profitsIncomeFormValidator = yup.object({
    profitsIncome: yup.array().required("Debe haber almenos un ingreso/beneficio").min(1, "Debe haber almenos un ingreso/beneficio")
});

export const profitsIncomeValidator = yup.object({
    type: yup.string().required("Debe seleccionar una opción"),
    description: yup.string().required("El campo es obligatorio").max(600, "Solo se permiten 600 caracteres"),
    unit: yup.number().required("Debe seleccionar una opción"),
    period: yup.array().required("Debe haber al menos un periodo").min(1, "Debe haber al menos un periodo").of(
        yup.object(({
            quantity: yup.number().required("El campo es obligatorio"),
            unitValue: yup.number().required("El campo es obligatorio"),
        }))
    ),
});

export const riskValidator = yup.object({
    risks: yup.array().required("Debe haber almenos un riesgo").min(1, "Debe haber almenos un riesgo")
});

export const sourceFundingValidator = yup.object({
    sourceFunding: yup.array().required("Debe haber almenos una entidad").min(1, "Debe haber almenos una entidad")
});

export const EntityValidator = yup.object({
    stage: yup.number().required("Debe seleccionar una opción"),
    typeEntity: yup.number().required("Debe seleccionar una opción"),
    resource: yup.number().required("Debe seleccionar una opción"),
    entity: yup.string().required("El campo es obligatorio").max(300, "Solo se permiten 300 caracteres"),
    year0: yup.number()
    .transform((value) => Number.isNaN(value) ? null : value).nullable()
    .required("El campo es obligatorio"),
    year1: yup.number()
    .transform((value) => Number.isNaN(value) ? null : value).nullable()
    .required("El campo es obligatorio"),
    year2: yup.number()
    .transform((value) => Number.isNaN(value) ? null : value).nullable()
    .required("El campo es obligatorio"),
    year3: yup.number()
    .transform((value) => Number.isNaN(value) ? null : value).nullable()
    .required("El campo es obligatorio"),
    year4: yup.number()
    .transform((value) => Number.isNaN(value) ? null : value).nullable()
    .required("El campo es obligatorio"),
});

export const activitiesValidator = yup.object({
    activities: yup.array().required("Debe haber almenos una actividad").min(1, "Debe haber almenos una actividad")
});

export const activityMGAValidator = yup.object({
    objectiveSelect: yup.string()
        .required("El campo es obligatorio"),
    stageActivity: yup.number()
        .required("Debe seleccionar una opción"),
    productDescriptionMGA: yup.string()
        .required("El campo es obligatorio")
        .max(500, "Solo se permiten 500 caracteres"),
    activityDescriptionMGA: yup.string()
        .required("El campo es obligatorio")
        .max(500, "Solo se permiten 500 caracteres"),
    budgetsMGA: yup.object(),
    validity: yup.number()
        .transform((value) => Number.isNaN(value) ? null : value).nullable()
        .required("El campo es obligatorio"),
    year: yup.number()
        .required("Debe seleccionar una opción"),
    detailActivities: yup.array().of(
        yup.object().shape(({
            detailActivity: yup
                .string()
                .required("Debe seleccionar una opción")
                .max(500, "Solo se permiten 500 caracteres"),
            component: yup
                .number()
                .required("Debe seleccionar una opción"),
            measurement: yup
                .number()
                .required("Debe seleccionar una opción"),
            amount: yup
                .number()
                .transform((value) => Number.isNaN(value) ? null : value).nullable()
                .required("El campo es obligatorio"),
            unitCost: yup
                .number()
                .transform((value) => Number.isNaN(value) ? null : value).nullable()
                .required("El campo es obligatorio"),
        }))
    )
});

export const logicFrameFormValidator = yup.object({
    logicFrame: yup.array().required("Debe haber almenos un marco logico").min(1, "Debe haber almenos un marco logico")
});

export const logicFrameValidator = yup.object().shape({
    resume : yup 
    .number()
    .required("Debe seleccionar una opción"),
    description: yup  
    .string()
    .required("Debe seleccionar una opción"),
    indicator: yup
    .number()
    .required("Debe seleccionar una opción"),
    sourceVerification: yup  
    .string()
    .max(500, "Solo se permiten 500 caracteres"),
    assumptions: yup  
    .string()
    .max(500, "Solo se permiten 500 caracteres"),
});

export const indicatorsFormValidator = yup.object({
    indicators: yup.array().required("Debe haber almenos un indicador").min(1, "Debe haber almenos un indicador")
});

export const indicatorValidator = yup.object({
    type: yup
        .number()
        .typeError('Debe ser un número')
        .required("Debe seleccionar una opción"),
    line: yup
        .number()
        .typeError('Debe ser un número')
        .nullable()
        .test('required', 'El campo es obligatorio', function (value) {
            const type = this.parent.type;
            if (type !== 3) {
                if (value === null || value === undefined) {
                    return false;
                }
            }
            return true;
        }),
    component: yup
        .number()
        .typeError('Debe ser un número')
        .nullable()
        .test('required', 'El campo es obligatorio', function (value) {
            const type = this.parent.type;
            if (type !== 3) {
                if (value === null || value === undefined) {
                    return false;
                }
            }
            return true;
        }),
    program: yup
        .number()
        .typeError('Debe ser un número')
        .nullable()
        .test('required', 'El campo es obligatorio', function (value) {
            const type = this.parent.type;
            if (type !== 3) {
                if (value === null || value === undefined) {
                    return false;
                }
            }
            return true;
        }),
    indicator: yup
        .number()
        .typeError('Debe ser un número')
        .nullable()
        .test('required', 'El campo es obligatorio', function (value) {
            const type = this.parent.type;
            if (type !== 3) {
                if (value === null || value === undefined) {
                    return false;
                }
            }
            return true;
        }),
    developmentPlan: yup
        .string()
        .max(300, "Solo se permiten 300 caracteres")
        .nullable()
        .test('required', 'El campo es obligatorio', function (value) {
            debugger
            const type = this.parent.type;
            if (type !== 3) {
                if (!value) {
                    return false;
                }
            }
            return true;
        }),
    objective: yup
        .string()
        .nullable()
        .test('required', 'El campo es obligatorio', function (value) {
            const type = this.parent.type;
            if (type === 3) {
                if (!value) {
                    return false;
                }
            }
            return true;
        }),
    dpnIndicator: yup
        .number()
        .typeError('Debe ser un número')
        .nullable()
        .test('required', 'El campo es obligatorio', function (value) {
            const type = this.parent.type;
            if (type === 3) {
                if (value === null || value === undefined) {
                    return false;
                }
            }
            return true;
        }),
    dpn: yup
        .number()
        .typeError('Debe ser un número')
        .nullable()
        .test('required', 'El campo es obligatorio', function (value) {
            const type = this.parent.type;
            if (type === 3) {
                if (value === null || value === undefined) {
                    return false;
                }
            }
            return true;
        }),
    staticValueCode: yup
        .number()
        .typeError('Debe ser un número')
        .nullable()
        .test('required', 'El campo es obligatorio', function (value) {
            const type = this.parent.type;
            if (type === 3) {
                if (value === null || value === undefined) {
                    return false;
                }
            }
            return true;
        }),
    staticValue: yup
        .number()
        .typeError('Debe ser un número')
        .nullable()
        .test('required', 'El campo es obligatorio', function (value) {
            const type = this.parent.type;
            if (type === 3) {
                if (value === null || value === undefined) {
                    return false;
                }
            }
            return true;
        }),
    accumulative: yup
        .number()
        .nullable()
        .test('required', 'El campo es obligatorio', function (value) {
            const type = this.parent.type;
            if (type === 3) {
                if (value === null || value === undefined) {
                    return false;
                }
            }
            return true;
        }),
    total: yup
        .number()
        .nullable()
        .test('required', 'El campo es obligatorio', function (value) {
            const accumulative = this.parent.accumulative;
            if (accumulative === 0) {
                if (value === null || value === undefined) {
                    return false;
                }
            }
            return true;
        }),
    productMGA: yup
        .string()
        .required("El campo es obligatorio"),
    measurement: yup
        .number()
        .typeError('Debe ser un número')
        .required("El campo es obligatorio"),
    year0: yup
        .number()
        .typeError('Debe ser un número')
        .required("El campo es obligatorio"),
    year1: yup
        .number()
        .typeError('Debe ser un número')
        .required("El campo es obligatorio"),
    year2: yup
        .number()
        .typeError('Debe ser un número')
        .required("El campo es obligatorio"),
    year3: yup
        .number()
        .typeError('Debe ser un número')
        .required("El campo es obligatorio"),
    year4: yup
        .number()
        .typeError('Debe ser un número')
        .required("El campo es obligatorio"),
});