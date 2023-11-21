import React, { useContext, useEffect, useRef, useState } from "react";
import AccordionsComponent from "../../../common/components/accordions.component";
import { IAccordionTemplate } from "../../../common/interfaces/accordions.interfaces";
import ProblemDescriptionComponent from "../components/problem-description.component";
import { ProjectsContext } from "../contexts/projects.context";
import PlanDevelopmentComponent from "../components/plan-development.component";
import ObjectivesComponent from "../components/objectives.component";
import ActorCreateComponent from "../components/actor-create.component";
import PoblationComponent from "../components/poblation-component";
import { actorsValidator, objectivesValidator, planDevelopmentValidator, poblationValidator, problemDescriptionValidator } from "../../../common/schemas";

function IdentificationPage(): React.JSX.Element {
    const accordionsComponentRef = useRef(null);
    const { projectData, setDisableContinue, setActionContinue, setStep } = useContext(ProjectsContext);
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
            content: <PlanDevelopmentComponent 
                disableNext={() => { 
                        disableAccordions([2]) 
                }} 
                enableNext={() => { 
                        enableAccordions([2]) 
                }} 
            />
        },
        {
            id: 2,
            name: "Descripción del problema",
            content: <ProblemDescriptionComponent 
                disableNext={() => { 
                        disableAccordions([3]) 
                }} 
                enableNext={() => { 
                        enableAccordions([3]) 
                }} 
            />
        },
        {
            id: 3,
            name: "Objetivos",
            content: <ObjectivesComponent 
                disableNext={() => { 
                        disableAccordions([4]) 
                }} 
                enableNext={() => { 
                        enableAccordions([4]) 
                }} 
            />
        },
        {
            id: 4,
            name: "Actores participantes",
            content: <ActorCreateComponent 
                disableNext={() => { 
                        disableAccordions([5]) 
                }} 
                enableNext={() => { 
                        enableAccordions([5]) 
                }} 
            />
        },
        {
            id: 5,
            name: "Población",
            content: <PoblationComponent
                disableNext={() => {
                    setDisableContinue(true);
                    setActionContinue(() => { });
                }}
                enableNext={() => {
                    setDisableContinue(false);
                    setActionContinue(() => nextStep);
                }}
            />
        },
    ]
    const nextStep = () => {
        setStep(2);
    }

    useEffect(() => {
        planDevelopmentValidator.validate(projectData?.identification?.planDevelopment).then(() => {
            problemDescriptionValidator.validate(projectData?.identification?.problemDescription).then(() => {
                objectivesValidator.validate(projectData?.identification?.objectives).then(() => {
                    actorsValidator.validate(projectData?.identification?.actors).then(() => {
                        poblationValidator.validate(projectData?.identification?.poblation).then(() => {
                            disableAccordions([]);
                            setDisableContinue(false);
                            setActionContinue(() => nextStep);
                        }).catch(( ) => {});
                    }).catch(() => {
                        disableAccordions([5]);
                    })
                }).catch(() => {
                    disableAccordions([4, 5]);
                })
            }).catch(() => {
                disableAccordions([3, 4, 5]);
            })
        }).catch(() => {
            disableAccordions([2, 3, 4, 5]);
        })
        setDisableContinue(true);
    }, []);
    return (
        <AccordionsComponent data={accordionsData} ref={accordionsComponentRef} />
    )
}

export default React.memo(IdentificationPage);