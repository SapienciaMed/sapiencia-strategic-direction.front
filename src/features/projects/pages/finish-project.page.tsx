import React from "react";
import { useParams } from "react-router-dom";
import { ButtonComponent, FormComponent, InputComponent, TextAreaComponent } from "../../../common/components/Form";
import useFinishProjectData from "../hooks/finish-project.hook";
import { Controller } from "react-hook-form";

function FinishProjectPage(): React.JSX.Element {
    const { id } = useParams();
    const { bpin, project, onCancel, onSubmit, dependecy, formulator, controlRegister, register, errors, isValid } = useFinishProjectData(id);
    return (
        <div className='crud-page full-height'>
            <div className='main-page full-height'>
                <div className='card-table'>
                    <div className="title-area">
                        <div className="text-black extra-large bold">Finalizar Proyecto</div>
                    </div>
                    <div className="strategic-direction-attachments-form">
                        <div className="card-table">
                            <FormComponent action={onSubmit} className="problem-description-container" id="finishProjectForm">
                                <div className="strategic-direction-finish-project-name">
                                    <InputComponent
                                        idInput={"bpin"}
                                        value={bpin}
                                        label="BPIN"
                                        className="input-basic"
                                        classNameLabel="text-black biggest bold"
                                        typeInput={"text"}
                                        disabled
                                    />
                                    <InputComponent
                                        idInput={"project"}
                                        value={project}
                                        label="Nombre del proyecto"
                                        className="input-basic"
                                        classNameLabel="text-black biggest bold"
                                        typeInput={"text"}
                                        disabled
                                    />
                                </div>
                                <div className="strategic-direction-grid-1 strategic-direction-grid-2-web">
                                    <InputComponent
                                        idInput={"dependency"}
                                        value={dependecy}
                                        label="Dependencia "
                                        className="input-basic"
                                        classNameLabel="text-black biggest bold"
                                        typeInput={"text"}
                                        disabled
                                    />
                                    <InputComponent
                                        idInput={"formulator"}
                                        value={formulator}
                                        label="Formulador"
                                        className="input-basic"
                                        classNameLabel="text-black biggest bold"
                                        typeInput={"text"}
                                        disabled
                                    />
                                </div>
                                <Controller
                                    control={controlRegister}
                                    name={"observations"}
                                    defaultValue=""
                                    render={({ field }) => {
                                        return (
                                            <TextAreaComponent
                                                id={field.name}
                                                idInput={field.name}
                                                value={`${field.value}`}
                                                label="Observaciones"
                                                className="text-area-basic"
                                                classNameLabel="text-black biggest bold text-required"
                                                rows={4}
                                                placeholder="Escribe aquí"
                                                register={register}
                                                onChange={field.onChange}
                                                errors={errors}
                                                characters={300}
                                            ></TextAreaComponent>
                                        );
                                    }}
                                />
                            </FormComponent>
                        </div>
                        <div className="mobile-actions">
                            <span className="bold text-center button" onClick={onCancel}>
                                Cancelar
                            </span>
                            <ButtonComponent
                                className={`button-main huge hover-three button-save`}
                                value={"Guardar"}
                                type="submit"
                                form="finishProjectForm"
                                disabled={!isValid}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-button-bot space-between">
                <div></div>
                <div className="buttons-bot">
                    <span className="bold text-center button" onClick={onCancel}>
                        Cancelar
                    </span>
                    <ButtonComponent
                        className={`button-main huge hover-three button-save`}
                        value={"Guardar"}
                        type="submit"
                        form="finishProjectForm"
                        disabled={!isValid}
                    />
                </div>
            </div>
        </div>

    )
}

export default React.memo(FinishProjectPage);