import { useContext, useEffect, useState } from "react";
import { useProjectsService } from "./projects-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { AppContext } from "../../../common/contexts/app.context";
import { useNavigate } from "react-router-dom";
import { IEntities } from "../interfaces/Entities";
import { useEntitiesService } from "./entities-service.hook";
import { useForm } from "react-hook-form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { finishProjectValidator } from "../../../common/schemas";
import { IFinishProjectForm } from "../interfaces/ProjectsInterfaces";

export default function useFinishProjectData(idProject: string) {
    const [bpin, setBPIN] = useState<string>(null);
    const [project, setProject] = useState<string>(null);
    const [formulator, setFormulator] = useState<string>(null);
    const [dependecy, setDependencyData] = useState<string>(null);
    const { setMessage } = useContext(AppContext);
    const { GetProjectById, FinishProject } = useProjectsService();
    const { GetEntitiesDependency } = useEntitiesService();
    const resolver = useYupValidationResolver(finishProjectValidator);
    const navigate = useNavigate();
    const {
        handleSubmit,
        register,
        formState: { errors, isValid },
        control: controlRegister,
        setValue
    } = useForm<IFinishProjectForm>({ resolver, mode: "all" });
    const onCancel = () => {
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
    }
    const onSubmit = handleSubmit((data: IFinishProjectForm) => {
        setMessage({
            title: "Finalizar proyecto",
            description: "¿Deseas finalizar el proyecto? No podrás hacer más cambios.",
            background: true,
            show: true,
            OkTitle: "Aceptar",
            cancelTitle: "Cancelar",
            onCancel: () => {
                setMessage({});
            },
            onOk: () => {
                FinishProject(idProject,data).then(response => {
                    if (response.operation.code === EResponseCodes.OK) {
                        setMessage({
                            title: "Proyecto",
                            background: true,
                            OkTitle: "Aceptar",
                            show: true,
                            description: "¡Finalizado exitosamente!",
                            onOk: () => {
                                navigate("./../..");
                                setMessage({});
                            }
                        });
                    } else {
                        setMessage({
                            title: "¡Ha ocurrido un error!",
                            background: true,
                            OkTitle: "Aceptar",
                            show: true,
                            description: response.operation.message,
                            onOk: () => {
                                setMessage({});
                            }
                        });
                    }
                }).catch(err => console.log(err));
            }
        })
    })
    useEffect(() => {
        if (!idProject) return;
        GetProjectById(idProject).then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                setBPIN(response.data.bpin);
                setProject(response.data.project);
                setFormulator(response.data.formulation);
                response.data.projectObservation && setValue("observations", response.data.projectObservation);
                GetEntitiesDependency().then(response2 => {
                    if (response2.operation.code === EResponseCodes.OK) {
                        const entities: IEntities[] = response2.data;
                        const dependencySelected = entities.find(entity => entity.id === response.data.dependency);
                        setDependencyData(dependencySelected.description);
                    }
                }).catch(err => console.log(err));
            } else {
                setMessage({
                    title: "¡Ha ocurrido un error!",
                    description: response.operation.message,
                    show: true,
                    background: true,
                    OkTitle: "Aceptar"
                });
            }
        }).catch(err => console.log(err));
    }, [idProject]);
    return { bpin, project, onCancel, onSubmit, dependecy, formulator, controlRegister, register, errors, isValid};
}