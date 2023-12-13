import * as yup from "yup";

export const indicatorsPAIValidator = yup.object({
    typePAI: yup.number()
    .notRequired()
    .nullable(),
    projectIndicator: yup.number()
    .when(['typePAI', 'indicatorDesc'], ([typePAI,indicatorDesc], projectIndicator ) => {
        return ( typePAI == 2 ) || ( typePAI == 1 && indicatorDesc?.length > 0 )
          ? projectIndicator.notRequired().nullable()
          : projectIndicator
              .required("El campo es obligatorio");
    }),
    indicatorType: yup.number()
    .required("El campo es obligatorio"),
    indicatorDesc: yup.string()
    .test('required', 'El campo es obligatorio', function (value) {
        const projectIndicator = this.parent.projectIndicator;
        if (!projectIndicator) {
            if(value === null || !value ){
                return false;
            }
        }
        return true;
    }),
    bimesters: yup.array().required().of(
        yup.object().shape(({
            bimester: yup.string()
            .optional()
            .nullable(),
            value: yup.number()
            .required(),
            disaggregate: yup.array().optional().of(
                yup.object().shape(({
                    percentage: yup.number().required(),
                    // .required("El campo es obligatorio"),
                    description: yup.string()
                    // .required("El campo es obligatorio")
                    .max(200, "Solo se permiten 200 caracteres"),
                }))
            ),
            showDisaggregate: yup.number().optional(),
            sumOfPercentage: yup.number().optional()
        }))
    ),
    totalPlannedGoal: yup.number()
    .notRequired()
    .nullable()
    .min(100, "Alerta. El total de la meta planeada no puede ser inferior a 100. ")
    .max(100, "Alerta. El total de la meta planeada no puede ser mayor a 100. "),
    products: yup.array().required().of(
        yup.object().shape(({
            product: yup.string()
            .required("El campo es obligatorio")
            .max(500, "Solo se permiten 500 caracteres"),
        }))
    ).min(1, "Debes agregar al menos un producto"),
    responsibles: yup.array().of(
        yup.object().shape(({
            responsible: yup.string()
            .required("El campo es obligatorio")
            .max(100, "Solo se permiten 100 caracteres"),
        }))
    ).min(1, "Debes agregar al menos un responsable"),
    coresponsibles: yup.array().of(
        yup.object().shape(({
            coresponsible: yup.string()
            .required("El campo es obligatorio")
            .max(100, "Solo se permiten 100 caracteres"),
        }))
    ).min(1, "Debes agregar al menos un corresponsable ")
});