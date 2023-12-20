import { Dialog } from "primereact/dialog";
import { ButtonComponent } from "../../../common/components/Form";

const EditModal = ({
    showModal,
    onClose,
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
                <div className="modal">
                    <h2>Editar Proyecto</h2>
                    <label htmlFor="projectName">Nombre del Proyecto:</label>
                    <input
                        type="text"
                        id="user"
                        value={editingProject?.user || ''}
                        onChange={handleInputChange}
                    />

                    <label htmlFor="projectDate">Fecha de Formulación:</label>
                    <input
                        type="text"
                        id="dateFrom"
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
