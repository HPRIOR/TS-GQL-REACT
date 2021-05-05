import React, {InputHTMLAttributes} from 'react';
import {FormControl, FormErrorMessage, FormLabel, Input} from "@chakra-ui/react";
import {useField} from "formik";

// & {..} adding a required obj
type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
};

export const InputField: React.FC<InputFieldProps> = ({
                                                        label,
                                                        size: _,
                                                        ...props
                                                      }) => {
  const [field, {error}] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input {...field} {...props} id={field.name}/>
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};

/*
This is a generic input field which can be reused throughout formik components
Name, placeholder, label object passed to the useField hook, which determine how input is handled by the form which uses
this component.

UseCase --> place this component within a formik form e.g. username field or password field
 */
