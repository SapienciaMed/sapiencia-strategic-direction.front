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
import { useSchedulesService } from "./schedules-service.hook";
import { useNavigate } from "react-router";

interface ISchedulesTablePAI {
    consecutive: number;
    id?: number;
    idRol: number;
    idStatus: number;
    bimester: number;
    startDate: DateTime;
    endDate: DateTime;
    userCreate?: string;
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
    const [constTableData, setConstTableData] = useState<ISchedulesTablePAI[]>([]);
    const [editSchedule, setEditSchedule] = useState<number>(null);

    const { getOptions } = useRoleService();
    const { getScheduleStatuses, getSchedules, crudSchedules } = useSchedulesService();
    const { authorization, setMessage } = useContext(AppContext);

    const createPermission = authorization?.allowedActions?.find(action => action === "CREAR_PLAN");
    const navigate = useNavigate();
    const resolver = useYupValidationResolver(schedulePAIValidator);
    const {
        handleSubmit,
        formState: { errors },
        reset,
        control,
        setValue,
        getValues,
        clearErrors
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
                const status = statusData.find(status => status.value === row.idStatus)
                return <>{status ? status.name : ""}</>
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
                const fecha = DateTime.fromFormat(row.startDate, 'yyyy/MM/dd').toFormat('dd/MM/yyyy');
                return <>{fecha}</>
            }
        },
        {
            header: "Fecha final",
            fieldName: "endDate",
            renderCell: (row) => {
                const fecha = DateTime.fromFormat(row.endDate, 'yyyy/MM/dd').toFormat('dd/MM/yyyy');
                return <>{fecha}</>
            }
        }
    ]
    const tableActions: ITableAction<ISchedulesTablePAI>[] = [
        {
            icon: "Edit",
            onClick: (row) => {
                clearErrors();
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

    const cancelAction = () => {
        if (JSON.stringify(constTableData) !== JSON.stringify(tableData)) {
            setMessage({
                title: "Cancelar acción",
                description: "¿Deseas cancelar la acción?",
                background: true,
                show: true,
                OkTitle: "Aceptar",
                cancelTitle: "Cancelar",
                onCancel: () => {
                    setMessage({});
                },
                onOk: () => {
                    setMessage({});
                    navigate("./../..");
                }
            })
        } else {
            navigate("./../..");
        }
    }

    const saveAction = () => {
        if (JSON.stringify(constTableData?.map(data => {
            return {endDate: data.endDate, idRol: data.idRol, id: data.id, idStatus: data.idStatus, startDate: data.startDate, bimester: data.bimester}
        })) !== JSON.stringify(tableData.map(data => {
            return {endDate: data.endDate, idRol: data.idRol, id: data.id, idStatus: data.idStatus, startDate: data.startDate, bimester: data.bimester}
        }))) {
            setMessage({
                title: "Guardar datos",
                description: "¿Deseas guardar el cronograma?",
                background: true,
                show: true,
                OkTitle: "Aceptar",
                cancelTitle: "Cancelar",
                onCancel: () => {
                    setMessage({});
                },
                onOk: () => {
                    crudSchedules(tableData.map(data => {
                        return {...data, userCreate: authorization.user.numberDocument}
                    })).then(response => {
                        if (response.operation.code === EResponseCodes.OK) {
                            setMessage({
                                title: "Cronograma del plan de acción institucional",
                                description: "¡Guardado exitosamente!",
                                show: true,
                                background: true,
                                OkTitle: "Aceptar",
                                onOk: () => {
                                    navigate("./../..");
                                    setMessage({});
                                }
                            });
                        } else {
                            setMessage({
                                title: "¡Ha ocurrido un error!",
                                description: response.operation.message,
                                show: true,
                                background: true,
                                OkTitle: "Aceptar",
                                onOk: () => {
                                    setMessage({});
                                }
                            });
                        }
                    }).catch(err => setMessage({
                        title: "¡Ha ocurrido un error!",
                        description: String(err),
                        show: true,
                        background: true,
                        OkTitle: "Aceptar",
                        onOk: () => {
                            setMessage({});
                        }
                    }))
                }
            })
        }
    }

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
        getScheduleStatuses().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                setStatusData(response.data.map(item => {
                    return {
                        name: item.description,
                        value: item.id
                    }
                }))
            }
        }).catch(err => console.log(err));
        getSchedules().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const data = response.data.map((schedule, index) => {
                    return { ...schedule, consecutive: index };
                })
                const data2 = response.data.map((schedule, index) => {
                    return { ...schedule, consecutive: index };
                })
                setTableData(data);
                setConstTableData(data2);
            }
        }).catch(err => console.log(err));
    }, []);
    return { errors, resetForm, control, onSubmitCreate, tableColumns, tableActions, rolData, statusData, bimesterData, tableData, createPermission, editSchedule, onSubmitEdit, getValues, setValue, cancelAction, saveAction };
}