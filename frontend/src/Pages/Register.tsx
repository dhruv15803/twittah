import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { hasSpecial } from "@/utils";
import { useContext, useState } from "react";
import axios from "axios";
import { backendUrl } from "@/App";
import { AppContext } from "@/context/AppContext";
import { AppContextType } from "@/types";
import { Navigate, useNavigate } from "react-router-dom";

const registerFormSchema = z
  .object({
    username: z.string().min(3, "Username should have atleast 3 chars"),
    email: z.string().email(),
    firstName: z.string().min(2, "first name should have atleast 2 chars"),
    lastName: z.string().min(2, "last name should have atleast 2 chars"),
    dateOfBirth: z.string().date(),
    password: z
      .string()
      .min(6, "passwords should have atleast 6 chars")
      .refine((password) => hasSpecial(password), {
        message: "password should have atleast 1 special char",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type registerFormType = z.infer<typeof registerFormSchema>;

const Register = () => {
  const navigate = useNavigate();
  const {setLoggedInUser,loggedInUser} = useContext(AppContext) as AppContextType;
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [registerFormErr,setRegisterFormError] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<registerFormType>({ resolver: zodResolver(registerFormSchema) });

  const onSubmit: SubmitHandler<{
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
    dateOfBirth: string;
  }> = async (data) => {
    setRegisterFormError("");
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/register`,
        {
          email: data.email,
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          password: data.password,
          dateOfBirth: data.dateOfBirth,
        },
        { withCredentials: true }
      );
      setLoggedInUser(response.data.newUser);
      navigate('/');
    } catch (error:any) {
      console.log(error);
      setRegisterFormError(error.response.data.message);
    }
  };

  if(loggedInUser!==null) return  <Navigate to="/"/> ;

  return (
    <>
      <div className="flex flex-col md:flex-row p-4 my-10 mx-10 md:mx-[20%] lg:mx-[25%] rounded-lg md:items-center gap-4">
        <div className="md:w-[40%] flex flex-col">
          <div className="text-2xl md:text-3xl lg:text-4xl font-bold">
            Welcome to X
          </div>
          <div className="text-2xl font-semibold">Register</div>
          <div className="text-xl text-gray-600 my-2">
            Create an account to get started
          </div>
          <div className="flex items-center gap-2 my-4">
            <span>Already have an account?</span>
            <span onClick={() => navigate('/login')} className="font-semibold cursor-pointer">Login</span>
          </div>
        </div>
        <form
          onSubmit={handleSubmit((data) => onSubmit(data))}
          className="flex flex-col gap-2 flex-1 md:border-l p-6"
        >
          <div className="flex flex-col gap-1">
            <Label htmlFor="username">Username</Label>
            <Input
              {...register("username")}
              type="text"
              id="username"
              placeholder="eg:example123"
            />
            {errors.username && (
              <div className="text-red-500">{errors.username.message}</div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register("email")}
              type="email"
              id="email"
              placeholder="eg:example@example.com"
            />
            {errors.email && (
              <div className="text-red-500">{errors.email.message}</div>
            )}
          </div>
          <div className="flex flex-col md:flex-row  md:items-center gap-2">
            <div className="flex-1 flex flex-col gap-1">
              <Label htmlFor="firstName">First Name</Label>
              <Input {...register("firstName")} type="text" id="firstName" />
              {errors.firstName && (
                <div className="text-red-500">{errors.firstName.message}</div>
              )}
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <Label htmlFor="lastName">Last Name</Label>
              <Input {...register("lastName")} type="text" id="lastName" />
              {errors.lastName && (
                <div className="text-red-500">{errors.lastName.message}</div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="dateOfBirth">Date of birth</Label>
            <Input {...register("dateOfBirth")} id="dateOfBirth" type="date" />
            {errors.dateOfBirth && (
              <div className="text-red-500">{errors.dateOfBirth.message}</div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              {...register("password")}
              type={isShowPassword ? "text" : "password"}
              id="password"
            />
            {errors.password && (
              <div className="text-red-500">{errors.password.message}</div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              {...register("confirmPassword")}
              type={isShowPassword ? "text" : "password"}
              id="confirmPassword"
            />
            {errors.confirmPassword && (
              <div className="text-red-500">
                {errors.confirmPassword.message}
              </div>
            )}
          </div>
          {registerFormErr!=="" && <div className="text-red-500">{registerFormErr}</div>}
          <div className="flex items-center gap-2 my-2">
            <Checkbox
              checked={isShowPassword}
              onClick={() => setIsShowPassword(!isShowPassword)}
            />
            <span className="font-semibold">Show passwords</span>
          </div>
          <Button disabled={isSubmitting}>Register</Button>
        </form>
      </div>
    </>
  );
};

export default Register;
