import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import {
    actorsFormValidator,
    actorsValidator
} from "../../../common/schemas";
import {
  Controller,
  UseFormHandleSubmit,
  useForm,
} from "react-hook-form";
import {
  FormComponent,
  SelectComponent,
  TextAreaComponent,
} from "../../../common/components/Form";
import TableExpansibleComponent from "./table-expansible.component";
import {
  ITableAction,
  ITableElement,
} from "../../../common/interfaces/table.interfaces";
import {
  ICause,
  IEffect,
  IActorsForm,
  IParticipatingActors,
} from "../interfaces/ProjectsInterfaces";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { AppContext } from "../../../common/contexts/app.context";
import { ProjectsContext } from "../contexts/projects.context";
import { useEntitiesService } from "../hooks/entities-service.hook";
import { IEntities } from "../interfaces/Entities";
import { EResponseCodes } from "../../../common/constants/api.enum";

interface IProps {
  disableNext: () => void;
  enableNext: () => void;
}

export function ActorCreateComponent({
  disableNext,
  enableNext,
}: IProps): React.JSX.Element {
  const ActorCreateComponentRef = useRef(null);
  const [ActorCreateData, setActorCreateData] = useState<IActorsForm>();
  const { setProjectData, projectData, setDisableContinue, formAction, isADisabledInput, setDisableStatusUpdate } = useContext(ProjectsContext);
  const { setMessage } = useContext(AppContext);
  const { GetEntitiesPosition } = useEntitiesService();
  const resolver = useYupValidationResolver(actorsValidator);
  const [ positionData, setPositionData] = useState<IDropdownProps[]>([]);

  const {
    getValues,
    setValue,
    formState: { errors, isValid },
    watch,
    trigger
  } = useForm<IActorsForm>({
    resolver,
    mode: "all",
    defaultValues: {
      actors: projectData?.identification?.actors?.actors
        ? projectData.identification.actors.actors
        : [],
    },
  });

  useEffect(() => {
    if (projectData) setActorCreateData(projectData.identification?.actors);
  }, []);


  useEffect(() => {
    const subscription = watch((value: IActorsForm) =>
      setActorCreateData((prev) => {
        return { ...prev, ...value };
      })
    );
    return () => subscription.unsubscribe();
  }, [watch]);

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
    if (ActorCreateData)
      setProjectData((prev) => {
        const identification = prev
          ? { ...prev.identification, actors: { ...ActorCreateData } }
          : { actors: { ...ActorCreateData } };
        return { ...prev, identification: { ...identification } };
      });
  }, [ActorCreateData]);

  useEffect(() => {
    GetEntitiesPosition().then(response => {
        if (response.operation.code === EResponseCodes.OK) {
            const entities: IEntities[] = response.data;
            const arrayEntities: IDropdownProps[] = entities.map((entity)  => {
                return { name: entity.description, value: entity.id };
            });
              setPositionData(arrayEntities);
        }
    }).catch(() => { });
}, [])


  const actorColumns: ITableElement<IParticipatingActors>[] = [
    {
      fieldName: "actor",
      header: "Actor",
    },
    {
      fieldName: "expectation",
      header: "Interés/Expectativa",
    },
    {
      fieldName: "position",
      header: "Posición",
       renderCell: (row) => {
        console.log(positionData,"render");
        const stage = positionData?.find(stage => stage.value === Number(row.position)) || null;
         return <>{stage?.name}</>
      },
    },
    {
      fieldName: "contribution",
      header: "Contribución",
    },
  ];
  const actorActions: ITableAction<IParticipatingActors>[] = [
    {
      icon: "Edit",
      onClick: (row) => {
        setMessage({
          title: "Editar Actor",
          description: (
            <ActorFormComponent ref={ActorCreateComponentRef} item={row} />
          ),
          show: true,
          background: true,
          OkTitle: "Guardar",
          cancelTitle: "Cancelar",
          onOk: () => {
            if (ActorCreateComponentRef.current) {
              ActorCreateComponentRef.current.handleSubmit(
                (data: IParticipatingActors) => {
                  const newActors = getValues("actors")
                    .filter((actor) => actor !== row)
                    .concat(data)
                  setActorCreateData((prev) => {
                    return { ...prev, actors: newActors };
                  });
                  setValue("actors", newActors);
                  trigger("actors");
                  setMessage({
                    title: "Se editó exitosamente",
                    description: "Se ha editado el actor exitosamente",
                    show: true,
                    background: true,
                    OkTitle: "Aceptar",
                    onOk: () => {
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
      hideRow: () => isADisabledInput
    },
    {
      icon: "Delete",
      onClick: (row) => {
        setMessage({
          background: true,
          cancelTitle: "Cancelar",
          description: "No se podrá recuperar",
          OkTitle: "Aceptar",
          onCancel: () => {
            setMessage({});
          },
          onClose: () => {
            setMessage({});
          },
          show: true,
          title: "¿Deseas quitar el actor?",
          onOk: () => {
            const newActors = getValues("actors").filter((actor) =>
              actor !== row
            );
            setActorCreateData((prev) => {
              return { ...prev, actors: newActors };
            });
            setValue("actors", newActors);
            trigger("actors");
            setMessage({});
          },
        });
      },
      hideRow: () => isADisabledInput
    },
  ];
  
  return (
    <div className="main-page">
      <FormComponent
        action={undefined}
        className="problem-description-container"
      >
        <div>
          <div className="title-area">
            <label className="text-black biggest bold text-required">
              Listado de actores
            </label>

            <div
              className="title-button text-main biggest"
              onClick={() => {
                setMessage({
                  title: "Agregar Actor",
                  description: (
                    <ActorFormComponent ref={ActorCreateComponentRef} />
                  ),
                  show: true,
                  background: true,
                  OkTitle: "Guardar",
                  cancelTitle: "Cancelar",
                  onOk: () => {
                    if (ActorCreateComponentRef.current) {
                      ActorCreateComponentRef.current.handleSubmit(
                        (data: IParticipatingActors) => {
                          setActorCreateData((prev) => {
                            const actors = prev?.actors
                              ? prev.actors.concat(data)
                              : [data];
                            return { ...prev, actors: actors };
                          });
                          setValue("actors", getValues("actors").concat(data));
                          trigger("actors");
                          setMessage({
                            title: "Se guardó exitosamente",
                            description: "Se ha agregado una  exitosamente",
                            show: true,
                            background: true,
                            OkTitle: "Aceptar",
                            onOk: () => {
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
              { !isADisabledInput && ( <div> Añadir actores <AiOutlinePlusCircle /> </div> ) }
            </div>
          </div>
          {
            <TableExpansibleComponent
              actions={actorActions}
              columns={actorColumns}
              data={getValues("actors")}
              hideActions={isADisabledInput}
            />
          }
        </div>
      </FormComponent>
    </div>
  );
}

interface IRef {
  handleSubmit: UseFormHandleSubmit<ICause | IEffect>;
}

interface IPropsActorsForm {
  counter?: number;
  item?: IParticipatingActors;
}

const ActorFormComponent = forwardRef<IRef, IPropsActorsForm>((props, ref) => {
  const { item } = props;
  const resolver = useYupValidationResolver(actorsFormValidator);
  const { GetEntitiesPosition } = useEntitiesService();
  const [ positionData, setPositionData] = useState<IDropdownProps[]>([]);
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm<IParticipatingActors>({ resolver, mode: "all", defaultValues: item ? {...item} : {} });

  useImperativeHandle(ref, () => ({
    handleSubmit: handleSubmit,
  }));

  useEffect(() => {
    GetEntitiesPosition().then(response => {
        if (response.operation.code === EResponseCodes.OK) {
            const entities: IEntities[] = response.data;
            const arrayEntities: IDropdownProps[] = entities.map((entity) => {
                return { name: entity.description, value: entity.id };
            });
            setPositionData(arrayEntities);
        }
    }).catch(() => { });
}, [])

  return (
    <FormComponent action={undefined} className="actors-form-container">
      <Controller
        control={control}
        name={"actor"}
        defaultValue=""
        render={({ field }) => {
          return (
            <TextAreaComponent
              id={field.name}
              idInput={field.name}
              value={`${field.value}`}
              label="Actor"
              classNameLabel="text-black biggest bold text-required"
              className="text-area-basic"
              placeholder="Escribe aquí"
              register={register}
              onChange={field.onChange}
              errors={errors}
            />
          );
        }}
      />

      <Controller
        control={control}
        name={"expectation"}
        defaultValue=""
        render={({ field }) => {
          return (
            <TextAreaComponent
              id={field.name}
              idInput={field.name}
              value={`${field.value}`}
              label="Interés/Expectativa"
              classNameLabel="text-black biggest bold text-required"
              className="text-area-basic"
              placeholder="Escribe aquí"
              register={register}
              onChange={field.onChange}
              errors={errors}
            />
          );
        }}
      />

      <Controller
        control={control}
        name={"position"}
        defaultValue={null}
        render={({ field }) => {
          return (
            <SelectComponent
              idInput={field.name}
              className="select-basic"
              control={control}
              errors={errors}
              label="Posición"
              classNameLabel="text-black biggest bold text-required"
              data={positionData}
              filter={true}
            />
          );
        }}
      />

      <Controller
        control={control}
        name={"contribution"}
        defaultValue=""
        render={({ field }) => {
          return (
            <TextAreaComponent
              id={field.name}
              idInput={field.name}
              value={`${field.value}`}
              label="Contribución"
              classNameLabel="text-black biggest bold text-required"
              className="text-area-basic"
              placeholder="Escribe aquí"
              register={register}
              onChange={field.onChange}
              errors={errors}
            />
          );
        }}
      />
    </FormComponent>
  );
});

export default React.memo(ActorCreateComponent);
