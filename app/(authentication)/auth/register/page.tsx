import React from "react";
import RegisterForm from "../../components/register-form";
import { getUsers } from "@/app/actions";
import { User } from "@prisma/client";

const RegisterPage = async () => {
  return <RegisterForm />;
};

export default RegisterPage;
