import * as yup from "yup";

export const CreatePAIValidator = yup.object({
    yearPAI: yup.number().required("Debe seleccionar una opción"),
    budgetPAI: yup.number().required("El campo es obligatorio"),
    typePAI: yup.number().required("Debe seleccionar una opción"),
    namePAI: yup.number().required("Debe seleccionar una opción"),
    objectivePAI: yup.string().required("El campo es obligatorio"),
    actionsPAi: yup.array().of(
        yup.object().shape({
          description: yup.string().notRequired(),
          indicators: yup.array().test('min-indicators', 'Debe agregar al menos un indicador', function (value) {
            return value && value.length > 0;
          }),
        })
      ),
    articulationPAI: yup.string().required("El campo es obligatorio").max(200, "Solo se permiten 200 caracteres"),
    risksPAI: yup.array().required("Debe haber almenos un riesgo").min(1, "Debe haber almenos un riesgo")
});



export const revisionPAIValidator = yup.object({
    field: yup.string().required("Debe seleccionar una opción"),
    observations: yup.string().required("El campo es obligatorio").max(5000, "Solo se permiten 5000 caracteres"),
});

export const approvePAIValidator = yup.object({
    approved: yup.boolean().required("Debes seleccionar una opción"),
    comments: yup.string().required("El campo es obligatorio").max(5000, "Solo se permiten 5000 caracteres")
});