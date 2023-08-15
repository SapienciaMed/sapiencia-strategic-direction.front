import React, { useEffect, useRef } from "react";
import AccordionsComponent from "../../../common/components/accordions.component";
import { IAccordionTemplate } from "../../../common/interfaces/accordions.interfaces";
import ProblemDescriptionComponent from "../components/problem-description.component";

function IdentificationPage(): React.JSX.Element {
    const accordionsComponentRef = useRef(null);
    const accordionsData: IAccordionTemplate[] = [
        {
            id: 1, 
            name: "Plan de desarrollo", 
            content: <p>LoremIpsumTest1</p>
        },
        {
            id: 2, 
            name: "Descripción del problema", 
            content: <ProblemDescriptionComponent />
        },
        {
            id: 3, 
            name: "Objetivos", 
            content: <p>LoremIpsumTest3</p>
        },
        {
            id: 4, 
            name: "Actores participantes", 
            content: <p>LoremIpsumTest3</p>
        },
    ]
    useEffect(() => {
        if (accordionsComponentRef.current) {
            accordionsComponentRef.current.disableAccordions([3,4]);
        }
    }, []);
    return (
        <div>
            <AccordionsComponent data={accordionsData} ref={accordionsComponentRef} />
        </div>
    )
}

export default React.memo(IdentificationPage);