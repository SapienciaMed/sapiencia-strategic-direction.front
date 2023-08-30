import React, { useContext, useRef, useState } from "react";
import AccordionsComponent from "../../../common/components/accordions.component";
import { ProjectsContext } from "../contexts/projects.context";
import { IAccordionTemplate } from "../../../common/interfaces/accordions.interfaces";
import NeedsComponent from "../components/needs.component";

function PreparationPage(): React.JSX.Element {
    const accordionsComponentRef = useRef(null);
    const {} = useContext(ProjectsContext);
    const [PlaneFormComponent, setPlaneFormComponent] = useState<React.JSX.Element | null>(null)
    const disableAccordions = (ids: number[] | string[]) => {
        if (accordionsComponentRef.current) {
            accordionsComponentRef.current.disableAccordions(ids);
        }
    }
    const enableAccordions = (ids: number[] | string[]) => {
        if (accordionsComponentRef.current) {
            accordionsComponentRef.current.enableAccordions(ids);
        }
    }
    const accordionsData: IAccordionTemplate[] = [
        {
            id: 1,
            name: "Análisis Técnico",
            content: <>Aqui va tu componente</>
        },
        {
            id: 2,
            name: "Necesidades",
            content: <NeedsComponent disableNext={() => {}} enableNext={() => {}} setForm={setPlaneFormComponent} />
        },
        {
            id: 3,
            name: "Capacidad",
            content: <>Aqui va tu componente</>
        },
        {
            id: 4,
            name: "Análisis Ambiental",
            content: <>Aqui va tu componente</>
        },
        {
            id: 5,
            name: "Actividades",
            content: <>Aqui va tu componente</>
        },
        {
            id: 6,
            name: "Riesgos",
            content: <>Aqui va tu componente</>
        },
    ];
    return (
        <div>
            <div>
                {PlaneFormComponent}
            </div>
            <div style={{display: PlaneFormComponent ? "none" : "block"}}>
                <AccordionsComponent data={accordionsData} ref={accordionsComponentRef}/>
            </div>
        </div>
        
    )
}

export default React.memo(PreparationPage);