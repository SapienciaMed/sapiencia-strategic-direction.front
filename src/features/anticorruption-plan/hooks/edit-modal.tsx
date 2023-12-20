import { Dialog } from "primereact/dialog";
import { ButtonComponent } from "../../../common/components/Form";
import "../style/edit-modal.modules.scss";

const EditModal = ({
    showModal,
    onSave,
    editingProject,
    setEditingProject,
    title,
    visible,
    onCloseModal,
}) => {
    const handleInputChange = (e) => {
        setEditingProject((prevProject) => ({
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
                <div className="modal_edit">
                    <label htmlFor="projectName">Nombre</label>
                    <input
                        type="text"
                        id="user"
                        value={editingProject?.user || ''}
                        onChange={handleInputChange}
                    />

                    <label htmlFor="projectDate">Fecha</label>
                    <input
                        type="text"
                        id="dateFrom"
                        value={editingProject?.dateFrom || ''}
                        onChange={handleInputChange}
                    />

                    <label htmlFor="projectDate">Estado</label>
                    <input
                        type="text"
                        id="status"
                        value={editingProject?.dateFrom || ''}
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
            </>
        </Dialog>
    );
};

export default EditModal;
