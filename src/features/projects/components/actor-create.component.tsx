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
import { EDirection } from "../../../common/constants/input.enum";
import { ProjectsContext } from "../contexts/projects.context";

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
  const { setProjectData, projectData } = useContext(ProjectsContext);
  const { setMessage } = useContext(AppContext);
  const resolver = useYupValidationResolver(actorsValidator);

  const {
    getValues,
    setValue,
    formState: { errors, isValid },
    watch,
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
    if (isValid) {
      enableNext();
    } else {
      disableNext();
    }
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
          title: "¿Desea quitar el actor?",
          onOk: () => {
            const newActors = getValues("actors").filter((actor) =>
              actor !== row
            );
            setActorCreateData((prev) => {
              return { ...prev, actors: newActors };
            });
            setValue("actors", newActors);
            setMessage({});
          },
        });
      },
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
                            debugger
                          setActorCreateData((prev) => {
                            const actors = prev?.actors
                              ? prev.actors.concat(data)
                              : [data];
                            return { ...prev, actors: actors };
                          });
                          setValue("actors", getValues("actors").concat(data));
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
              Añadir Actor <AiOutlinePlusCircle />
            </div>
          </div>
          {
            <TableExpansibleComponent
              actions={actorActions}
              columns={actorColumns}
              data={getValues("actors")}
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
  const positionData: IDropdownProps[] = [
    {
      name: "Posición 1",
      value: "1",
    },
    {
      name: " Posición 2",
      value: "2",
    },
  ];
  const resolver = useYupValidationResolver(actorsFormValidator);
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm<IParticipatingActors>({ resolver, mode: "all", defaultValues: item ? {...item} : {} });

  useImperativeHandle(ref, () => ({
    handleSubmit: handleSubmit,
  }));

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
        defaultValue=""
        render={({ field }) => {
          return (
            <SelectComponent
              idInput={field.name}
              className="select-basic"
              control={control}
              errors={errors}
              label="Posición"
              classNameLabel="text-black biggest bold text-required"
              direction={EDirection.row}
              data={positionData}
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
