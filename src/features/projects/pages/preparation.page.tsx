import React, { useContext, useRef, useState } from "react";
import AccordionsComponent from "../../../common/components/accordions.component";
import { ProjectsContext } from "../contexts/projects.context";
import { IAccordionTemplate } from "../../../common/interfaces/accordions.interfaces";
import NeedsComponent from "../components/needs.component";
import CapacityComponent from "../components/capacity.component";
import EnvironmentalAnalysisComponent from "../components/environmental-analysis.component";

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
            content: <NeedsComponent disableNext={() => {disableAccordions([3])}} enableNext={() => {enableAccordions([3])}} setForm={setPlaneFormComponent} />
        },
        {
            id: 3,
            name: "Capacidad",
            content: <CapacityComponent disableNext={() => { disableAccordions([4]) }} enableNext={() => { enableAccordions([4]) }} />
        },
        {
            id: 4,
            name: "Análisis Ambiental",
            content: <EnvironmentalAnalysisComponent disableNext={() => { disableAccordions([2]) }} enableNext={() => { enableAccordions([2]) }} />
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
            {PlaneFormComponent}
            <div style={{display: PlaneFormComponent ? "none" : "block"}}>
                <AccordionsComponent data={accordionsData} ref={accordionsComponentRef}/>
            </div>
        </div>
        
    )
}

export default React.memo(PreparationPage);