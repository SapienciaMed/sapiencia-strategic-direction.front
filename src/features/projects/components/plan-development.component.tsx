import React, { useContext, useEffect, useState } from "react";
import {
  ButtonComponent,
  FormComponent,
  TextAreaComponent,
} from "../../../common/components/Form";
import { Controller, useForm } from "react-hook-form";
import {
  IPlanDevelopmentForm,
} from "../interfaces/ProjectsInterfaces";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { ProjectsContext } from "../contexts/projects.context";
import { planDevelopmentValidator } from "../../../common/schemas/projects-schemas";

interface IProps {
  disableNext: () => void;
  enableNext: () => void;
}

export function PlanDevelopmentComponent({
  disableNext,
  enableNext,
}: IProps): React.JSX.Element {
  const [planDevelopmentData, setPlanDevelopment] = useState<IPlanDevelopmentForm>(null);
  const { setProjectData, projectData } = useContext(ProjectsContext);
  const resolver = useYupValidationResolver(planDevelopmentValidator);
  const {
    control,
    register,
    setValue,
    clearErrors,
    formState: { errors, isValid },
    watch,
  } = useForm<IPlanDevelopmentForm>({
    resolver,
    mode: "all",
  });

  useEffect(() => {
    if (projectData)
      setPlanDevelopment(projectData.identification?.planDevelopment);
  }, []);

  useEffect(() => {
    const subscription = watch((value: IPlanDevelopmentForm) =>
      setPlanDevelopment((prev) => {
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
    if (planDevelopmentData)
      setProjectData((prev) => {
        const identification = prev
          ? {
            ...prev.identification,
            planDevelopment: { ...planDevelopmentData },
          }
          : { planDevelopment: { ...planDevelopmentData } };
        return { ...prev, identification: { ...identification } };
      });
  }, [planDevelopmentData]);

  useEffect(() => {
    if (projectData?.identification?.planDevelopment?.pnd_pacto) {
      setValue(
        "pnd_pacto",
        projectData.identification.planDevelopment.pnd_pacto
      );
    }
    if (projectData?.identification?.planDevelopment?.pnd_linea) {
      setValue(
        "pnd_linea",
        projectData.identification.planDevelopment.pnd_linea
      );
    }
    if (projectData?.identification?.planDevelopment?.pnd_programa) {
      setValue(
        "pnd_programa",
        projectData.identification.planDevelopment.pnd_programa
      );
    }
    if (projectData?.identification?.planDevelopment?.pdd_linea) {
      setValue(
        "pdd_linea",
        projectData.identification.planDevelopment.pdd_linea
      );
    }
    if (projectData?.identification?.planDevelopment?.pdd_componentes) {
      setValue(
        "pdd_componentes",
        projectData.identification.planDevelopment.pdd_componentes
      );
    }
    if (projectData?.identification?.planDevelopment?.pdd_programa) {
      setValue(
        "pdd_programa",
        projectData.identification.planDevelopment.pdd_programa
      );
    }
    if (projectData?.identification?.planDevelopment?.pdi_linea) {
      setValue(
        "pdi_linea",
        projectData.identification.planDevelopment.pdi_linea
      );
    }
    if (projectData?.identification?.planDevelopment?.pdi_componentes) {
      setValue(
        "pdi_componentes",
        projectData.identification.planDevelopment.pdi_componentes
      );
    }
    if (projectData?.identification?.planDevelopment?.pdi_programa) {
      setValue(
        "pdi_programa",
        projectData.identification.planDevelopment.pdi_programa
      );
    }
  }, []);

  return (
    <div className="crud-page full-height">
      <FormComponent action={undefined} className="card-form-development">
        <div className="card-table">
          <label className="text-black biggest bold">
            Plan nacional de desarrollo
          </label>
          <div>
            <Controller
              control={control}
              name={"pnd_pacto"}
              defaultValue=""
              render={({ field }) => {
                return (
                  <TextAreaComponent
                    id={field.name}
                    idInput={field.name}
                    value={`${field.value}`}
                    label="Pacto"
                    className="text-area-basic"
                    classNameLabel="text-black big bold text-required label-development"
                    rows={2}
                    placeholder="Escribe aquí"
                    register={register}
                    onChange={field.onChange}
                    errors={errors}
                  >
                    <label className="label-max-textarea">
                      Max. 500 caracteres
                    </label>
                  </TextAreaComponent>
                );
              }}
            />
          </div>
          <div>
            <Controller
              control={control}
              name={"pnd_linea"}
              defaultValue=""
              render={({ field }) => {
                return (
                  <TextAreaComponent
                    id={field.name}
                    idInput={field.name}
                    value={`${field.value}`}
                    label="Línea"
                    className="text-area-basic"
                    classNameLabel="text-black big bold text-required"
                    rows={2}
                    placeholder="Escribe aquí"
                    register={register}
                    onChange={field.onChange}
                    errors={errors}
                  >
                    <label className="label-max-textarea">
                      Max. 500 caracteres
                    </label>
                  </TextAreaComponent>
                );
              }}
            />
          </div>
          <div>
            <Controller
              control={control}
              name={"pnd_programa"}
              defaultValue=""
              render={({ field }) => {
                return (
                  <TextAreaComponent
                    id={field.name}
                    idInput={field.name}
                    value={`${field.value}`}
                    label="Programa"
                    className="text-area-basic"
                    classNameLabel="text-black big bold text-required"
                    rows={2}
                    placeholder="Escribe aquí"
                    register={register}
                    onChange={field.onChange}
                    errors={errors}
                  >
                    <label className="label-max-textarea">
                      Max. 500 caracteres
                    </label>
                  </TextAreaComponent>
                );
              }}
            />
          </div>
        </div>
        <div className="card-table">
          <label className="text-black biggest bold">
            Plan de desarrollo departamental
          </label>
          <div>
            <Controller
              control={control}
              name={"pdd_linea"}
              defaultValue=""
              render={({ field }) => {
                return (
                  <TextAreaComponent
                    id={field.name}
                    idInput={field.name}
                    value={`${field.value}`}
                    label="Pacto"
                    className="text-area-basic"
                    classNameLabel="text-black big bold text-required label-development"
                    rows={2}
                    placeholder="Escribe aquí"
                    register={register}
                    onChange={field.onChange}
                    errors={errors}
                  >
                    <label className="label-max-textarea">
                      Max. 500 caracteres
                    </label>
                  </TextAreaComponent>
                );
              }}
            />
          </div>
          <div>
            <Controller
              control={control}
              name={"pdd_componentes"}
              defaultValue=""
              render={({ field }) => {
                return (
                  <TextAreaComponent
                    id={field.name}
                    idInput={field.name}
                    value={`${field.value}`}
                    label="Componente"
                    className="text-area-basic"
                    classNameLabel="text-black big bold text-required"
                    rows={2}
                    placeholder="Escribe aquí"
                    register={register}
                    onChange={field.onChange}
                    errors={errors}
                  >
                    <label className="label-max-textarea">
                      Max. 500 caracteres
                    </label>
                  </TextAreaComponent>
                );
              }}
            />
          </div>
          <div>
            <Controller
              control={control}
              name={"pdd_programa"}
              defaultValue=""
              render={({ field }) => {
                return (
                  <TextAreaComponent
                    id={field.name}
                    idInput={field.name}
                    value={`${field.value}`}
                    label="Programa"
                    className="text-area-basic"
                    classNameLabel="text-black big bold text-required"
                    rows={2}
                    placeholder="Escribe aquí"
                    register={register}
                    onChange={field.onChange}
                    errors={errors}
                  >
                    <label className="label-max-textarea">
                      Max. 500 caracteres
                    </label>
                  </TextAreaComponent>
                );
              }}
            />
          </div>
        </div>
        <div className="card-table">
          <label className="text-black biggest bold">
            Plan de desarrollo distrital
          </label>
          <div>
            <Controller
              control={control}
              name={"pdi_linea"}
              defaultValue=""
              render={({ field }) => {
                return (
                  <TextAreaComponent
                    id={field.name}
                    idInput={field.name}
                    value={`${field.value}`}
                    label="Línea"
                    className="text-area-basic"
                    classNameLabel="text-black big bold text-required label-development"
                    rows={2}
                    placeholder="Escribe aquí"
                    register={register}
                    onChange={field.onChange}
                    errors={errors}
                  >
                    <label className="label-max-textarea">
                      Max. 500 caracteres
                    </label>
                  </TextAreaComponent>
                );
              }}
            />
          </div>
          <div>
            <Controller
              control={control}
              name={"pdi_componentes"}
              defaultValue=""
              render={({ field }) => {
                return (
                  <TextAreaComponent
                    id={field.name}
                    idInput={field.name}
                    value={`${field.value}`}
                    label="Componente"
                    className="text-area-basic"
                    classNameLabel="text-black big bold text-required"
                    rows={2}
                    placeholder="Escribe aquí"
                    register={register}
                    onChange={field.onChange}
                    errors={errors}
                  >
                    <label className="label-max-textarea">
                      Max. 500 caracteres
                    </label>
                  </TextAreaComponent>
                );
              }}
            />
          </div>
          <div>
            <Controller
              control={control}
              name={"pdi_programa"}
              defaultValue=""
              render={({ field }) => {
                return (
                  <TextAreaComponent
                    id={field.name}
                    idInput={field.name}
                    value={`${field.value}`}
                    label="Programa"
                    className="text-area-basic"
                    classNameLabel="text-black big bold text-required"
                    rows={2}
                    placeholder="Escribe aquí"
                    register={register}
                    onChange={field.onChange}
                    errors={errors}
                  >
                    <label className="label-max-textarea">
                      Max. 500 caracteres
                    </label>
                  </TextAreaComponent>
                );
              }}
            />
          </div>
        </div>
        <div className="container-button-bot-reset">
          <ButtonComponent
            value="Limpiar campos"
            type="button"
            className="button-main huge hover-three"
            action={() => {
              setValue(
                "pnd_pacto",
                ""
              );
              setValue(
                "pnd_linea",
                ""
              );
              setValue(
                "pnd_programa",
                ""
              );
              setValue(
                "pdd_linea",
                ""
              );
              setValue(
                "pdd_componentes",
                ""
              );
              setValue(
                "pdd_programa",
                ""
              );
              setValue(
                "pdi_linea",
                ""
              );
              setValue(
                "pdi_programa",
                ""
              );
              setValue(
                "pdi_componentes",
                ""
              );
              clearErrors();
            }
            }
          />
        </div>
      </FormComponent>
    </div>
  );
}

export default React.memo(PlanDevelopmentComponent);
