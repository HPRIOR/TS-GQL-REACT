import React from 'react';
import {Box, Button, FormControl, FormErrorMessage, FormLabel, Input} from "@chakra-ui/react";
import {Form, Formik} from "formik";
import {Wrapper} from "../components/Wrapper";
import {InputField} from "../components/InputField";
import {useMutation} from "urql";

interface RegisterProps {

}

const REGISTER_MUT =
    `
        mutation Register($username: String!, $password: String!) {
            register(options: { username: $username, password: $password }) {
                errors {
                    message
                }
                user {
                    id
                    username
                    updatedAt
                }
            }
        }
    `


export const Register: React.FC<RegisterProps> = ({}) => {
    const [, register] = useMutation(REGISTER_MUT);
    return (
        <Wrapper variant={"small"}>
            <Formik
                initialValues={{username: "", password: ""}}
                onSubmit={async (values) => {
                    const response = await register(values)
                    return response;
                }}
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
                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
}
export default Register;