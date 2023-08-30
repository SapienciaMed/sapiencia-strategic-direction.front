import React, { useContext } from "react";
import { FormComponent, TextAreaComponent } from "../../../common/components/Form";
import { Controller, useForm } from "react-hook-form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { needsValidator } from "../../../common/schemas";
import { INeedObjetive, INeedsForm } from "../interfaces/ProjectsInterfaces";
import { AiOutlinePlusCircle } from "react-icons/ai";
import TableExpansibleComponent from "./table-expansible.component";
import { AppContext } from "../../../common/contexts/app.context";
import { ProjectsContext } from "../contexts/projects.context";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";

interface IProps {
    disableNext: () => void;
    enableNext: () => void;
    setForm: React.Dispatch<React.SetStateAction<React.JSX.Element>>;
}

export function NeedsComponent({ disableNext, enableNext, setForm }: IProps): React.JSX.Element {
    const { setProjectData, projectData } = useContext(ProjectsContext);
    const { setMessage } = useContext(AppContext);
    const resolver = useYupValidationResolver(needsValidator);
    const {
        control,
        register,
        getValues,
        setValue,
        formState: { errors, isValid },
    } = useForm<INeedsForm>({
        resolver, mode: "all"
    });
    const objectivesColumns: ITableElement<INeedObjetive>[] = [
        {
            fieldName: "objetive",
            header: "Objetivo",
            renderCell: (row) => {
                return <>{row.objetive.consecutive}. {row.objetive.description}</>
            }
        },
        {
            fieldName: "interventionActions",
            header: "Acciones de intervención",
        },
        {
            fieldName: "estatesService",
            header: "Bienes/Servicios",
            renderCell: (row) => {
                return <>{row.estatesService.length}</>
            }
        },
        {
            fieldName: "quantification",
            header: "Cuantificación",
        },
    ];
    const objectivesActions: ITableAction<INeedObjetive>[] = [
        {
            icon: "Edit",
            onClick: (row) => {
                
            }
        }
    ];
    return (
        <div className="card-table">
            <FormComponent action={undefined} className="problem-description-container">
                <Controller
                    control={control}
                    name={"alternative"}
                    defaultValue=""
                    render={({ field }) => {
                        return (
                            <TextAreaComponent
                                id={field.name}
                                idInput={field.name}
                                value={`${field.value}`}
                                label="Nombre de la alternativa"
                                classNameLabel="text-black big bold text-required"
                                className="text-area-basic"
                                placeholder="Escribe aquí"
                                register={register}
                                onChange={field.onChange}
                                errors={errors}
                            >
                                <label className="label-max-texarea">Max 300 caracteres</label>
                            </TextAreaComponent>
                        );
                    }}
                />
                <Controller
                    control={control}
                    name={"generalObjetive"}
                    defaultValue=""
                    render={({ field }) => {
                        return (
                            <TextAreaComponent
                                id={field.name}
                                idInput={field.name}
                                value={`${field.value}`}
                                label="Objetivo general"
                                classNameLabel="text-black big bold text-required"
                                className="text-area-basic"
                                placeholder="Escribe aquí"
                                register={register}
                                onChange={field.onChange}
                                errors={errors}
                            >
                                <label className="label-max-texarea">Max 300 caracteres</label>
                            </TextAreaComponent>
                        );
                    }}
                />
                <div>
                    <div className="title-area">
                        <label className="text-black biggest bold text-required">
                            Listado de objetivos específicos
                        </label>

                        <div className="title-button text-main biggest" onClick={() => {
                            setForm(<>hola</>);
                        }}>
                            Añadir objetivo <AiOutlinePlusCircle />
                        </div>
                    </div>
                    {getValues('objetive')?.length > 0 && <TableExpansibleComponent actions={objectivesActions} columns={objectivesColumns} data={getValues('objetive')} />}
                </div>
            </FormComponent>
        </div>
    )
}

export default React.memo(NeedsComponent);