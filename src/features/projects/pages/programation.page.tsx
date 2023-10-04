import React, { useContext, useEffect, useRef, useState } from "react";
import AccordionsComponent from "../../../common/components/accordions.component";
import { ProjectsContext } from "../contexts/projects.context";
import { IAccordionTemplate } from "../../../common/interfaces/accordions.interfaces";
import ProfitsIncomeComponent from "../components/profits-income.component";
import SourceFundingComponent from "../components/source-funding.component";
import LogicFrameComponent from "../components/logicFrame.component";
import IndicatorsFormComponent from "../components/indicators.component";


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
            content: <ProfitsIncomeComponent disableNext={() => { disableAccordions([3]) }} enableNext={() => { enableAccordions([3]) }} setForm={setPlaneFormComponent} />      
        },
        {
            id: 2,
            name: "Fuentes de financiación",
            content: <SourceFundingComponent disableNext={() => { disableAccordions([3]) }} enableNext={() => { enableAccordions([3]) }} setForm={setPlaneFormComponent} />      
        },
        {
            id: 3,
            name: "Indicadores",
            content: <IndicatorsFormComponent disableNext={() => { disableAccordions([3]) }} enableNext={() => { enableAccordions([3]) }} setForm={setPlaneFormComponent} /> 
        },
        {
            id: 4,
            name: "Matríz de marco lógico",
            content: <LogicFrameComponent disableNext={() => { disableAccordions([3]) }} enableNext={() => { enableAccordions([3]) }} setForm={setPlaneFormComponent} />
        },
    ];
    const nextStep = () => {
        setStep(3);
    }
    useEffect(() => {
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