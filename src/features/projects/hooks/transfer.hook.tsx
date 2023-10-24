import { useForm } from "react-hook-form";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { useContext, useEffect, useState } from "react";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { Itransfers } from "../interfaces/ProjectsInterfaces";
import { transfersValidator } from "../../../common/schemas";
import { ProjectsContext } from "../contexts/projects.context";
import { useEntitiesService } from "./entities-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { IEntities } from "../interfaces/Entities";
import { AppContext } from "../../../common/contexts/app.context";
import { useProjectsService } from "./projects-service.hook";
import { useNavigate } from "react-router-dom";

export function useTransferData() {
    const { GetEntitiesDependency } = useEntitiesService();
    const navigate = useNavigate();
    const [processData] = useState<IDropdownProps[]>(null);
    const [dependecyData, setDependencyData] = useState<IDropdownProps[]>(null);
    const { CreateProject, UpdateProject } = useProjectsService();
    const { setMessage, authorization } = useContext(AppContext);
    const { setDisableContinue, setActionContinue, setProjectData, projectData, setTextContinue, formAction } = useContext(ProjectsContext);

    const resolver = useYupValidationResolver(transfersValidator);

    const {
        handleSubmit,
        register,
        formState: { errors, isValid },
        control,
        watch,
        setValue
    } = useForm<Itransfers>({
        resolver, mode: "all", defaultValues: {
            bpin: projectData?.transfers?.bpin ? projectData.transfers.bpin : "",
            project: projectData?.transfers?.project ? projectData.transfers.project : "",
            dependency: projectData?.transfers?.dependency ? projectData.transfers.dependency : "",
            formulation: projectData?.transfers?.formulation ? projectData.transfers.formulation : "",
            rol: projectData?.transfers?.rol ? projectData.transfers.rol : "",
            order: projectData?.transfers?.order ? projectData.transfers.order : "",
            tecniques: projectData?.transfers?.tecniques ? projectData.transfers.tecniques : null,
            ambiental: projectData?.transfers?.ambiental ? projectData.transfers.ambiental : null,
            sociocultural: projectData?.transfers?.sociocultural ? projectData.transfers.sociocultural : null,
            observations: projectData?.transfers?.observations ? projectData.transfers.observations : "",
        }
    });

    const bpn = projectData.register.bpin;
    const project = projectData.register.project;
    const dependency = projectData.register.dependency;

    const dependencia = dependecyData?.find(data => data.value === dependency);

    useEffect(() => {
        setValue("bpin", bpn);
        setValue("project", project);
        setValue("dependency", dependencia?.name);
    }, [bpn, project, dependencia])

    useEffect(() => {
        const subscription = watch((value: Itransfers) => setProjectData(prev => {
            return { ...prev, transfers: { ...value } }
        }));
        return () => subscription.unsubscribe();
    }, [watch]);

    useEffect(() => {
        GetEntitiesDependency().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const entities: IEntities[] = response.data;
                const arrayEntities: IDropdownProps[] = entities.map((entity) => {
                    return { name: entity.description, value: entity.id };
                });
                setDependencyData(arrayEntities);
            }
        }).catch(() => { });
    }, []);

    useEffect(() => {
        setDisableContinue(!isValid);
        setActionContinue(isValid ? () => onSubmit : () => { });
        setTextContinue("Enviar");
    }, [isValid]);

    const onSubmit = handleSubmit(async (data: Itransfers) => {
        setMessage({
            title: "Formular el proyecto",
            description: "¿Deseas guardar el proyecto como formulado?",
            show: true,
            background: true,
            cancelTitle: "Cancelar",
            OkTitle: "Aceptar",
            onCancel: () => {
                setMessage({});
            },
            onOk: async () => {
                if (projectData?.id) {
                    const data = { ...projectData, user: authorization.user.numberDocument, status: 2 };
                    const res = await UpdateProject(projectData.id, data);
                    if (res.operation.code === EResponseCodes.OK) {
                        setMessage({
                            title: "Proyecto formulado",
                            description: "¡Guardado exitosamente!",
                            show: true,
                            background: true,
                            OkTitle: "Cerrar",
                            onOk: () => {
                                navigate('/direccion-estrategica/proyectos/');
                                setMessage({});
                            }
                        })
                    } else {
                        if (res.operation.message.includes("BPIN")) {
                            setMessage({
                                title: "Validación BPIN.",
                                description: <p className="text-primary biggest">Ya existe un proyecto con el BPIN ingresado, por favor verifique.</p>,
                                background: true,
                                show: true,
                                OkTitle: "Cerrar",
                                onOk: () => {
                                    setMessage({});
                                },
                                onClose: () => {
                                    setMessage({});
                                }
                            });
                        } else {
                            setMessage({
                                title: "Ocurrio un problema...",
                                description: <p className="text-primary biggest">{res.operation.message}</p>,
                                background: true,
                                show: true,
                                OkTitle: "Cerrar",
                                onOk: () => {
                                    setMessage({});
                                },
                                onClose: () => {
                                    setMessage({});
                                }
                            });
                        }
                    }
                } else {
                    const data = { ...projectData, user: authorization.user.numberDocument, status: 2 };
                    const res = await CreateProject(data);
                    setProjectData(prev => {
                        return { ...prev, id: res.data.id }
                    });
                    if (res.operation.code === EResponseCodes.OK) {
                        setMessage({
                            title: "Formular el proyecto",
                            description: "¿Deseas guardar el proyecto como formulado?",
                            show: true,
                            background: true,
                            cancelTitle: "Cancelar",
                            OkTitle: "Aceptar",
                            onCancel: () => {
                                setMessage({});
                            },
                            onOk: () => {
                                setMessage({
                                    title: "Proyecto formulado",
                                    description: "¡Guardado exitosamente!",
                                    show: true,
                                    background: true,
                                    OkTitle: "Cerrar",
                                    onOk: () => {
                                        navigate('/direccion-estrategica/proyectos/');
                                        setMessage({});
                                    }
                                })
                            }
                        });
                    } else {
                        if (res.operation.message.includes("BPIN")) {
                            setMessage({
                                title: "Validación BPIN.",
                                description: <p className="text-primary biggest">Ya existe un proyecto con el BPIN ingresado, por favor verifique.</p>,
                                background: true,
                                show: true,
                                OkTitle: "Cerrar",
                                onOk: () => {
                                    setMessage({});
                                },
                                onClose: () => {
                                    setMessage({});
                                }
                            });
                        } else {
                            setMessage({
                                title: "Ocurrio un problema...",
                                description: <p className="text-primary biggest">{res.operation.message}</p>,
                                background: true,
                                show: true,
                                OkTitle: "Cerrar",
                                onOk: () => {
                                    setMessage({});
                                },
                                onClose: () => {
                                    setMessage({});
                                }
                            });
                        }
                    }
                }
            }
        });
    });
    
    return { register, errors, control, onSubmit, processData, bpn, dependency, project, isValid, watch, };
}