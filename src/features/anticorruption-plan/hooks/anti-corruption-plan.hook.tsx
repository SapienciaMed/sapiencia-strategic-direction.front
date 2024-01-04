import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IProject, IProjectFiltersDirection } from "../../projects/interfaces/ProjectsInterfaces";
import { IAntiCorruptionPlan, IAntiCorruptionPlanTemp, ICreate, IAntiCorruptionPlanFields, IIndicator, IResponsible, IActivity, IComponent } from "../../projects/interfaces/AntiCorruptionPlanInterfaces";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { Controller, useFieldArray, useForm  } from "react-hook-form";
import { antiCorruptionPlanValidator } from "../../../common/schemas";
import { useProjectsService } from "../../projects/hooks/projects-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { AiOutlineDownload, AiOutlineEye, AiOutlinePaperClip, } from "react-icons/ai";
import { RiPencilLine } from "react-icons/ri";
import { HiOutlineDocument } from "react-icons/hi";
import { FcCancel } from "react-icons/fc";
import { Tooltip } from "primereact/tooltip";
import { DateTime } from "luxon";
import { AppContext } from "../../../common/contexts/app.context";
import axios from "axios";
import { ApiResponse } from "../../../common/utils/api-response";
import { saveAs } from "file-saver"
import { useParams } from "react-router-dom";
import { useAntiCorruptionPlanStatusService } from "./anti-corruption-plan-status-service.hook";
import { useAntiCorruptionPlanService } from "./anti-corruption-plan-service.hook";
import { useAntiCorruptionPlanComponentService } from "./anti-corruption-plan-component-service.hook";
import EditModal from "./edit-modal";
import * as uuid from 'uuid';
import moment from "moment";

export function useAntiCorruptionPlanData() {
    const { authorization } = useContext(AppContext);
    const tableComponentRef = useRef(null);
    const msgs = useRef(null);
    const [errores, setErrores] = useState<string>(null);
    const [ready, setReady] = useState<boolean>(false);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [statusData, setStatusData] = useState<IDropdownProps[]>([]);
    const [filesUploadData, setFilesUploadData] = useState<File[]>([]);
    const { setMessage, validateActionAccess } = useContext(AppContext);
    const { getAll } = useAntiCorruptionPlanStatusService();
    const { update, create: createPAAC } = useAntiCorruptionPlanService();
    const { getAllByPlanId, deleteAllByIds, store } = useAntiCorruptionPlanComponentService();
    const today = DateTime.local();
    const resolver = useYupValidationResolver(antiCorruptionPlanValidator);
    const navigate = useNavigate();
    const [visiblemodal, setVisibleModal] = useState(false);
    const [close, setClose] = useState<IProject | number>(1);
    const { id } = useParams() 
    const [createPlanId, setCreatePlanId] = useState<string>(uuid.v4())
    const [components, setComponents] = useState<IComponent[]>([]);
    const [componentCount, setComponentCount] = useState(1);
    const [deletedComponents, setDeletedComponents] = useState<string[]>([]);
    const [indicators, setIndicators] = useState<IIndicator[]>([]);
    const [responsibles, setResponsibles] = useState<IResponsible[]>([]);
    const [activities, setActivities] = useState<IActivity[]>([])
    
    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
        control,
        getValues,
        watch,
    } = useForm<IAntiCorruptionPlanFields>({ resolver });

    const handleAddComponent = () => {
        const newComponent = {
            id: componentCount,
            index: componentCount,
            uuid: uuid.v4(),
            plan_uuid: createPlanId,
            description: getValues('component_desc'),
        };

        setComponents((prevComponents) => [...prevComponents, newComponent]);
        setComponentCount((prevCount) => prevCount + 1);
    };

    const deleteRow = (idToDelete) => {
        setComponents((prevComponents) =>
            prevComponents.filter(
                (component) => component.uuid !== idToDelete
            )
        );
    };

    useEffect(() => {
        if (components.length === 0) {
            setComponentCount(1);
        }
    }, [components]);

    const tableColumns: ITableElement<IAntiCorruptionPlan>[] = [
        { fieldName: "name", header: "Nombre del plan" },
        { fieldName: "date", header: "Fecha de formulación", },
        { 
            fieldName: "status",
            header: "Estado",
            renderCell: (row) => {
                const status = statusData.find(status => status.value === row.status);
                return <>{status?.name}</>
            }
        },
    ];

    const yearsArray: IDropdownProps[] = [];

    for (let year = 2024; year <= 2100; year++) {
        yearsArray.push({ name: year.toString(), value: year });
    }

    const closeModal = () => {
        setVisibleModal(false);
        console.log("ejecutando")
    };

    const handleClick = (id: number) => {
        navigate(`/direccion-estrategica/planes/plan-anticorrupcion/formular-plan/editar/${id}`);
    };
    

    const tableActions: ITableAction<IAntiCorruptionPlan>[] = [
        {
            customIcon: (row) => {
                return (
                    (
                        <>
                            <Tooltip target=".edit-tooltip" />
                            <div
                                className="edit-tooltip"
                                data-pr-tooltip="Editar"
                                data-pr-position="bottom"
                                style={{ color: '#0CA529' }}
                                onClick={() => handleClick(row.id)}
                                data-url={row.id}
                            >
                                <RiPencilLine />

                            </div>
                            <EditModal
                                control={control}
                                onSave={saveChanges}
                                antiCorruptionPlan={antiCorruptionPlan}
                                setAntiCorruptionPlan={setAntiCorruptionPlan}
                                title={"Editar"}
                                visible={visiblemodal}
                                onCloseModal={closeModal}
                                setVisible={setClose}
                            />
                            
                        </>
                    )
                )
            }
            ,
            onClick: (row) => {},
            hideRow: (row) => !(row.status === 1 || row.status === 2 || row.status === 3) || (!validateActionAccess("PROYECTO_EDITAR"))
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
        getAll().then(response => {
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

    useEffect(() => {
        msgs.current?.clear();
        if (errores) {
            msgs.current?.show([
                { severity: 'error', summary: 'Error', detail: errores, sticky: true, closable: false }
            ]);
        }
    }, [errores]);

    useEffect(() => {
        if (close === 2) {
            console.log("Cerrando modal de edición");
            setVisibleModal(false);
        }
    }, [close]);

    const [editingProject, setEditingProject] = useState<IProject | null>(null);
    
    const [antiCorruptionPlan, setAntiCorruptionPlan] = useState<IAntiCorruptionPlan | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const openEditDialog = (row: IAntiCorruptionPlan) => {
        console.log("Abriendo modal de edición para:", row);
        setAntiCorruptionPlan(row);
        setIsEditing(true);
        setVisibleModal(true);
    };

    const closeEditDialog = () => {
        setVisibleModal(false);
    };

    const saveChanges = () => {
        update(antiCorruptionPlan).then((response) =>{
            if (response.operation.code === EResponseCodes.OK) {
                closeEditDialog();
            } else {
                console.log(response.operation.message);
            }
            
        });
    };
    
    return {
        navigate,
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
        setErrores,
        validateActionAccess,
        yearsArray,
        antiCorruptionPlan,
        getAllByPlanId,
        deleteAllByIds,
        store,
        id,
        createPAAC,
        createPlanId,
        handleAddComponent,
        components,
        setDeletedComponents,
        deletedComponents,
        deleteRow,
        setComponents,
        component_desc: watch('component_desc'),
        indicators,
        setIndicators,
        responsibles,
        setResponsibles,
        activities,
        setActivities,
    };
}

