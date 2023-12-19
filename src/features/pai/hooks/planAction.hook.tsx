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
                    return { name: entity.bpin + " - " + entity.project, value: entity.id };
                });
                setProjectsPAIData(arrayEntities);
                setProjectsData(response.data)
            } 
        });
        getProcessPAI().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const entities: IEntities[] = response.data;
                const arrayEntities: IDropdownProps[] = entities.map((entity) => {
                    return { name: entity.description, value: entity.id };
                });
                setProcessPAIData(arrayEntities);
            }
        }).catch(() => { });
    }, []);




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
                    const project = projectsPAIData?.find(project => project.value === row.namePAI);
                    return <>{project?.name}</>
                }else {
                    const process = processPAIData?.find(project => project.value === row.namePAI);
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

    const tableActions: ITableAction<ICreatePlanAction>[] = [
        {
            
            customIcon: (row) => {
                return (
                    <>
                        <Tooltip target=".review-tooltip" />
                        <div
                            className="review-tooltip"
                            data-pr-tooltip="Revisar Formulación"
                            data-pr-position="bottom"
                        >
                            <IoSearch />
                        </div>
                    </>
                )
            },
            onClick: (row) => {
                const urlRevision = {
                    2: `./revision/${row.id}`,
                    3: `./correction/${row.id}`,
                    4: `./adjustment/${row.id}`
                };
                navigate(urlRevision[row.status]);
            },
            hideRow: (row) => {
                if(row.status === 2 || row.status === 4) {
                    return !validateActionAccess("REVISAR_PLAN")
                } else if (row.status === 3) {
                    if(validateActionAccess("CORREGIR_PLAN")) return validateActionAccess("REVISAR_PLAN");
                }
                return true;
            }
        },
        {
            customIcon: () => {
                return (
                    <>
                        <Tooltip target=".edit-tooltip" />
                        <div
                            className="edit-tooltip"
                            data-pr-tooltip="Editar plan"
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
            hideRow: (row) => !(row.status === 1) || (!validateActionAccess("EDITAR_PLAN"))
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
             msgs, 
             yearsArray,
             setErrores,
             validateActionAccess };
}

