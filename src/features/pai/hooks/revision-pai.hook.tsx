import { useFieldArray, useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
import { usePaiService } from "./pai-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { IAccordionTemplate } from "../../../common/interfaces/accordions.interfaces";
import ActionsRevisionComponent from "../components/actions-revision.component";
import { RevisionPAIContext } from "../contexts/revision-pai.context";
import { useEntitiesService } from "./entities-service.hook";
import { useProjectsService } from "./projects-service.hook";
import { IEntities } from "../interfaces/Entities";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { typePAIData } from "../data/dropdowns-revision-pai";

export default function useRevisionPAIData(idPAI: string) {
    const [accordionsActions, setAccordionsActions] = useState<IAccordionTemplate[]>([]);
    const { setPai, setProjectPAI } = useContext(RevisionPAIContext);
    const { getProcessPAI } = useEntitiesService();
    const { getProjectsByFilters } = useProjectsService();
    const { GetPAIById } = usePaiService();
    const {
        register: registerPAI,
        control: controlPAI,
        formState: { errors: errorsPAI },
        setValue,
    } = useForm<any>({ mode: "all" });
    const { fields: fieldsLines } = useFieldArray({
        control: controlPAI,
        name: "linePAI",
    });
    const { fields: fieldsRisks } = useFieldArray({
        control: controlPAI,
        name: "risksPAI",
    });
    useEffect(() => {
        if (!idPAI) return;
        GetPAIById(Number(idPAI)).then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const res = response.data;
                console.log(res);
                setValue("yearPAI", res.yearPAI);
                setValue("budgetPAI", res.budgetPAI);
                setValue("objectivePAI", res.objectivePAI);
                setValue("articulationPAI", res.articulationPAI);
                setValue("linePAI", res.linePAI);
                setValue("risksPAI", res.risksPAI);
                setValue("actionsPAi", res.actionsPAi);
                const typePAI = typePAIData.find(type => type.value === res.typePAI);
                setValue("typePAI", typePAI.name || "");
                if (res.typePAI === 1) {
                    getProjectsByFilters(2).then(response => {
                        if (response.operation.code === EResponseCodes.OK) {
                            const project = response.data.find(project => project.id === res.namePAI);
                            const namePAI = `${project.bpin} - ${project.project}`;
                            setProjectPAI(project);
                            setValue("namePAI", namePAI);
                        }
                    });
                } else if (res.typePAI === 2) {
                    getProcessPAI().then(response => {
                        if (response.operation.code === EResponseCodes.OK) {
                            const entities: IEntities[] = response.data;
                            const arrayEntities: IDropdownProps[] = entities.map((entity) => {
                                return { name: entity.description, value: entity.id };
                            });
                            const namePAI = arrayEntities.find(entity => entity.value === res.namePAI);
                            setValue("namePAI", namePAI.name || "");
                        }
                    }).catch(() => { });
                }
                setAccordionsActions(res.actionsPAi.map((action, index) => {
                    return {
                        id: index,
                        name: `Acción No. ${index + 1}`,
                        content: <ActionsRevisionComponent action={action} />
                    }
                }));
                setPai(res);
            } else {
                console.log(response.operation.message);
            }
        }).catch(err => console.log(err))
    }, [idPAI]);

    return {
        controlPAI,
        registerPAI,
        errorsPAI,
        fieldsLines,
        fieldsRisks,
        accordionsActions
    };
}