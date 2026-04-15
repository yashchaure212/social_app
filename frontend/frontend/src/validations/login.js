import { signupValidation } from "./signUp";

export const loginValidation = {
    email: signupValidation.email,
    password: signupValidation.password
}