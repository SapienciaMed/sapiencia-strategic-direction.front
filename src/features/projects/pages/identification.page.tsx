import React, { useContext, useEffect, useRef } from "react";
import AccordionsComponent from "../../../common/components/accordions.component";
import { IAccordionTemplate } from "../../../common/interfaces/accordions.interfaces";
import ProblemDescriptionComponent from "../components/problem-description.component";
import { ProjectsContext } from "../contexts/projects.context";
import PlanDevelopmentComponent from "../components/plan-development.component";
import ObjectivesComponent from "../components/objectives.component";
import { objectivesValidator, planDevelopmentValidator, problemDescriptionValidator } from "../../../common/schemas";

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
            content: <PlanDevelopmentComponent disableNext={() => { disableAccordions([2]) }} enableNext={() => { enableAccordions([2]) }} />
        },
        {
            id: 2,
            name: "Descripción del problema",
            content: <ProblemDescriptionComponent disableNext={() => { disableAccordions([3]) }} enableNext={() => { enableAccordions([3]) }} />
        },
        {
            id: 3,
            name: "Objetivos",
            content: <ObjectivesComponent disableNext={() => { disableAccordions([4]) }} enableNext={() => { enableAccordions([4]) }} />
        },
        {
            id: 4,
            name: "Actores participantes",
            content: <p>{JSON.stringify(projectData)}</p>
        },
    ]
    useEffect(() => {
        planDevelopmentValidator.validate(projectData?.identification?.planDevelopment).then(() => {
            problemDescriptionValidator.validate(projectData?.identification?.problemDescription).then(() => {
                objectivesValidator.validate(projectData?.identification?.objectives).then(() => {
                    //Poner validacion del siguiente tab
                }).catch(() => {
                    disableAccordions([4]);
                })
            }).catch(() => {
                disableAccordions([3, 4]);
            })
        }).catch(() => {
            disableAccordions([2, 3, 4]);
        })
        setDisableContinue(true);
    }, []);
    return (
        <AccordionsComponent data={accordionsData} ref={accordionsComponentRef} />
    )
}

export default React.memo(IdentificationPage);