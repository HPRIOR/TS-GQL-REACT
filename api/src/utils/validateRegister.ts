import { UsernamePasswordInput } from "../resolvers/UsernamePasswordInput";

const validateRegister = (options: UsernamePasswordInput) => {
  const errors = [];
  if (options.username.length <= 2) {
    errors.push(
      {
        message: "username length must be greater than 2"
      });
  }

  if (options.username.includes("@")) {
    errors.push(
      {
        message: "Username cannot include an @"
      }
    );
  }

  if (options.password.length <= 2) {
    errors.push(
      {
        message: "password length must be greater than 2"
      }
    );
  }
  return errors.length > 0 ? errors : null;
};

export default validateRegister;
