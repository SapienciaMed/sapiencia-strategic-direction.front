import React, { useContext, useEffect, useRef, useState } from "react";
import AccordionsComponent from "../../../common/components/accordions.component";
import { ProjectsContext } from "../contexts/projects.context";
import { IAccordionTemplate } from "../../../common/interfaces/accordions.interfaces";
import ProfitsIncomeComponent from "../components/profits-income.component";
import SourceFundingComponent from "../components/source-funding.component";
import LogicFrameComponent from "../components/logicFrame.component";
import IndicatorsFormComponent from "../components/indicators.component";
import { profitsIncomeFormValidator, sourceFundingValidator, indicatorsFormValidator, needsValidator, riskValidator, technicalAnalysisValidator, logicFrameFormValidator } from "../../../common/schemas";

function ProgramationPage(): React.JSX.Element {
    
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
            name: "Ingresos y beneficios",
            content: <ProfitsIncomeComponent
                disableNext={() => { 
                        disableAccordions([2]) 
                }} 
                enableNext={() => { 
                        enableAccordions([2]) 
                }} 
                setForm={setPlaneFormComponent} 
            />      
        },
        {
            id: 2,
            name: "Fuentes de financiación",
            content: <SourceFundingComponent 
                disableNext={() => { 
                        disableAccordions([3]) 
                }} 
                enableNext={() => { 
                        enableAccordions([3]) 
                }} 
                setForm={setPlaneFormComponent} 
            />      
        },
        {
            id: 3,
            name: "Indicadores",
            content: <IndicatorsFormComponent 
                disableNext={() => { 
                        disableAccordions([4]) 
                }} 
                enableNext={() => { 
                        enableAccordions([4]) 
                }} 
                setForm={setPlaneFormComponent} 
            /> 
        },
        {
            id: 4,
            name: "Matríz de marco lógico",
            content: <LogicFrameComponent
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
        setStep(4);
    }
    useEffect(() => {
            profitsIncomeFormValidator.validate(projectData?.programation?.profitsIncome).then(() => {
                sourceFundingValidator.validate(projectData?.programation?.sourceFunding).then(() => {
                    indicatorsFormValidator.validate(projectData?.programation?.indicators).then(() => {
                        logicFrameFormValidator.validate(projectData?.programation?.logicFrame).then(() => {
                                disableAccordions([]);
                                setDisableContinue(false);
                                setActionContinue(() => nextStep);
                            }).catch(() => { });
                    }).catch(() => {
                        disableAccordions([4]);
                    });
                }).catch(() => {
                    disableAccordions([3,4]);
                });
            }).catch(() => {
                disableAccordions([2, 3, 4,]);
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

export default React.memo(ProgramationPage);