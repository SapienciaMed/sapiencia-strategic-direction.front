import { Dialog } from "primereact/dialog";
import { ButtonComponent, DatePickerComponent, InputComponent, SelectComponent } from "../../../common/components/Form";
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
    setVisible,
    control,
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
    console.log("fecha",antiCorruptionPlan?.date)
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
                            <label className="label_modal" htmlFor="projectName">Nombre</label>
                            <input className="input_component"
                                type="text"
                                id="name"
                                value={antiCorruptionPlan?.name || ''}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="input_content">
                            {/* <DatePickerComponent
                                control={control}
                                idInput="date"
                                dateFormat="dd/mm/yy"
                                className="dataPicker-basic span-width"
                                label="Fecha"
                                classNameLabel="text-black biggest bold"
                                minDate={new Date()}
                                value={antiCorruptionPlan?.date ? new Date(antiCorruptionPlan.date) : null}
                                onChange={handleInputChange}
                            /> */}
                            <label className="label_modal" htmlFor="projectName">Nombre</label>
                            <input className="input_component date_picker"
                                type="date"
                                id="date"
                                value={antiCorruptionPlan?.date || ''}
                                onChange={handleInputChange}
                            />
                        </div>


                        <div className="input_content">
                            <SelectComponent
                                control={control}
                                idInput={"status"}
                                className={`select-basic span-width`}
                                label="Estado"
                                classNameLabel="text-black biggest bold"
                                data={statusData}
                                value={antiCorruptionPlan?.status || ''}
                                filter={true}
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
