import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import { FormComponent, SelectComponent, TextAreaComponent, } from "../../../common/components/Form";
import { Controller, UseFormHandleSubmit, useForm } from "react-hook-form";
import { IEnvironmentAnalysisForm, IFfectForm } from "../interfaces/EnvironmentalAnalysisInterfaces";
import addIcon from '../../../public/images/icons/icon-add.png';
import TableExpansibleComponent from "./table-expansible.component";
import { ITableAction } from "../../../common/interfaces/table.interfaces";
import { AppContext } from "../../../common/contexts/app.context";
import { EDirection } from "../../../common/constants/input.enum";
import useCrudService from "../../../common/hooks/crud-service.hook";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { useRegisterData } from "../hooks/register.hook";

interface IProps {
  disableNext: () => void;
  enableNext: () => void;
}

export function EnvironmentalAnalysis({ disableNext, enableNext, }: IProps): React.JSX.Element {
  const { effectsColumns } = useRegisterData();
  const {
    control,
    register,
    formState: { errors, isValid },
  } = useForm<IEnvironmentAnalysisForm>({
    mode: "all",
  });
  const EffectCreateComponentRef = useRef(null);
  const { setMessage } = useContext(AppContext);
  const [effects, setEffects] = useState<IFfectForm[]>([])

  useEffect(() => {
    if (isValid) {
      enableNext();
    } else {
      disableNext();
    }
  }, [isValid]);

  
  const EffectsActions: ITableAction<IFfectForm>[] = [
    {
      icon: "Edit",
      onClick: (row) => {
        setMessage({
          title: "Editar efecto ambiental",
          show: true,
          description: (
            <EffectFormComponent
              ref={EffectCreateComponentRef}
              item={{
                id: row.id,
                type:row.type === '/' ? '' : row.type,
                impact: row.impact === '/' ? '' : row.impact,
                level: row.level === '/' ? '' : row.level,
                classification: row.classification === '/' ? '' : row.classification,
                measures: row.measures === '/' ? '' : row.measures
              }}
            />
          ),
          background: true,
          OkTitle: "Aceptar",
          cancelTitle: "Cancelar",
          onOk: () => {
            console.log('data.............', 12312312312312)
            if (EffectCreateComponentRef.current) {
              EffectCreateComponentRef.current.handleSubmit(
                (data: IFfectForm) => {
                  console.log('data.............', data)
                  setMessage({
                    title: "Guardar efecto ambiental",
                    description: "¿Desea guardar el efecto ambiental?",
                    show: true,
                    background: true,
                    OkTitle: "Aceptar",
                    onOk: () => {
                      effects[effects.findIndex(e => e.id === row.id)] = {
                        id: row.id,
                        type: data.type !== '' ? data.type : '/',
                          impact:  data.impact !== '' ? data.impact : '/',
                          level:  data.level !== '' ? data.level : '/',
                          classification:  data.classification !== '' ? data.classification : '/',
                          measures:  data.measures !== '' ? data.measures : '/',
                      };
                      setEffects(effects);
                      setMessage({});
                    },
                    onCancel: () => {
                      setMessage({});
                    },
                    onClose: () => {
                      setMessage({});
                    },
                  });
                }
              )();
            }
          },
          onCancel: () => {
            setMessage({});
          },
          onClose: () => {
            setMessage({});
          },
          style: "causes-effects-modal-size",
        });
      },
    },
    {
      icon: "Delete",
      onClick: (row) => {
        setMessage({
          background: true,
          cancelTitle: "Cancelar",
          description: "¿Desea eliminar el efecto ambiental?",
          OkTitle: "Aceptar",
          onCancel: () => {
            setMessage({});
          },
          onClose: () => {
            setMessage({});
          },
          show: true,
          title: "Eliminar efecto",
          onOk: () => {
            setEffects(effects.filter(effect => effect.id !== row.id));
            setMessage({
              title: "Efecto eliminado",
              description: "¡Efecto ambiental eliminado exitosamente!",
              show: true,
              background: true,
              OkTitle: "Cerrar",
              onOk: () => {
                setMessage({});
              },
              onClose: () => {
                setMessage({});
              },
            });
          },
        });
      },
    },
  ];

  return (
    <div className="environmental-analysis-page full-height">
      <FormComponent action={undefined} className="">
        <div className="">
          <div style={{ paddingBottom: 12 }}>
            <label className="text-black big bold">
              Diagnóstico ambiental
            </label>
          </div>
          <Controller
            control={control}
            name="diagnosis"
            defaultValue=""
            render={({ field }) => {
              return (
                <TextAreaComponent
                  id={field.name}
                  idInput={field.name}
                  value={`${field.value}`}
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


        </div>
      </FormComponent>
      
      <div className="effects-container" style={{ marginTop: 20 }}>
        <div className="effects-container-header" style={{ marginTop: 20 }}>
          <label className="text-black big bold">
            Listado de efectos ambientales
          </label>

          <div
            className="cursor-pointer add-effect"
            onClick={() => {
              setMessage({
                title: "Agregar efecto ambiental",
                description: (
                  <EffectFormComponent ref={EffectCreateComponentRef} />
                ),
                show: true,
                background: true,
                OkTitle: "Guardar",
                cancelTitle: "Cancelar",
                onOk: () => {
                  if (EffectCreateComponentRef.current) {
                    EffectCreateComponentRef.current.handleSubmit(
                      (data: IFfectForm) => {
                        setMessage({
                          title: "Guardar efecto ambiental",
                          description: "¿Desea guardar el efecto ambiental?",
                          show: true,
                          background: true,
                          OkTitle: "Aceptar",
                          onOk: () => {
                            effects.push({
                              id: Array.from({ length: 10 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join(''),
                              type: data.type !== '' ? data.type : '/',
                              impact:  data.impact !== '' ? data.impact : '/',
                              level:  data.level !== '' ? data.level : '/',
                              classification:  data.classification !== '' ? data.classification : '/',
                              measures:  data.measures !== '' ? data.measures : '/',
                            });
                            setEffects(effects);
                            setMessage({
                              title: "Guardar efecto",
                              description: "¡Efecto ambiental guardado exitosamente!",
                              show: true,
                              background: true,
                              OkTitle: "Cerrar",
                              onOk: () => {
                                setMessage({});
                              },
                              onClose: () => {
                                setMessage({});
                              },
                            });
                          },
                          onCancel: () => {
                            setMessage({});
                          },
                          onClose: () => {
                            setMessage({});
                          },
                        });
                       
                        
                      }
                    )();
                  }
                },
                onCancel: () => {
                  setMessage({});
                },
                onClose: () => {
                  setMessage({});
                },
                style: "causes-effects-modal-size",
              });
            }}
          >
            <span>Añadir efecto ambiental</span>
            <img style={{ marginLeft: 4 }} width={16} src={addIcon} alt="add" />
          </div>
        </div>
        {
          effects.length > 0 ? (
            <TableExpansibleComponent
              actions={EffectsActions}
              columns={effectsColumns}
              data={effects}
            />
          ) : null
        }
          
      </div>
    </div>
  );
}



interface IRef {
  handleSubmit: UseFormHandleSubmit<any>;
}

interface IPropsEffectssForm {
  counter?: number;
  item?: IFfectForm;
}

const EffectFormComponent = forwardRef<IRef, IPropsEffectssForm>((props, ref) => {
  const { item } = props;
  const [levels, setLevels] = useState<IDropdownProps[]>([]);
  const [types, setTypes] = useState<IDropdownProps[]>([]);
  const [ratings, setRatings] = useState<IDropdownProps[]>([]);
  const { get } = useCrudService(process.env.urlApiStrategicDirection);

  useEffect(() => {
    get<any>('/api/v1/impact-level').then(response => {
      if (response.operation.code === EResponseCodes.OK) {
        const data: IDropdownProps[] = response.data.map(data => {
          return { name: data.description, value: data.id }
        })
        setLevels(data);
      }
    })
    get<any>('/api/v1/impact-type').then(response => {
      if (response.operation.code === EResponseCodes.OK) {
        const data: IDropdownProps[] = response.data.map(data => {
          return { name: data.description, value: data.id }
        })
        setTypes(data);
      }
    })
    get<any>('/api/v1/impact-rating').then(response => {
      if (response.operation.code === EResponseCodes.OK) {
        const data: IDropdownProps[] = response.data.map(data => {
          return { name: data.description, value: data.id }
        })
        setRatings(data);
      }
    })
  }, []);

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm<IFfectForm>({ mode: "all", defaultValues: item ? {...item} : {} });

  useImperativeHandle(ref, () => ({
    handleSubmit: handleSubmit,
  }));

  return (
    <FormComponent action={undefined} className="effect-form w-100">

      <div className="w-100" style={{ marginTop: 20 }}>
        <Controller
          control={control}
          name="type"
          defaultValue=""
          render={({ field }) => {
            return (
              <SelectComponent
                idInput={field.name}
                className="select-basic"
                control={control}
                errors={errors}
                label="Tipo de impacto"
                classNameLabel="text-black big bold"
                direction={EDirection.column}
                data={types}
              />
            );
          }}
        />
      </div>
      
      <div style={{ marginTop: 20 }}>
        <Controller
          control={control}
          name="impact"
          defaultValue=""
          render={({ field }) => {
            return (
              <TextAreaComponent
                id={field.name}
                idInput={field.name}
                value={`${field.value}`}
                label="Impacto"
                classNameLabel="text-black big bold"
                className="text-area-basic"
                placeholder="Escribe aquí"
                register={register}
                onChange={field.onChange}
                rows={1}
                errors={errors}
              />
            );
          }}
        />
      </div>
      
      <div className="group-inputs" style={{ marginTop: 20 }}>
        <Controller
          control={control}
          name="classification"
          defaultValue=""
          render={({ field }) => {
            return (
              <SelectComponent
                idInput={field.name}
                className="select-basic"
                control={control}
                errors={errors}
                label="Clasificación"
                classNameLabel="text-black big bold"
                direction={EDirection.column}
                data={ratings}
              />
            );
          }}
        />

        <Controller
          control={control}
          name="level"
          defaultValue=""
          render={({ field }) => {
            return (
              <SelectComponent
                idInput={field.name}
                className="select-basic"
                control={control}
                errors={errors}
                label="Nivel de impacto"
                classNameLabel="text-black big bold"
                direction={EDirection.column}
                data={levels}
              />
            );
          }}
        />
      </div>
      
      <div style={{ marginTop: 20 }}>
        <Controller
          control={control}
          name="measures"
          defaultValue=""
          render={({ field }) => {
            return (
              <TextAreaComponent
                id={field.name}
                idInput={field.name}
                value={`${field.value}`}
                label="Medidas de mitigación"
                classNameLabel="text-black big bold"
                className="text-area-basic"
                placeholder="Escribe aquí"
                register={register}
                onChange={field.onChange}
                rows={1}
                errors={errors}
              />
            );
          }}
        />

      </div>
    </FormComponent>
  );
});


export default React.memo(EnvironmentalAnalysis);