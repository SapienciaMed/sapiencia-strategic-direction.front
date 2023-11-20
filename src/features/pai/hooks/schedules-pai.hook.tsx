import { useForm } from "react-hook-form";
import useBreadCrumb from "../../../common/hooks/bread-crumb.hook";
import { ISchedulesPAI } from "../interfaces/SchedulesPAIInterfaces";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { schedulePAIValidator } from "../../../common/schemas";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { useContext, useEffect, useState } from "react";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import useRoleService from "../../../common/hooks/role-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { DateTime } from "luxon";
import { AppContext } from "../../../common/contexts/app.context";

interface ISchedulesTablePAI {
    consecutive: number;
    id?: number;
    idRol: number;
    idStatus: number;
    bimester: number;
    startDate: DateTime;
    endDate: DateTime;
}

export default function useSchedulesPAIData() {
    useBreadCrumb({
        isPrimaryPage: true,
        name: "Cronograma del plan de acción institucional",
        url: "/direccion-estrategica/pai/cronogramas",
    });

    const [rolData, setRolData] = useState<IDropdownProps[]>([]);
    const [statusData, setStatusData] = useState<IDropdownProps[]>([]);
    const [tableData, setTableData] = useState<ISchedulesTablePAI[]>([]);
    const [editSchedule, setEditSchedule] = useState<number>(null);

    const { getOptions } = useRoleService();
    const { authorization } = useContext(AppContext);

    const createPermission = authorization?.allowedActions?.find(action => action === "CREAR_PLAN");
    const resolver = useYupValidationResolver(schedulePAIValidator);
    const {
        handleSubmit,
        formState: { errors },
        reset,
        control,
        setValue
    } = useForm<ISchedulesPAI>({ resolver, mode: "all" });

    const onSubmitCreate = handleSubmit(async (data: ISchedulesPAI) => {
        setTableData(tableData.concat({ ...data, consecutive: tableData.length }));
        setTimeout(() => {
            reset();
        }, 100);
    });

    const onSubmitEdit = handleSubmit(async (data: ISchedulesPAI) => {
        let indice = tableData.findIndex(objeto => objeto.consecutive === editSchedule);
        if (indice !== -1) {
            const editData = tableData;
            editData[indice].idRol = data.idRol;
            editData[indice].bimester = data.bimester;
            editData[indice].endDate = data.endDate;
            editData[indice].idStatus = data.idStatus;
            editData[indice].startDate = data.startDate;
            setTableData(editData);
            setEditSchedule(null);
            setTimeout(() => {
                reset();
            }, 100);
        }
    });

    const resetForm = () => {
        reset();
        setEditSchedule(null);
    }

    const tableColumns: ITableElement<ISchedulesTablePAI>[] = [
        {
            header: "Rol",
            fieldName: "idRol",
            renderCell: (row) => {
                const rol = rolData.find(rol => rol.value === row.idRol)
                return <>{rol ? rol.name : ""}</>
            }
        },
        {
            header: "Estado",
            fieldName: "idStatus",
            renderCell: (row) => {
                return <>{row.idStatus}</>
            }
        },
        {
            header: "Bimestre",
            fieldName: "bimester",
            renderCell: (row) => {
                const bimester = bimesterData.find(bimester => bimester.value === row.bimester)
                return <>{bimester ? bimester.name : ""}</>
            }
        },
        {
            header: "Fecha de inicio",
            fieldName: "startDate",
            renderCell: (row) => {
                return <>{row.startDate}</>
            }
        },
        {
            header: "Fecha final",
            fieldName: "endDate",
            renderCell: (row) => {
                return <>{row.endDate}</>
            }
        }
    ]
    const tableActions: ITableAction<ISchedulesTablePAI>[] = [
        {
            icon: "Edit",
            onClick: (row) => {
                setValue("id", row.id);
                setValue("bimester", row.bimester);
                setValue("endDate", row.endDate);
                setValue("idRol", row.idRol);
                setValue("idStatus", row.idStatus);
                setValue("startDate", row.startDate);
                setEditSchedule(row.consecutive);
            }
        }
    ];
    const bimesterData: IDropdownProps[] = [
        {
            name: "1",
            value: 1
        },
        {
            name: "2",
            value: 2
        },
        {
            name: "3",
            value: 3
        },
        {
            name: "4",
            value: 4
        },
        {
            name: "5",
            value: 5
        },
        {
            name: "6",
            value: 6
        },
        {
            name: "Todos",
            value: 7
        },
        {
            name: "No aplica",
            value: 0
        },
    ];

    useEffect(() => {
        getOptions(Number(process.env.aplicationId)).then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const paiActions = response.data.find(item => item.id === 1028).actions; // 1028 es el id para Planes de acción institucional en la tabla de OPC_OPCIONES
                setRolData(paiActions ? paiActions.map(item => {
                    return {
                        name: item.name,
                        value: item.id
                    }
                }) : [])
            }
        }).catch(err => console.log(err));
    }, []);
    return { errors, resetForm, control, onSubmitCreate, tableColumns, tableActions, rolData, statusData, bimesterData, tableData, createPermission, editSchedule, onSubmitEdit };
}