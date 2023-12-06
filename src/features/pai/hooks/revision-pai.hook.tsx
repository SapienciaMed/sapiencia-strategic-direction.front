import { useFieldArray, useForm } from "react-hook-form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { revisionPAIValidator } from "../../../common/schemas";
import { IRevisionFormPAI } from "../interfaces/PAIInterfaces";
import { useEffect } from "react";
import { usePaiService } from "./pai-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";

export default function useRevisionPAIData(idPAI: string) {
    const { GetPAIById } = usePaiService();
    const resolver = useYupValidationResolver(revisionPAIValidator);
    const {
        register: registerPAI,
        control: controlPAI,
        formState: { errors: errorsPAI },
        setValue,
    } = useForm<any>({ mode: "all" });
    const {
        register: registerRevision,
        control: controlRevision,
        formState: { errors: errorsRevision },
    } = useForm<IRevisionFormPAI>({ resolver, mode: "all" });
    const { fields: fieldsLines, append: appendLines } = useFieldArray({
        control: controlPAI,
        name: "linePAI",
    });
    const { fields: fieldsRisks, append: appendRisks } = useFieldArray({
        control: controlPAI,
        name: "risksPAI",
    });

    useEffect(() => {
        if(!idPAI) return;
        GetPAIById(Number(idPAI)).then(response => {
            if(response.operation.code === EResponseCodes.OK) {
                const pai = response.data;
                console.log(pai);
                setValue("yearPAI", pai.yearPAI);
                setValue("budgetPAI", pai.budgetPAI);
                setValue("typePAI", pai.typePAI);
                setValue("namePAI", pai.namePAI);
                setValue("objectivePAI", pai.objectivePAI);
                setValue("linePAI", pai.linePAI);
                setValue("risksPAI", pai.risksPAI);
            } else {
                console.log(response.operation.message);
            }
        }).catch(err => console.log(err))
    }, [idPAI]);

    return {
        controlPAI,
        registerPAI,
        errorsPAI,
        fieldsLines,
        fieldsRisks,
        controlRevision,
        registerRevision,
        errorsRevision,
    };
}