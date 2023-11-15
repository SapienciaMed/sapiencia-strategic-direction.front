import { useContext, useEffect, useState } from "react";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { useProjectsService } from "./projects-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { AppContext } from "../../../common/contexts/app.context";
import { IFiles } from "../../../common/interfaces/storage.interfaces";
import { DateTime } from "luxon";
import { AiOutlineDownload } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export default function useAttachmentsData(idProject: string) {
    const [bpin, setBPIN] = useState<string>(null);
    const [project, setProject] = useState<string>(null);
    const [tableData, setTableData] = useState<IFiles[]>([]);
    const [deletedFiles, setDeletedFiles] = useState<string[]>([]);
    const { setMessage, authorization } = useContext(AppContext);
    const { GetProjectById, GetProjectFiles, DeleteFileProject } = useProjectsService();
    const navigate = useNavigate();
    const tableColumns: ITableElement<IFiles>[] = [
        {
            fieldName: "name",
            header: "Nombre"
        },
        {
            fieldName: "size",
            header: "Tamaño",
            renderCell: (row) => {
                return <>{row.size >= 1048576 ? `${Math.floor(row.size / 1000000)} MB` : `${Math.floor(row.size / 1000)} KB`}</>
            }
        },
        {
            fieldName: "date",
            header: "Fecha",
            renderCell: (row) => {
                return <>{DateTime.fromISO(row.date).toLocaleString()}</>
            }
        }
    ];
    const tableActions: ITableAction<IFiles>[] = [
        {
            customIcon: () => {
                return (
                    <div
                        style={{ 'color': '#D72FD1' }}
                    >
                        <AiOutlineDownload />
                    </div>
                );
            },
            onClick: (row) => {
                const token = localStorage.getItem("token");
                fetch(`${process.env.urlApiStrategicDirection}/api/v1/project/files/get-file`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        permissions: authorization.encryptedAccess,
                        authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({fileName: row.path})
                }).then(async response => {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = row.name;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                }).catch(err => {
                    setMessage({
                        title: "Ha ocurrido un error...",
                        description: String(err),
                        show: true,
                        background: true,
                        OkTitle: "Aceptar",
                        onOk: () => {
                            setMessage({});
                        }
                    })
                })
            }
        },
        {
            icon: "Delete",
            onClick: (row) => {
                setMessage({
                    title: "Eliminar adjunto",
                    description: "¿Deseas eliminar el archivo?",
                    background: true,
                    show: true,
                    OkTitle: "Aceptar",
                    cancelTitle: "Cancelar",
                    onCancel: () => {
                        setMessage({});
                    },
                    onOk: () => {
                        if(!deletedFiles.includes(row.path)) setDeletedFiles(prev => {
                            return prev.concat([row.path]);
                        })
                        setTableData(prev => {
                            return prev.filter(item => item.path !== row.path);
                        })
                        setMessage({});
                    }
                })
            }
        }
    ];
    const loadTable = () => {
        GetProjectFiles(idProject).then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                setTableData(response.data);
            } else {
                setMessage({
                    title: "Ha ocurrido un problema...",
                    description: response.operation.message,
                    show: true,
                    background: true,
                    OkTitle: "Aceptar"
                });
            }
        }).catch(err => console.log(err));
    }
    const onCancel = () => {
        if(deletedFiles.length > 0) {
            setMessage({
                title: "Cancelar acción",
                description: "¿Deseas cancelar la acción?",
                background: true,
                show: true,
                OkTitle: "Aceptar",
                cancelTitle: "Cancelar",
                onOk: () => {
                    navigate("./../..");
                    setMessage({});
                },
                onCancel: () => {
                    setMessage({});
                }
            })
        } else {
            navigate("./../..");
        }
    }
    const onSubmit = () => {
        setMessage({
            title: "Guardar cambios",
            description: "¿Deseas guardar los cambios?",
            background: true,
            show: true,
            OkTitle: "Aceptar",
            cancelTitle: "Cancelar",
            onCancel: () => {
                setMessage({});
            },
            onOk: () => {
                DeleteFileProject(deletedFiles).then(response => {
                    if (response.operation.code === EResponseCodes.OK) {
                        setMessage({
                            title: "Guardar cambios",
                            description: "¡Cambios guardados exitosamente!",
                            background: true,
                            show: true,
                            OkTitle: "Aceptar",
                            onOk: () => {
                                setMessage({});
                                navigate("./../..");
                            }
                        })
                        loadTable();
                    } else {
                        setMessage({
                            title: "Eliminar adjunto",
                            description: response.operation.message,
                            background: true,
                            show: true,
                            OkTitle: "Aceptar",
                            onOk: () => {
                                setMessage({});
                            },
                        })
                    }
                }).catch(err => console.log(err));
            }
        })
    }
    useEffect(() => {
        if (!idProject) return;
        GetProjectById(idProject).then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                setBPIN(response.data.bpin);
                setProject(response.data.project);
            } else {
                setMessage({
                    title: "Ha ocurrido un problema...",
                    description: response.operation.message,
                    show: true,
                    background: true,
                    OkTitle: "Aceptar"
                });
            }
        }).catch(err => console.log(err));
        loadTable();
    }, [idProject]);
    return { tableData, tableColumns, tableActions, bpin, project, onCancel, onSubmit };
}