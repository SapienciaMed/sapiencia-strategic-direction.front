import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AntiCorruptionGeneralExpansibleTable from "../../anticorruption-plan/components/anticorruption-table-general-expansible.component";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { AppContext } from "../../../common/contexts/app.context";
import { ButtonComponent, SelectComponent } from "../../../common/components/Form";
import { useAntiCorruptionPlanData } from "../../anticorruption-plan/hooks/anti-corruption-plan.hook";
import "../../anticorruption-plan/style/formulation.scss";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const FormulationPAAC = () => {
    const { navigate,
        control,
        statusData,
        yearsArray,
        antiCorruptionPlan,
        getAllByPlanId,
        deleteAllByIds,
        store,
        id,
        errors } = useAntiCorruptionPlanData();
    const [components, setComponents] = useState([]);
    const [componentCount, setComponentCount] = useState(1);
    const [deleteConfirmation, setDeleteConfirmation] = useState({});
    const [deletedComponents, setDeletedComponents] = useState<string[]>([])
    const [hasAddedComponent, setHasAddedComponent] = useState(false);
    const { setMessage } = useContext(AppContext);

    const handleAddComponent = () => {
        if (!hasAddedComponent) {
            const newComponent = {
                id: componentCount,
                index: componentCount,
            };

            setComponents((prevComponents) => [...prevComponents, newComponent]);
            setComponentCount((prevCount) => prevCount + 1);
            setHasAddedComponent(true);
        }
    };


    const deleteRow = (idToDelete) => {
        setComponents((prevComponents) =>
            prevComponents.filter(
                (component) => component.id !== idToDelete
            )
        );
    };

    useEffect(() => {
        if (components.length === 0) {
            setComponentCount(1);
        }
    }, [components]);

    
    const handleClick = () => {
        navigate('/direccion-estrategica/planes/plan-anticorrupcion');
    };

    const handleClickNext = () => {
        navigate('/direccion-estrategica/planes/plan-anticorrupcion/formular-plan/editar/:id');
    };

    useEffect(() => {
        getAllByPlanId(id).then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                console.log('response.data', response.data)
                setComponents([...components, ...response.data]);
            } else {
                console.log(response.operation.message);
            }
        });
    }, [id]);

    const onSave = () => {
        store({ components, planId: Number(id) }).then((response) => {
            if (response && response.operation && response.operation.code === EResponseCodes.OK) {
                setMessage({
                    title: "Guardado exitoso",
                    description: "¡El componente se ha guardado correctamente!",
                    show: true,
                    background: true,
                    OkTitle: "Aceptar",
                    onOk: () => {
                        setMessage({});
                        handleClickNext();
                    },
                });
            } else {
                console.log(response && response.operation && response.operation.message);
            }
        });

        deleteAllByIds(deletedComponents).then((response) => {
            if (response.operation.code === EResponseCodes.OK) {
                console.log("response.data", response.data);
            } else {
                console.log(response.operation.message);
            }
        });
    };

    return (
        <>
            <div className="main-page">
                <div className="card-table">
                    <h2>Formular Plan Anticorrupción y Atención al Ciudadano (PAAC)</h2>
                    <div className="card-table">
                        <section className="select_PAAC">
                            <SelectComponent
                                control={control}
                                idInput={"status"}
                                className={`select-basic span-width`}
                                label="Año"
                                classNameLabel="text-black biggest bold"
                                data={yearsArray}
                                errors={errors}
                                filter={true}
                            />
                        </section>
                    </div>
                    <section className="card-table mt-15">
                        <h3>Componentes</h3>
                        <div className={`text-buttom-circle buttom-formularPAA ${hasAddedComponent ? 'disabled' : ''}`} onClick={handleAddComponent}>
                            Agregar componente <AiOutlinePlusCircle />
                        </div>
                        <div className="card-table mt-15">
                            <table className="table-PAA">
                                <thead>
                                    <tr>
                                        <th className="p-datatable-thead-PAA">Descripción de componente</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {components.length > 0 && components.map((component) => (
                                        <AntiCorruptionGeneralExpansibleTable
                                            key={component.id}
                                            description={component.description}
                                            index={component.index}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                    <div className="container-button-bot space-between">
                        <div></div>
                        <div className="buttons-bot">
                            <span className="bold text-center button" onClick={handleClick}>
                                Cancelar
                            </span>
                            <ButtonComponent
                                className={`button-main huge hover-three button-save`}
                                value={"Guardar y regresar"}
                                type="button"
                                action={() => {
                                    onSave();
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FormulationPAAC;





