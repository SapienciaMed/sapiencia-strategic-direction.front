import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IProject, IProjectFiltersDirection } from "../../projects/interfaces/ProjectsInterfaces";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { useForm } from "react-hook-form";
import { projectsValidator } from "../../../common/schemas";
import { useProjectsService } from "../../projects/hooks/projects-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { AiOutlineDownload, AiOutlineEye, AiOutlinePaperClip } from "react-icons/ai";
import { RiPencilLine } from "react-icons/ri";
import { HiOutlineDocument } from "react-icons/hi";
import { FcCancel } from "react-icons/fc";
import { Tooltip } from "primereact/tooltip";
import { DateTime } from "luxon";
import { AppContext } from "../../../common/contexts/app.context";
import axios from "axios";
import { ApiResponse } from "../../../common/utils/api-response";
import { saveAs } from "file-saver"
import { useAntiCorruptionPlanStatusService } from "./anti-corruption-plan-status-service.hook";

export function useAntiCorruptionPlanData() {
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
    const { getAll } = useAntiCorruptionPlanStatusService();
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
    } = useForm<IProjectFiltersDirection>({ resolver });
    const tableColumns: ITableElement<IProject>[] = [
        {
            fieldName: "name",
            header: "Nombre del plan"
        },
        {
            fieldName: "dateFrom",
            header: "Fecha de formulación",
            renderCell: (row) => {
            return <>{row.status === 1 ? "" : DateTime.fromISO(row.dateCreate).toLocaleString()}</>;
            }
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
                        <Tooltip target=".edit-tooltip" />
                        <div
                            className="edit-tooltip"
                            data-pr-tooltip="Editar"
                            data-pr-position="bottom"
                            style={{ 'color': '#0CA529' }}
                        >
                            <RiPencilLine />
                        </div>
                    </>
                )
            },
            onClick: (row) => {openEditDialog},
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
        if(errores) {
            msgs.current?.show([
                { severity: 'error', summary: 'Error', detail: errores, sticky: true, closable: false }
            ]);
        }
    }, [errores]);

    const [editingProject, setEditingProject] = useState<IProject | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const openEditDialog = (row: IProject) => {
        setEditingProject(row);
        setIsEditing(true);
    };

    const closeEditDialog = () => {
        setEditingProject(null);
        setIsEditing(false);
    };

    const saveChanges = () => {
        // Aquí debes guardar los cambios en el proyecto
        // Puedes utilizar el estado editingProject para actualizar la tabla
        // Una vez guardado, cierra el diálogo
        closeEditDialog();
    };

    const editDialog = isEditing && editingProject && (
        <div className="modal" style={{ display: 'block' }}>
            <div className="modal-content">
                {/* Aquí van los campos editables */}
                <h2>Editar Proyecto</h2>
                <label htmlFor="projectName">Nombre del Proyecto:</label>
                <input
                    type="text"
                    id="projectName"
                    value={editingProject.user}
                    onChange={(e) => setEditingProject({ ...editingProject, user: e.target.value })}
                />

                <label htmlFor="projectDate">Fecha de Formulación:</label>
                <input
                    type="text"
                    id="projectDate"
                    value={editingProject.dateFrom}
                    onChange={(e) => setEditingProject({ ...editingProject, dateFrom: e.target.value })}
                />

                {/* Botones de Guardar y Cancelar */}
                <button onClick={saveChanges}>Guardar</button>
                <button onClick={closeEditDialog}>Cancelar</button>
            </div>
        </div>
    );

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
             setErrores,
             validateActionAccess };
}

