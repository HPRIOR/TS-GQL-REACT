import React, {useState} from 'react';
import {Alert, Box, Button} from "@chakra-ui/react";
import {Form, Formik, FormikValues} from "formik";
import {Wrapper} from "../components/Wrapper";
import {InputField} from "../components/InputField";
import {v4 as uuid} from 'uuid';
import {FieldError, useRegisterMutation} from "../generatedTypes/graphql";
import {useRouter} from "next/router";

interface RegisterProps {

}


export const Register: React.FC<RegisterProps> = ({}) => {
    const router = useRouter();
    const [, register] = useRegisterMutation();
    const [errors, setErrors] = useState<FieldError[]>([]);

    const handleSubmit = async (values: {username: string, password: string}) => {
        const response = await register(values)
        if (response.data?.register.errors) {
            setErrors(response.data?.register.errors)
            return response
        } else if (response.data?.register.user) {
            setErrors([])
            await router.push('/')
        }
    }
    return (
        <Wrapper variant={"small"}>
            <Formik
                initialValues={{username: "", password: ""}}
                onSubmit={handleSubmit}
            >
                {({isSubmitting}) => (
                    <Form>
                        <Box mt={4}>
                            <InputField name="username" placeholder="username" label="Username"/>
                        </Box>
                        <Box mt={4}>
                            <InputField name="password" placeholder="******" label="Password" type="password"/>
                        </Box>
                        <Box mt={4}>
                            <Button colorScheme='teal' isLoading={isSubmitting} type='submit'>Register</Button>
                        </Box>
                        <Box mt={4}>
                            {errors ? errors.map(error =>
                                <Box key={uuid()} mt={4}> <Alert  status='error'>{error.message}</Alert></Box>) : null}
                        </Box>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
}

export default Register;