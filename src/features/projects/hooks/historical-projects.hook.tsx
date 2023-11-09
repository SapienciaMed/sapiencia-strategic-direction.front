import { useForm } from "react-hook-form";
import { IProject, IProjectFiltersHistorical } from "../interfaces/ProjectsInterfaces";
import { useContext, useEffect, useState } from "react";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { Tooltip } from "primereact/tooltip";
import { AiOutlineDownload } from "react-icons/ai";
import { useProjectsService } from "./projects-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { DateTime } from "luxon";
import useBreadCrumb from "../../../common/hooks/bread-crumb.hook";
import { AppContext } from "../../../common/contexts/app.context";

export default function useHistoricalProjects() {
    useBreadCrumb({
        isPrimaryPage: true,
        name: "Proyectos Históricos",
        url: "/direccion-estrategica/proyectos-historicos/",
    });
    const { GetAllHistorical } = useProjectsService();
    const { setMessage } = useContext(AppContext)
    const [showTable, setShowTable] = useState<boolean>(false);
    const [dataTable, setDataTable] = useState(null);
    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
        control
    } = useForm<IProjectFiltersHistorical>();
    const onSubmit = handleSubmit(async (data: IProjectFiltersHistorical) => {
        GetAllHistorical(data).then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const groupedData = response.data.reduce((result, current, index) => {
                    const existingGroup = result.find(group => group.bpin === current.bpin);
                    if (existingGroup) {
                        existingGroup.childrens.push({ ...current, consecutive: index });
                    } else {
                        result.push({ ...current, childrens: [], consecutive: index }); 
                    }
                    return result;
                }, []);
                setDataTable(groupedData.filter(project => project.childrens.length > 0));
            } else {
                console.log(response.operation.message)
            }
        }).catch(err => console.log(err));
    });
    const clear = () => {
        reset();
        setShowTable(false);
    };
    const tableColumns: ITableElement<IProject>[] = [
        {
            header: "BPIN",
            fieldName: "bpin"
        },
        {
            header: "Nombre del Proyecto",
            fieldName: "project"
        },
        {
            header: "Fecha de creación",
            fieldName: "dateCreate",
            renderCell: (row) => {
                return <>{DateTime.fromISO(row.dateCreate).toLocaleString()}</>;
            },
        },
        {
            header: "Versión",
            fieldName: "version"
        },
    ]
    const tableActions: ITableAction<IProject>[] = [
        {
            customIcon: (row) => {
                return (
                    <>
                        <Tooltip target=".download-tooltip" />
                        <div
                            className="download-tooltip"
                            data-pr-tooltip="Descargar PDF"
                            data-pr-position="bottom"
                            style={{ 'color': '#D72FD1' }}
                        >
                            <AiOutlineDownload />
                        </div>
                    </>
                )
            },
            onClick: (row) => {

            }
        }
    ];
    useEffect(() => {
        if(!dataTable) return;
        if(dataTable.length > 0) {
            setShowTable(true);
        } else {
            setShowTable(false);
            setMessage({
                title: "Resultados de búsqueda",
                description: "No se generó resultado en la búsqueda",
                show: true,
                background: true,
                OkTitle: "Cerrar",
                onOk: () => {
                    setMessage({});
                }
            })
        }
    }, [dataTable]);
    return { register, errors, control, showTable, onSubmit, clear, dataTable, tableColumns, tableActions }
}