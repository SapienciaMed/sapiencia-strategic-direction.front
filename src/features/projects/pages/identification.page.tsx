import React, { useContext, useEffect, useRef } from "react";
import AccordionsComponent from "../../../common/components/accordions.component";
import { IAccordionTemplate } from "../../../common/interfaces/accordions.interfaces";
import ProblemDescriptionComponent from "../components/problem-description.component";
import { ProjectsContext } from "../contexts/projects.context";

function IdentificationPage(): React.JSX.Element {
    const accordionsComponentRef = useRef(null);
    const { projectData, setDisableContinue } = useContext(ProjectsContext);
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
            name: "Plan de desarrollo", 
            content: <p>LoremIpsumTest1</p>
        },
        {
            id: 2, 
            name: "Descripción del problema", 
            content: <ProblemDescriptionComponent disableNext={() => {disableAccordions([3])}} enableNext={() => {enableAccordions([3])}}/>
        },
        {
            id: 3, 
            name: "Objetivos", 
            content: <p>{projectData && JSON.stringify(projectData)}</p>
        },
        {
            id: 4, 
            name: "Actores participantes", 
            content: <p>LoremIpsumTest3</p>
        },
    ]
    useEffect(() => {
        disableAccordions([1,3,4])
        setDisableContinue(true);
    }, []);
    return (
        <AccordionsComponent data={accordionsData} ref={accordionsComponentRef} />
    )
}

export default React.memo(IdentificationPage);