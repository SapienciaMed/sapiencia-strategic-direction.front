import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IProject, IProjectFiltersDirection } from "../interfaces/ProjectsInterfaces";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { useForm } from "react-hook-form";
import { projectsValidator } from "../../../common/schemas";
import { usePaiService } from "./pai-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { AiOutlineDownload, AiOutlineEye, AiOutlinePaperClip } from "react-icons/ai";
import { IoSearch } from "react-icons/io5";
import { RiPencilLine } from "react-icons/ri";
import { HiOutlineDocument } from "react-icons/hi";
import { FcCancel } from "react-icons/fc";
import { Tooltip } from "primereact/tooltip";
import { DateTime } from "luxon";
import { AppContext } from "../../../common/contexts/app.context";
import axios from "axios";
import { ApiResponse } from "../../../common/utils/api-response";
import { saveAs } from "file-saver"
import { ICreatePlanAction } from "../interfaces/PAIInterfaces";
import { IActionPlanFilters } from "../interfaces/ActionPlanInterface";
import { useEntitiesService } from "./entities-service.hook";
import { useProjectsService } from "./projects-service.hook";
import { IEntities } from "../interfaces/Entities";

export function useProjectsData() {
    const { authorization } = useContext(AppContext);
    const tableComponentRef = useRef(null);
    const msgs = useRef(null);
    const [errores, setErrores] = useState<string>(null);
    const [ready, setReady] = useState<boolean>(false);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [statusData, setStatusData] = useState<IDropdownProps[]>([]);
    const [filesUploadData, setFilesUploadData] = useState<File[]>([]);
    const [selectedRow, setSelectedRow] = useState<IProject>(null);
    const { setMessage, validateActionAccess  } = useContext(AppContext);
    const { getRiskPAI,getProcessPAI,getObjectivesPAI } = useEntitiesService();
    const { getProjectsByFilters } = useProjectsService();
    const [processPAIData, setProcessPAIData] = useState<IDropdownProps[]>(null);
    const [projectsPAIData, setProjectsPAIData] = useState<IDropdownProps[]>(null);
    const [projectsData, setProjectsData] = useState<IProject[]>(null);
    const { GetAllStatus } = usePaiService();
    const today = DateTime.local();
    const formattedDate = today.toFormat('ddMMyyyy');
    const resolver = useYupValidationResolver(projectsValidator);
    const navigate = useNavigate();
    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
        control
    } = useForm<IActionPlanFilters>({ resolver });



    useEffect(() => {
        getProjectsByFilters(2).then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const arrayEntities: IDropdownProps[] = response.data.map((entity) => {
                    return { name: entity.bpin + "-" + entity.project, value: entity.id };
                });
                setProjectsPAIData(arrayEntities);
                setProjectsData(response.data)
            } 
        });
    }, []);

    getProcessPAI().then(response => {
        if (response.operation.code === EResponseCodes.OK) {
            const entities: IEntities[] = response.data;
            const arrayEntities: IDropdownProps[] = entities.map((entity) => {
                return { name: entity.description, value: entity.id };
            });
            setProcessPAIData(arrayEntities);
        }
    }).catch(() => { });


    const tableColumns: ITableElement<ICreatePlanAction>[] = [
        {
            fieldName: "id",
            header: "No."
        },
        {
            fieldName: "namePAI",
            header: "Nombre proyecto - proceso",
            renderCell: (row) => {
                if(row.typePAI == 1){
                    const project = projectsPAIData.find(project => project.value === row.namePAI);
                    return <>{project?.name}</>
                }else {
                    const process = processPAIData.find(project => project.value === row.namePAI);
                    return <>{process?.name}</>
                }
            }
            
        },
        {
            fieldName: "dateCreate",
            header: "Fecha de Formulación",
            renderCell: (row) => {
                return <>{row.status === 1 ? "" : DateTime.fromISO(row.dateCreate).toLocaleString()}</>;
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
            customIcon: (row) => {
                return (
                    <>
                        <Tooltip target=".review-tooltip" />
                        <div
                            className="review-tooltip"
                            data-pr-tooltip="Revisar Formulación"
                            data-pr-position="bottom"
                            style={{ 'color': '#D72FD1' }}
                        >
                            <IoSearch />
                        </div>
                    </>
                )
            },
            onClick: (row) => {
                setShowDialog(true);
                setSelectedRow(row);
            },
            hideRow: (row) => !(row.status === 2 || row.status === 3) || (!validateActionAccess("PROYECTO_CARGA"))
        },
        {
            customIcon: (row) => {
                return (
                    <>
                        <Tooltip target=".attach-tooltip" />
                        <div
                            className="attach-tooltip"
                            data-pr-tooltip="Adjuntar archivos"
                            data-pr-position="bottom"
                            style={{ 'color': '#533893' }}
                        >
                            <AiOutlinePaperClip />
                        </div>
                    </>
                )
            },
            onClick: (row) => {
                setShowDialog(true);
                setSelectedRow(row);
            },
            hideRow: (row) => !(row.status === 2 || row.status === 3) || (!validateActionAccess("PROYECTO_CARGA"))
        },
        {
            customIcon: (row) => {
                return (
                    <>
                        <Tooltip target=".download-attach-tooltip" />
                        <div
                            className="download-attach-tooltip"
                            data-pr-tooltip="Descargar ficha"
                            data-pr-position="bottom"
                            style={{ 'color': '#FF7D06' }}
                        >
                            <HiOutlineDocument />
                        </div>
                    </>
                )
                hideRow: (row) => !(row.status === 1 || row.status === 2 || row.status === 3) || (!validateActionAccess("PROYECTO_EDITAR"))
            },
            onClick: (row) => {
                const token = localStorage.getItem("token");
                  
                fetch(`${process.env.urlApiStrategicDirection}/api/v1/pdf/generate-pdf-consolidate/${row.id}/generate-pdf-consolidate`, {
                    method: 'GET',  // O utiliza 'POST' u otro método según tus necesidades
                    headers: new Headers({
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Permissions: authorization.encryptedAccess,
                        authorization: `Bearer ${token}`
                    }),
                  }).then(async response => {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    window.open(url, "_blank")
                    saveAs(blob, `${"Ficha técnica_"+row?.bpin+"_"+formattedDate}.pdf`);
                  }).catch(err => {
                    setMessage({
                        title: "¡Ha ocurrido un error!",
                        description: String(err),
                        show: true,
                        background: true,
                        OkTitle: "Aceptar",
                        onOk: () => {
                            setMessage({});
                        }
                    })
                })
            },
            hideRow: (row) => !(row.status === 2 || row.status === 4) || (!validateActionAccess("PROYECTO_DESCARGA"))
        },
        {
            customIcon: (row) => {
                return (
                    <>
                        <Tooltip target=".download-file-tooltip" />
                        <div
                            className="download-file-tooltip"
                            data-pr-tooltip="Descargar adjuntos"
                            data-pr-position="bottom"
                            style={{ 'color': '#058CC1' }}
                        >
                            <AiOutlineEye />
                        </div>
                    </>
                )
            },
            onClick: (row) => {
                navigate(`adjuntos/${row.id}`);
            },
            hideRow: (row) => !(row.status === 2 || row.status === 3 || row.status === 4) || (!validateActionAccess("PROYECTO_DESCARGA"))
        },
        {
            customIcon: (row) => {
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
                navigate(`finalizar-proyecto/${row.id}`);
            },
            hideRow: (row) => !(row.status === 2 || row.status === 3) || (!validateActionAccess("PROYECTO_FINALIZAR"))
        },
        {
            customIcon: () => {
                return (
                    <>
                        <Tooltip target=".edit-tooltip" />
                        <div
                            className="edit-tooltip"
                            data-pr-tooltip="Editar proyecto"
                            data-pr-position="bottom"
                            style={{ 'color': '#0CA529' }}
                        >
                            <RiPencilLine />
                        </div>
                    </>
                )
            },
            onClick: (row) => {
                navigate(`./edit/${row.id}`);
            },
            hideRow: (row) => !(row.status === 1 || row.status === 2 || row.status === 3) || (!validateActionAccess("PROYECTO_EDITAR"))
        },
    ];

    const yearsArray: IDropdownProps[] = [];

    // Generar un array de objetos para representar los años
    for (let year = 2024; year <= 2100; year++) {
      yearsArray.push({ name: year.toString(), value: year });
    }


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
            debugger;
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
        });
    }, []);

    useEffect(() => {
        loadTableData();
    }, [ready]);

    useEffect(() => {
        msgs.current?.clear();
        if(errores) {
            msgs.current?.show([
                { severity: 'error', summary: 'Error', detail: errores, sticky: true, closable: false }
            ]);
        }
    }, [errores]);

    const uploadFiles = () => {
        setShowDialog(false);
        setMessage({
            title: "Adjuntar archivos",
            description: "¿Deseas adjuntar los archivos seleccionados al proyecto?",
            show: true,
            background: true,
            cancelTitle: "Cancelar",
            OkTitle: "Aceptar",
            onOk: () => {
                const form = new FormData();
                const files = filesUploadData;
                files.forEach(file => {
                    form.append('files', file);
                });
                const token = localStorage.getItem("token");
                const options = {
                    method: 'POST',
                    url: `${process.env.urlApiStrategicDirection}/api/v1/project/upload/${selectedRow?.id}`,
                    headers: { 'content-type': 'multipart/form-data', Permissions: authorization.encryptedAccess, authorization: `Bearer ${token}` },
                    data: form,
                };
                axios.request(options).then(response => {
                    const data: ApiResponse<boolean> = response.data;
                    if (data.operation.code === EResponseCodes.OK) {
                        setFilesUploadData([]);
                        setMessage({
                            background: true,
                            show: true,
                            title: "Adjuntos del proyecto",
                            description: "¡Archivos guardados exitosamente!",
                            OkTitle: "Aceptar",
                        });
                    } else {
                        setFilesUploadData([]);
                        setMessage({
                            background: true,
                            show: true,
                            title: "Adjuntos del proyecto",
                            description: data.operation.message,
                            OkTitle: "Aceptar"
                        });
                    }
                }).catch(err => {
                    setMessage({
                        background: true,
                        show: true,
                        title: "Adjuntos del proyecto",
                        description: String(err),
                        OkTitle: "Aceptar"
                    })
                });
            },
            onCancel: () => {
                setMessage({});
            }
        })
    }

    return { navigate, 
             tableComponentRef, 
             tableColumns, 
             tableActions, 
             onSubmit, 
             reset, 
             statusData, 
             control, 
             register, 
             errors, 
             showDialog, 
             setShowDialog, 
             filesUploadData, 
             setFilesUploadData, 
             uploadFiles, 
             msgs, 
             yearsArray,
             setErrores,
             validateActionAccess };
}

