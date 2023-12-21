import { Dialog } from "primereact/dialog";
import { ButtonComponent, InputComponent } from "../../../common/components/Form";
import "../style/edit-modal.scss";
import { useEffect, useState } from "react";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { useAntiCorruptionPlanStatusService } from "./anti-corruption-plan-status-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";

const EditModal = ({
    onSave,
    antiCorruptionPlan,
    setAntiCorruptionPlan,
    title,
    visible,
    onCloseModal,
    setVisible
}) => {
    const handleInputChange = (e) => {
        setAntiCorruptionPlan((prevProject) => ({
            ...prevProject,
            [e.target.id]: e.target.value,
        }));
    };
    const [count, setCount] = useState(setVisible);
    const closeModal = () => { 
        setVisible(2);
    };
    const { getAll } = useAntiCorruptionPlanStatusService();
    const [statusData, setStatusData] = useState<IDropdownProps[]>([]);
    const [ready, setReady] = useState<boolean>(false);
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

    return (
        <Dialog
            header={title}
            visible={visible}
            style={{ width: "850px", borderRadius: "16px", padding: "10px", backgroundColor: "#FFF" }}
            onHide={closeModal}
            pt={{
                headerTitle: {
                    className: "text-title-modal text--black text-center title-modal",
                },
                closeButtonIcon: {
                    className: "color--primary close-button-modal",
                },
            }}
        >
            <>
                <div className="card-table">
                    <div className="modal_edit  strategic-direction-grid-1 strategic-direction-grid-3-web">
                        <div className="input_content">
                            <label htmlFor="projectName">Nombre</label>
                            <input className="input_component"
                                type="text"
                                id="name"
                                value={antiCorruptionPlan?.name || ''}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="input_content">
                            <label htmlFor="projectDate">Fecha</label>
                            <input className="input_component"
                                type="text"
                                id="date"
                                value={antiCorruptionPlan?.date || ''}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="input_content">
                            <label htmlFor="projectDate">Estado</label>
                            <input className="input_component"
                                type="text"
                                id="status"
                                value={antiCorruptionPlan?.status || ''}
                                onChange={handleInputChange}
                            />
                        </div>


                    </div>
                </div>
                <div className="content_button">
                    <button className="button_save" onClick={onSave}>Guardar</button>
                    <ButtonComponent
                        className={`button_cancel`}
                        value="Cancelar"
                        type="button"
                        action={closeModal}
                        disabled={false}
                        visible={true}
                    />
                </div>

            </>
        </Dialog>
    );
};

export default EditModal;
