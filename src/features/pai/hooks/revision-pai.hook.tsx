import { useForm } from "react-hook-form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { revisionPAIValidator } from "../../../common/schemas";
//import { IRevisionPAI } from "../interfaces/PAIInterfaces";

export default function useRevisionPAIData(idPAI: string) {
    const resolver = useYupValidationResolver(revisionPAIValidator);
    const {
        handleSubmit,
        formState: { errors },
        reset,
        control,
        setValue,
        getValues,
        clearErrors
    } = useForm<{}>({ resolver, mode: "all" });

    return {}
}