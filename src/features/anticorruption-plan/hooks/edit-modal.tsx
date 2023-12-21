import { Dialog } from "primereact/dialog";
import { ButtonComponent, InputComponent } from "../../../common/components/Form";
import "../style/edit-modal.modules.scss";
import { useEffect } from "react";

const EditModal = ({
    showModal,
    onSave,
    antiCorruptionPlan,
    setAntiCorruptionPlan,
    title,
    visible,
    onCloseModal,
}) => {
    const handleInputChange = (e) => {
        setAntiCorruptionPlan((prevProject) => ({
            ...prevProject,
            [e.target.id]: e.target.value,
        }));
    };

    return (
        <Dialog
            header={title}
            visible={visible}
            style={{ width: "689px" }}
            onHide={onCloseModal}
            pt={{
                headerTitle: {
                    className: "text-title-modal text--black text-center",
                },
                closeButtonIcon: {
                    className: "color--primary close-button-modal",
                },
            }}
        >
            <>
            <div className="card-table">    
                <div className="modal_edit  strategic-direction-grid-1 strategic-direction-grid-3-web">
                    <label htmlFor="projectName">Nombre</label>
                    <input
                        type="text"
                        id="name"
                        value={antiCorruptionPlan?.name || ''}
                        onChange={handleInputChange}
                    />

                    <label htmlFor="projectDate">Fecha</label>
                    <input
                        type="text"
                        id="date"
                        value={antiCorruptionPlan?.date || ''}
                        onChange={handleInputChange}
                    />

                    <label htmlFor="projectDate">Estado</label>
                    <input
                        type="text"
                        id="status"
                        value={antiCorruptionPlan?.status || ''}
                        onChange={handleInputChange}
                    />

                    <button onClick={onSave}>Guardar</button>
                    <ButtonComponent
                        className={`button-main py-12 px-16 font-size-16`}
                        value="Cancelar"
                        type="button"
                        action={onCloseModal}
                        disabled={false}
                    />
                </div>
            </div>
            </>
        </Dialog>
    );
};

export default EditModal;
