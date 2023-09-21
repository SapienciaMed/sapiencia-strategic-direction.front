import React, { useContext, useEffect, useRef, useState } from "react";
import AccordionsComponent from "../../../common/components/accordions.component";
import { ProjectsContext } from "../contexts/projects.context";
import { IAccordionTemplate } from "../../../common/interfaces/accordions.interfaces";
import NeedsComponent from "../components/needs.component";
import CapacityComponent from "../components/capacity.component";
import EnvironmentalAnalysisComponent from "../components/environmental-analysis.component";
import TechnicalAnalysisComponent from "../components/technical-analysis.component";
import ActivitiesComponent from "../components/activities.component";
import RisksComponent from "../components/risks.component";
import { activitiesValidator, capacityValidator, environmentalAnalysisValidator, needsValidator, riskValidator, technicalAnalysisValidator } from "../../../common/schemas";

function PreparationPage(): React.JSX.Element {
    const accordionsComponentRef = useRef(null);
    const { projectData, setDisableContinue, setActionContinue, setStep } = useContext(ProjectsContext);
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
            content: <TechnicalAnalysisComponent disableNext={() => { disableAccordions([2]) }} enableNext={() => { enableAccordions([2]) }} />
        },
        {
            id: 2,
            name: "Necesidades",
            content: <NeedsComponent disableNext={() => { disableAccordions([3]) }} enableNext={() => { enableAccordions([3]) }} setForm={setPlaneFormComponent} />
        },
        {
            id: 3,
            name: "Capacidad",
            content: <CapacityComponent disableNext={() => { disableAccordions([4]) }} enableNext={() => { enableAccordions([4]) }} />
        },
        {
            id: 4,
            name: "Análisis Ambiental",
            content: <EnvironmentalAnalysisComponent disableNext={() => { disableAccordions([5]) }} enableNext={() => { enableAccordions([5]) }} />
        },
        {
            id: 5,
            name: "Actividades",
            content: <ActivitiesComponent disableNext={() => { disableAccordions([6]) }} enableNext={() => { enableAccordions([6]) }} setForm={setPlaneFormComponent} />
        },
        {
            id: 6,
            name: "Riesgos",
            content: <RisksComponent
                disableNext={() => {
                    setDisableContinue(true);
                    setActionContinue(() => { });
                }}
                enableNext={() => {
                    setDisableContinue(false);
                    setActionContinue(() => nextStep);
                }}
                setForm={setPlaneFormComponent}
            />
        },
    ];
    const nextStep = () => {
        setStep(3);
    }
    useEffect(() => {
        technicalAnalysisValidator.validate(projectData?.preparation?.technicalAnalysis).then(() => {
            needsValidator.validate(projectData?.preparation?.needs).then(() => {
                capacityValidator.validate(projectData?.preparation?.capacity).then(() => {
                    environmentalAnalysisValidator.validate(projectData?.preparation?.enviromentalAnalysis).then(() => {
                        activitiesValidator.validate(projectData?.preparation?.activities).then(() => {
                            riskValidator.validate(projectData?.preparation?.risks).then(() => {
                                disableAccordions([]);
                                setDisableContinue(false);
                                setActionContinue(() => nextStep);
                            }).catch(() => { });
                        }).catch(() => {
                            disableAccordions([6]);
                        });
                    }).catch(() => {
                        disableAccordions([5, 6]);
                    });
                }).catch(() => {
                    disableAccordions([4, 5, 6]);
                });
            }).catch(() => {
                disableAccordions([3, 4, 5, 6]);
            });
        }).catch(() => {
            disableAccordions([2, 3, 4, 5, 6]);
        });
        setDisableContinue(true);
    }, []);
    return (
        <div>
            {PlaneFormComponent}
            <div style={{ display: PlaneFormComponent ? "none" : "block" }}>
                <AccordionsComponent data={accordionsData} ref={accordionsComponentRef} />
            </div>
        </div>

    )
}

export default React.memo(PreparationPage);