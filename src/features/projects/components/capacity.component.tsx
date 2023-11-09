import React, { useContext, useEffect, useState } from "react";
import { FormComponent, InputComponent, SelectComponent, TextAreaComponent, } from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import { Controller, useForm } from "react-hook-form";
import { ICapacityForm, } from "../interfaces/ProjectsInterfaces";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import useCrudService from "../../../common/hooks/crud-service.hook";
import { capacityValidator } from "../../../common/schemas/projects-schemas";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { ProjectsContext } from "../contexts/projects.context";

interface IProps {
  disableNext: () => void;
  enableNext: () => void;
}

export function CapacityComponent({ disableNext, enableNext }: IProps): React.JSX.Element {
  const resolver = useYupValidationResolver(capacityValidator);
  const { setProjectData, projectData, setDisableContinue, formAction, setDisableStatusUpdate } = useContext(ProjectsContext);
  const [capacityData, setCapacityData] = useState<ICapacityForm>();
  const [measurementData, setMeasurementData] = useState<IDropdownProps[]>([]);
  const { get } = useCrudService(process.env.urlApiStrategicDirection);
  const {
    control,
    register,
    watch,
    formState: { errors, isValid },
    setValue,
    trigger
  } = useForm<ICapacityForm>({
    resolver,
    mode: "all",
    defaultValues: {
      alternativeCapacity : projectData?.preparation?.capacity?.alternativeCapacity ? projectData.preparation.capacity.alternativeCapacity : "",
      descriptionCapacity : projectData?.preparation?.capacity?.descriptionCapacity ? projectData.preparation.capacity.descriptionCapacity : "",
      unitCapacity : projectData?.preparation?.capacity?.unitCapacity ? projectData.preparation.capacity.unitCapacity : null,
      capacityGenerated : projectData.preparation?.capacity?.capacityGenerated ?  projectData.preparation.capacity.capacityGenerated : null,
    },
  });

  useEffect(() => {
    if ( isValid && formAction === "new" ) {
      enableNext();
    } else if( !isValid && formAction === "new" ) {
        disableNext();
    } else if( isValid && formAction === "edit" ) {
        enableNext();
        setDisableContinue(false);
    } else {      
        setDisableContinue(true);
    }
    setDisableStatusUpdate(!isValid);
  }, [isValid]);

  useEffect(() => {
    const subscription = watch((value: ICapacityForm) =>
    setCapacityData((prev) => {
        return { ...prev, ...value };
      })
    );
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (capacityData)
      setProjectData((prev) => {
        const preparation = prev
          ? { ...prev.preparation, capacity: { ...capacityData } }
          : { capacity: { ...capacityData } };
        return { ...prev, preparation: { ...preparation } };
      });
  }, [capacityData]);

  useEffect(() => {
    get<any>('/api/v1/measurement-capacity').then(response => {
      if (response.operation.code === EResponseCodes.OK) {
        const data: IDropdownProps[] = response.data.map(data => {
          return { name: data.description, value: data.id }
        })
        setMeasurementData(data);
      }
    })
  }, []);
  return (
    <div className="full-height capacity-page card-table">
      <FormComponent action={undefined} className="">
        <div className="">
          <InputComponent
              idInput="alternativeCapacity"
              typeInput="text"
              className="input-basic background-textArea"
              register={register}
              label="Nombre de la alternativa"
              classNameLabel="text-black big bold"
              direction={EDirection.column}
              errors={errors}
              disabled={true}
              value={projectData?.preparation?.technicalAnalysis?.alternative}
          />

          <Controller
            control={control}
            name="descriptionCapacity"
            defaultValue=""
            render={({ field }) => {
              return (
                <TextAreaComponent
                  id={field.name}
                  idInput={field.name}
                  value={`${field.value}`}
                  label="Descripción técnica de la capacidad"
                  className="text-area-basic"
                  classNameLabel="text-black big bold text-required label-development"
                  rows={1}
                  placeholder="Escribe aquí"
                  register={register}
                  onChange={field.onChange}
                  errors={errors}
                  characters={600}
                >
                </TextAreaComponent>
              );
            }}
          />

          <div className="w-100 group-inputs">
            <div className="w-100">
              <SelectComponent
                idInput="unitCapacity"
                className="select-basic"
                control={control}
                errors={errors}
                label="Unidad de medida de la capacidad"
                classNameLabel="text-black big bold text-required"
                direction={EDirection.column}
                placeholder="Seleccionar"
                filter={true}
                data={measurementData}
              />

            </div>
            
            <div className="w-100">
              <Controller
                control={control}
                name="capacityGenerated"
                render={({ field }) => {
                  return (
                    <InputComponent
                      id={field.name}
                      idInput={field.name}
                      value={`${field.value}`}
                      label="Capacidad generada"
                      className="input-basic"
                      classNameLabel="text-black big bold text-required"
                      direction={EDirection.column}
                      typeInput={"number"}
                      register={register}
                      onChange={field.onChange}
                      errors={errors} />
                  );
                }}
              />
            </div>
          </div>
        </div>
      </FormComponent>
    </div>
  );
}

export default React.memo(CapacityComponent);
