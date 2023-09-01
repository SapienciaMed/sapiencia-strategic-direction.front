import React, { useEffect } from "react";
import { FormComponent, InputComponent, SelectComponent, TextAreaComponent, } from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import { Controller, useForm } from "react-hook-form";
import { ICapacityForm, } from "../interfaces/CapacityInterfaces";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { capacityValidator } from "../../../common/schemas/projects-schemas";

interface IProps {
  disableNext: () => void;
  enableNext: () => void;
}

export function CapacityComponent({ disableNext, enableNext, }: IProps): React.JSX.Element {
  const resolver = useYupValidationResolver(capacityValidator);
  const {
    control,
    register,
    formState: { errors, isValid },
  } = useForm<ICapacityForm>({
    resolver,
    mode: "all",
  });

  useEffect(() => {
    if (isValid) {
      enableNext();
    } else {
      disableNext();
    }
  }, [isValid]);

  useEffect(() => {
  }, []);

  return (
    <div className="full-height capacity-page">
      <FormComponent action={undefined} className="">
        <div className="">
          <InputComponent
              idInput="alternative"
              typeInput="text"
              className="input-basic background-textArea"
              register={register}
              label="Nombre de la alternativa"
              classNameLabel="text-black big bold"
              direction={EDirection.column}
              errors={errors}
              disabled={true}
              value="Análisis Técnico"
          />

          <Controller
            control={control}
            name="description"
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
                >
                  <label className="label-max-textarea">
                    Max. 600 caracteres
                  </label>
                </TextAreaComponent>
              );
            }}
          />

          <div className="w-100 group-inputs">
            <div className="w-100">
              <SelectComponent
                idInput="unit"
                className="select-basic"
                control={control}
                errors={errors}
                label="Unidad de medida de la capacidad"
                classNameLabel="text-black big bold text-required"
                direction={EDirection.column}
                placeholder="Seleccionar"
                data={[
                  {
                    name: "Proceso 1",
                    value: "1",
                  },
                  {
                    name: "Proceso 2",
                    value: "2",
                  }
                ]}
              />

            </div>
            
            <div className="w-100">
              <Controller
                control={control}
                name="capacity"
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
