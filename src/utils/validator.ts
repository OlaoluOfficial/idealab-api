import { z } from "zod";

//Password validator regex pattern & error message
const PasswordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?[#?!@$%^&*-]).{8,}$/;
const PasswordError =
  "Password must be at least 8 character, include uppercase, lowercase, digit and special character.";

//Signup validator
const registerValidator = z
  .object({
    email: z.string().email({ message: "Enter valid email" }),
    password: z.string().regex(PasswordRegex, { message: PasswordError }),
    group: z.array(z.string()),
  })
  .strict();

//Sign in Validator
const signInValidator = z
  .object({
    email: z.string().email({ message: "Enter valid email" }),
    password: z.string(),
  })
  .strict();

export { registerValidator, signInValidator };
