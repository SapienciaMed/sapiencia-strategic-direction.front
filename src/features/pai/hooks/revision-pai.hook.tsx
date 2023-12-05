import { useFieldArray, useForm } from "react-hook-form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { revisionPAIValidator } from "../../../common/schemas";
import { IRevisionPAI } from "../interfaces/PAIInterfaces";

export default function useRevisionPAIData(idPAI: string) {
    const resolver = useYupValidationResolver(revisionPAIValidator);
    const {
        register: registerPAI,
        control: controlPAI,
        formState: { errors: errorsPAI },
    } = useForm<any>({ mode: "all" });
    const {
        register: registerRevision,
        control: controlRevision,
        formState: { errors: errorsRevision },
    } = useForm<IRevisionPAI>({ resolver, mode: "all" });
    const { fields: fieldsLines, append: appendLines } = useFieldArray({
        control: controlPAI,
        name: "linePAI",
    });
    const { fields: fieldsRisks, append: appendRisks } = useFieldArray({
        control: controlPAI,
        name: "risksPAI",
    });

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