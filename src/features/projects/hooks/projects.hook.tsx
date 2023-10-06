import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../common/contexts/app.context";
import { IProject, IProjectFiltersDirection } from "../interfaces/ProjectsInterfaces";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { useForm } from "react-hook-form";
import { projectsValidator } from "../../../common/schemas";

export function useProjectsData() {
    const tableComponentRef = useRef(null);
    const navigate = useNavigate();
    const { setMessage } = useContext(AppContext);
    const resolver = useYupValidationResolver(projectsValidator);
    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
        control,
        watch
    } = useForm<IProjectFiltersDirection>({ resolver });

    const tableColumns: ITableElement<IProject>[] = [
        {
            fieldName: "fund.number",
            header: "Fondo"
        },
    ];

    const tableActions: ITableAction<IProject>[] = [

    ];

    function loadTableData(searchCriteria?: object): void {
        if (tableComponentRef.current) {
            tableComponentRef.current.loadData(searchCriteria);
        }
    }

    const onSubmit = handleSubmit(async (data: IProjectFiltersDirection) => {
        loadTableData(data)
    });

    return { navigate, tableComponentRef, tableColumns, tableActions, onSubmit, reset };
}