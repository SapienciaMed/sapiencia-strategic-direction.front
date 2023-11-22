import { useForm } from "react-hook-form";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { useContext, useEffect, useState } from "react";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { registerValidator } from "../../../common/schemas";
import { EResponseCodes } from "../../../common/constants/api.enum";

export default function useIndicatorsPai() {

    const {
        handleSubmit,
        register,
        formState: { errors, isValid },
        control: controlIndicatorsPai,
        watch,
        setValue,
        clearErrors,
        trigger
    } = useForm<any>({});

    const onSubmit = () => {

    }

    return {
        errors,
        register,
        onSubmit,
        controlIndicatorsPai,
    }
}