import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IProject, IProjectFiltersDirection } from "../interfaces/ProjectsInterfaces";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { useForm } from "react-hook-form";
import { projectsValidator } from "../../../common/schemas";
import { useProjectsService } from "./projects-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { AiOutlineDownload, AiOutlineEye, AiOutlinePaperClip } from "react-icons/ai";
import { RiPencilLine } from "react-icons/ri";
import { HiOutlineDocument } from "react-icons/hi";
import { FcCancel } from "react-icons/fc";
import { Tooltip } from "primereact/tooltip";
import { DateTime } from "luxon";

export function useProjectsData() {
    const [ready, setReady] = useState<boolean>(false);
    const [statusData, setStatusData] = useState<IDropdownProps[]>([]);
    const tableComponentRef = useRef(null);
    const navigate = useNavigate();
    const { GetAllStatus } = useProjectsService();
    const resolver = useYupValidationResolver(projectsValidator);
    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
        control
    } = useForm<IProjectFiltersDirection>({ resolver });

    const tableColumns: ITableElement<IProject>[] = [
        {
            fieldName: "bpin",
            header: "BPIN"
        },
        {
            fieldName: "project",
            header: "Nombre proyecto"
        },
        {
            fieldName: "dateCreate",
            header: "Fecha de creación",
            renderCell: (row) => {
                return <>{DateTime.fromISO(row.dateCreate).toLocaleString()}</>;
            }
        },
        {
            fieldName: "version",
            header: "Versión"
        },
        {
            fieldName: "status",
            header: "Estado",
            renderCell: (row) => {
                const status = statusData.find(status => status.value === row.status);
                return <>{status?.name}</>
            }
        },
    ];

    const tableActions: ITableAction<IProject>[] = [
        {
            customIcon: () => {
                return (
                    <>
                        <Tooltip target=".download-tooltip" />
                        <div
                            className="download-tooltip"
                            data-pr-tooltip="Descargar registro"
                            data-pr-position="bottom"
                            style={{'color': '#D72FD1'}}
                        >
                            <AiOutlineDownload />
                        </div>
                    </>
                )
            },
            onClick: (row) => {

            }
        },
        {
            customIcon: () => {
                return (
                    <>
                        <Tooltip target=".attach-tooltip" />
                        <div
                            className="attach-tooltip"
                            data-pr-tooltip="Adjuntar archivos"
                            data-pr-position="bottom"
                            style={{'color': '#533893'}}
                        >
                            <AiOutlinePaperClip />
                        </div>
                    </>
                )
            },
            onClick: (row) => {

            }
        },
        {
            customIcon: () => {
                return (
                    <>
                        <Tooltip target=".download-attach-tooltip" />
                        <div
                            className="download-attach-tooltip"
                            data-pr-tooltip="Descargar adjuntos"
                            data-pr-position="bottom"
                            style={{'color': '#FF7D06'}}
                        >
                            <HiOutlineDocument />
                        </div>
                    </>
                )
            },
            onClick: (row) => {

            }
        },
        {
            customIcon: () => {
                return (
                    <>
                        <Tooltip target=".download-file-tooltip" />
                        <div
                            className="download-file-tooltip"
                            data-pr-tooltip="Descargar ficha"
                            data-pr-position="bottom"
                            style={{'color': '#058CC1'}}
                        >
                            <AiOutlineEye />
                        </div>
                    </>
                )
            },
            onClick: (row) => {

            }
        },
        {
            customIcon: () => {
                return (
                    <>
                        <Tooltip target=".finish-tooltip" />
                        <div
                            className="finish-tooltip"
                            data-pr-tooltip="Finalizar proyecto"
                            data-pr-position="bottom"
                        >
                            <FcCancel />
                        </div>
                    </>
                )
            },
            onClick: (row) => {

            }
        },
        {
            customIcon: () => {
                return (
                    <>
                        <Tooltip target=".finish-tooltip" />
                        <div
                            className="finish-tooltip"
                            data-pr-tooltip="Editar proyecto"
                            data-pr-position="bottom"
                            style={{'color': '#0CA529'}}
                        >
                            <RiPencilLine />
                        </div>
                    </>
                )
            },
            onClick: (row) => {

            }
        },
    ];

    function loadTableData(searchCriteria?: object): void {
        if (tableComponentRef.current) {
            tableComponentRef.current.loadData(searchCriteria);
        }
    }

    const onSubmit = handleSubmit(async (data: IProjectFiltersDirection) => {
        if (ready) loadTableData(data);
    });

    useEffect(() => {
        GetAllStatus().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                setStatusData(response.data.map(status => {
                    return {
                        name: status.description,
                        value: status.id
                    }
                }));
            } else {
                setStatusData([]);
                console.log(response.operation.message);
            }
            setReady(true);
        });
    }, []);

    useEffect(() => {
        loadTableData();
    }, [ready]);

    return { navigate, tableComponentRef, tableColumns, tableActions, onSubmit, reset, statusData, control, register, errors };
}