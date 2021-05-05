import React, {useState} from "react";
import {useRouter} from "next/router";
import {FieldError, useLoginMutation} from "../generatedTypes/graphql";
import {Wrapper} from "../components/Wrapper";
import {Form, Formik} from "formik";
import {Alert, Box, Button} from "@chakra-ui/react";
import {InputField} from "../components/InputField";
import {v4 as uuid} from "uuid";

interface LoginProps {
}

export const Login: React.FC<LoginProps> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  const [errors, setErrors] = useState<FieldError[]>([]);

  const handleSubmit = async (values: { username: string, password: string }) => {
    const response = await login(values);
    if (response.data?.login.errors) {
      setErrors(response.data?.login.errors);
      return response;
    } else if (response.data?.login.user) {
      setErrors([]);
      await router.push('/');
    }
  };
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
              <Button colorScheme="teal" isLoading={isSubmitting} type="submit">Login</Button>
            </Box>
            <Box mt={4}>
              {errors ? errors.map(error =>
                <Box key={uuid()} mt={4}> <Alert status="error">{error.message}</Alert></Box>) : null}
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Login;
