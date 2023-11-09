import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import { FormComponent, SelectComponent, TextAreaComponent, } from "../../../common/components/Form";
import { Controller, UseFormHandleSubmit, useForm } from "react-hook-form";
import addIcon from '../../../public/images/icons/icon-add.png';
import TableExpansibleComponent from "./table-expansible.component";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { AppContext } from "../../../common/contexts/app.context";
import { EDirection } from "../../../common/constants/input.enum";
import useCrudService from "../../../common/hooks/crud-service.hook";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { environmentalFffectsValidator, environmentalAnalysisValidator } from "../../../common/schemas";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { ProjectsContext } from "../contexts/projects.context";
import { IEffectEnviromentForm, IEnvironmentAnalysisForm } from "../interfaces/ProjectsInterfaces";
interface IProps {
  disableNext: () => void;
  enableNext: () => void;
}

export function EnvironmentalAnalysis({ disableNext, enableNext }: IProps): React.JSX.Element {
  const [environmentalAnalysisData, setEnvironmentalAnalysisData] = useState<IEnvironmentAnalysisForm>();
  const resolver = useYupValidationResolver(environmentalAnalysisValidator);
  const { setProjectData, projectData, setDisableContinue, formAction, setDisableStatusUpdate } = useContext(ProjectsContext);
  const {
    control,
    register,
    watch,
    formState: { errors, isValid },
    setValue,
    getValues,
    trigger
  } = useForm<IEnvironmentAnalysisForm>({
    resolver, mode: "all",
    defaultValues: {
      environmentDiagnosis: projectData?.preparation?.enviromentalAnalysis?.environmentDiagnosis ? projectData.preparation.enviromentalAnalysis.environmentDiagnosis : "",
      effects: projectData?.preparation?.enviromentalAnalysis?.effects ? projectData.preparation.enviromentalAnalysis.effects : [],
    },
  });
  const EffectCreateComponentRef = useRef(null);
  const { setMessage } = useContext(AppContext);
  const effectsColumns: ITableElement<IEffectEnviromentForm>[] = [
    {
      fieldName: "type",
      header: "Tipo de impacto",
    },
    {
      fieldName: "impact",
      header: "Impacto",
    },
    {
      fieldName: "level",
      header: "Nivel de impacto",
    },
    {
      fieldName: "classification",
      header: "Clasificación",
    },
    {
      fieldName: "measures",
      header: "Medidas de mitigación",
    },
  ];

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

  useEffect(() => {

    if (environmentalAnalysisData)
      setProjectData((prev) => {
        const preparation = prev?.preparation
          ? { ...prev.preparation, enviromentalAnalysis: { ...environmentalAnalysisData } }
          : { enviromentalAnalysis: { ...environmentalAnalysisData } };
        return { ...prev, preparation: { ...preparation } };
      });
  }, [environmentalAnalysisData]);

  useEffect(() => {
    const subscription = watch((value: IEnvironmentAnalysisForm) =>
      setEnvironmentalAnalysisData((prev) => {
        return { ...prev, ...value };
      })
    );
    return () => subscription.unsubscribe();
  }, [watch]);

  const EffectsActions: ITableAction<IEffectEnviromentForm>[] = [
    {
      icon: "Edit",
      onClick: (row) => {
        setMessage({
          title: "Editar efecto ambiental",
          show: true,
          description:
            <EffectFormComponent
              types={types} ratings={ratings} levels={levels}
              ref={EffectCreateComponentRef}
              item={{
                id: row.id,
                type: row.type === null || row.type === undefined ? null : Number(types.find((type) => type.value === row.type)?.value),
                impact: row.type === null ? null : row.impact,
                level: row.type === null || row.type === undefined ? null : Number(levels.find((level) => level.value === row.level)?.value),
                classification: row.type === null || row.type === undefined ? null : Number(ratings.find((rating) => rating.value === row.classification)?.value),
                measures: row.type === null ? null : row.measures
              }}
            />,
          background: true,
          OkTitle: "Aceptar",
          cancelTitle: "Cancelar",
          onOk: () => {
            if (EffectCreateComponentRef.current) {
              EffectCreateComponentRef.current.handleSubmit(
                (data: IEffectEnviromentForm) => {
                  setMessage({
                    title: "Guardar efecto ambiental",
                    description: "¿Deseas guardar el efecto ambiental?",
                    show: true,
                    background: true,
                    OkTitle: "Aceptar",
                    cancelTitle: "Cancelar",
                    onOk: () => {
                      setEnvironmentalAnalysisData(prev => {
                        const effects = prev?.effects.map(effect => {
                          if(JSON.stringify(effect) === JSON.stringify(row)) {
                            return data;
                          } else {
                            return effect;
                          }
                        });
                        return { ...prev, effects: effects };
                      });
                      setValue('effects', getValues('effects').map(effect => {
                        if(JSON.stringify(effect) === JSON.stringify(row)) {
                          return data;
                        } else {
                          return effect;
                        }
                      }));
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
      },
    },
    {
      icon: "Delete",
      onClick: (row) => {
        setMessage({
          background: true,
          cancelTitle: "Cancelar",
          description: "¿Deseas eliminar el efecto ambiental?",
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
            setEnvironmentalAnalysisData(prev => {
              const effects = prev?.effects?.filter(effect => JSON.stringify(effect) !== JSON.stringify(row));
              return { ...prev, effects: effects };
            });
            setValue('effects', getValues('effects').filter(effect => JSON.stringify(effect) !== JSON.stringify(row)));
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
    <div className="environmental-analysis-page full-height card-table">
      <FormComponent action={undefined} className="">
        <div className="">
          <div style={{ paddingBottom: 12 }}>
            <label className="text-black big bold">
              Diagnóstico ambiental
            </label>
          </div>
          <Controller
            control={control}
            name="environmentDiagnosis"
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
                  characters={600}
                >
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
                  <EffectFormComponent ref={EffectCreateComponentRef} types={types} ratings={ratings} levels={levels} />
                ),
                show: true,
                background: true,
                OkTitle: "Guardar",
                cancelTitle: "Cancelar",
                onOk: () => {
                  if (EffectCreateComponentRef.current) {
                    EffectCreateComponentRef.current.handleSubmit(
                      (data: IEffectEnviromentForm) => {
                        setMessage({
                          title: "Guardar efecto ambiental",
                          description: "¿Deseas guardar el efecto ambiental?",
                          show: true,
                          background: true,
                          OkTitle: "Aceptar",
                          cancelTitle: "Cancelar",
                          onOk: () => {
                            setEnvironmentalAnalysisData(prev => {
                              const effects = prev?.effects ? prev.effects.concat(data) : [data];
                              return { ...prev, effects: effects };
                            });
                            setValue('effects', getValues('effects').concat(data));
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
            <span style={{ color: '#533893' }} className="text-add-effect">Añadir efecto ambiental</span>
            <img style={{ marginLeft: 4 }} width={16} src={addIcon} alt="add" />
          </div>
        </div>
        {getValues('effects').length > 0 && <TableExpansibleComponent actions={EffectsActions} columns={effectsColumns} data={getValues('effects')} />}

      </div>
    </div>
  );
}



interface IRef {
  handleSubmit: UseFormHandleSubmit<any>;
}

interface IPropsEffectssForm {
  counter?: number;
  item?: IEffectEnviromentForm;
  types: IDropdownProps[];
  ratings: IDropdownProps[];
  levels: IDropdownProps[];
}

const EffectFormComponent = forwardRef<IRef, IPropsEffectssForm>((props, ref) => {
  const { item, types, ratings, levels } = props;
  const resolver = useYupValidationResolver(environmentalFffectsValidator);
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm<IEffectEnviromentForm>({ resolver, mode: "all", defaultValues: item ? { ...item } : {} });

  useImperativeHandle(ref, () => ({
    handleSubmit: handleSubmit,
  }));

  return (
    <FormComponent action={undefined} className="effect-form w-100">

      <div className="w-100" style={{ marginTop: 20 }}>
        <Controller
          control={control}
          name="type"
          defaultValue={null}
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
                filter={true}
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
                characters={300}
              >
              </TextAreaComponent>
            );
          }}
        />
      </div>

      <div className="group-inputs" style={{ marginTop: 20 }}>
        <Controller
          control={control}
          name="classification"
          defaultValue={null}
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
                filter={true}
                data={ratings}
              />
            );
          }}
        />

        <Controller
          control={control}
          name="level"
          defaultValue={null}
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
                filter={true}
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
                characters={500}
              >
              </TextAreaComponent>
            );
          }}
        />

      </div>
    </FormComponent>
  );
});


export default React.memo(EnvironmentalAnalysis);
