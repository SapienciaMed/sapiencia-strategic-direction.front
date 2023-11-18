import { useForm } from "react-hook-form";
import useBreadCrumb from "../../../common/hooks/bread-crumb.hook";
import { ISchedulesPAI } from "../interfaces/SchedulesPAIInterfaces";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { schedulePAIValidator } from "../../../common/schemas";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { useState } from "react";

export default function useSchedulesPAIData() {
    useBreadCrumb({
        isPrimaryPage: true,
        name: "Cronograma del plan de acción institucional",
        url: "/direccion-estrategica/pai/cronogramas",
    });
    const [rolData, setRolData] = useState([]);
    const resolver = useYupValidationResolver(schedulePAIValidator);
    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
        control
    } = useForm<ISchedulesPAI>({ resolver, mode: "all" });
    const onSubmit = handleSubmit(async (data: ISchedulesPAI) => {
        console.log(data)
    });

    const tableColumns: ITableElement<ISchedulesPAI>[] = [
        {
            header: "BPIN",
            fieldName: "bpin"
        },
    ]
    const tableActions: ITableAction<ISchedulesPAI>[] = [
        
    ];
    return { register, errors, reset, control, onSubmit, tableColumns, tableActions, rolData };
}