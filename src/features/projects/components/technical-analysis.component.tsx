import React, {
    useContext,
    useEffect,
    useState,
  } from "react";
  import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
  import { technicalAnalysisValidator } from "../../../common/schemas";
  import {
    Controller,
    useFieldArray,
    useForm,
    useWatch,
  } from "react-hook-form";
  import {
    FormComponent,
    InputComponent,
    SelectComponent,
    TextAreaComponent,
  } from "../../../common/components/Form";
  import {
  } from "../../../common/interfaces/table.interfaces";
  import {
    ItechnicalAnalysisForm
  } from "../interfaces/ProjectsInterfaces";
  import { AiOutlinePlusCircle } from "react-icons/ai";
  import { IDropdownProps } from "../../../common/interfaces/select.interface";
  import { ProjectsContext } from "../contexts/projects.context";
  import { useGenericListService } from "../../../common/hooks/generic-list-service.hook";
  import { EResponseCodes } from "../../../common/constants/api.enum";
  import { FaTrashAlt } from "react-icons/fa";
  import { IGenericList } from "../../../common/interfaces/global.interface";
  import { ApiResponse } from "../../../common/utils/api-response";
  import { json } from "react-router-dom";
  import { AppContext } from "../../../common/contexts/app.context";
  
  interface IProps {
    disableNext: () => void;
    enableNext: () => void;
  }
  
  export function TechnicalAnalysisComponent({
    disableNext,
    enableNext,
  }: IProps): React.JSX.Element {
    const [technicalAnalysisData, setTechnicalAnalysisData] = useState<ItechnicalAnalysisForm>();
    const { setProjectData, projectData } = useContext(ProjectsContext);
    const resolver = useYupValidationResolver(technicalAnalysisValidator);

    const {
      formState: { errors, isValid },
      watch,
      register,
      control,
    } = useForm<ItechnicalAnalysisForm>({
      resolver,
      mode: "all",
      defaultValues: {
        alternative: projectData?.preparation?.technicalAnalysis?.alternative ? projectData.preparation.technicalAnalysis.alternative : "",
        resumeAlternative: projectData?.preparation?.technicalAnalysis?.resumeAlternative ? projectData.preparation.technicalAnalysis.resumeAlternative : "",
      },
    });
  
    useEffect(() => {
      const subscription = watch((value: ItechnicalAnalysisForm) =>
      setTechnicalAnalysisData((prev) => {
          return { ...prev, ...value };
        })
      );
      return () => subscription.unsubscribe();
    }, [watch]);
  
    useEffect(() => {
      if (isValid) {
        enableNext();
      } else {
        disableNext();
      }
    }, [isValid]);
  
    
    useEffect(() => {
        
      if (technicalAnalysisData)
        setProjectData((prev) => {
          const preparation = prev?.preparation
            ? { ...prev.preparation, technicalAnalysis: { ...technicalAnalysisData } }
            : { technicalAnalysis: { ...technicalAnalysisData } };
          return { ...prev, preparation: { ...preparation } };
        });
    }, [technicalAnalysisData]);
  
    return (
      <FormComponent
        action={undefined}
        className="card-form-development">
        <div className="card-table">
          <label className="text-black biggest bold">
            Análisis Técnico 
          </label>
          <div className="technicalAnalysis-container">
            <div>
            <Controller
                control={control}
                name={"alternative"}
                defaultValue=""
                render={({ field }) => {
                  return (
                    <TextAreaComponent
                      id={field.name}
                      idInput={field.name}
                      value={`${field.value}`}
                      label="Nombre de la alternativa"
                      className="text-area-basic"
                      classNameLabel="text-black biggest bold text-required"
                      rows={2}
                      placeholder="Escribe aquí"
                      register={register}
                      onChange={field.onChange}
                      errors={errors}
                    >
                      <label className="label-max-textarea">
                        Max. 300 caracteres
                      </label>
                    </TextAreaComponent>
                  );
                }}
              />
            </div>
            <div>
              <Controller
                control={control}
                name={"resumeAlternative"}
                defaultValue=""
                render={({ field }) => {
                  return (
                    <TextAreaComponent
                      id={field.name}
                      idInput={field.name}
                      value={`${field.value}`}
                      label="Resumen técnico de la alternativa"
                      className="text-area-basic"
                      classNameLabel="text-black biggest bold text-required"
                      rows={3}
                      placeholder="Escribe aquí"
                      register={register}
                      onChange={field.onChange}
                      errors={errors}
                    >
                      <label className="label-max-textarea">
                        Max. 5000 caracteres
                      </label>
                    </TextAreaComponent>
                  );
                }}
              />
            </div>
          </div>
        </div>
      </FormComponent>
    );
  }

  export default React.memo(TechnicalAnalysisComponent);