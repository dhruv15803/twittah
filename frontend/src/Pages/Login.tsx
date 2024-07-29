import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { backendUrl } from "@/App";
import { AppContext } from "@/context/AppContext";
import { AppContextType } from "@/types";
import { Navigate, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

const loginFormSchema = z.object({
  email: z.string().min(1,"Please enter a email").email(),
  username: z.string().min(1, "Please enter a username").optional(),
  password: z.string().min(1, "Please enter a password"),
});
type loginFormType = z.infer<typeof loginFormSchema>;

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<loginFormType>({ resolver: zodResolver(loginFormSchema) });
  const [isEmailLogin, setIsEmailLogin] = useState<boolean>(true);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [loginFormErr, setLoginFormErr] = useState<string>("");
  const { loggedInUser, setLoggedInUser } = useContext(
    AppContext
  ) as AppContextType;

  const onsubmit: SubmitHandler<{
    email: string;
    password: string;
    username?: string | undefined;
  }> = async (data) => {
    setLoginFormErr("");
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/login`,
        {
          email: data.email,
          password: data.password,
          username: data.username,
        },
        { withCredentials: true }
      );
      setLoggedInUser(response.data.user);
      navigate("/");
    } catch (error: any) {
      console.log(error);
      setLoginFormErr(error.response.data.message);
    }
  };

  if (loggedInUser !== null) return <Navigate to="/" />;

  return (
    <>
      <div className="flex flex-col md:flex-row p-4 my-32 mx-10 md:mx-[20%] lg:mx-[25%] rounded-lg md:items-center gap-4">
        <div className="md:w-[40%] flex flex-col">
          <div className="text-2xl md:text-3xl lg:text-4xl font-bold">
            Welcome to X
          </div>
          <div className="text-2xl font-semibold">Register</div>
          <div className="text-xl text-gray-600 my-2">
            Login to your account by{" "}
            <span
              onClick={() => setIsEmailLogin(true)}
              className={`cursor-pointer ${
                isEmailLogin ? "font-semibold text-black" : ""
              }`}
            >
              Email
            </span>
            /
            <span
              onClick={() => setIsEmailLogin(false)}
              className={`cursor-pointer ${
                isEmailLogin ? "" : "font-semibold text-black"
              } `}
            >
              Username
            </span>{" "}
          </div>
          <div className="flex items-center gap-2 my-4">
            <span>Don't have an account?</span>
            <span onClick={() => navigate('/register')} className="cursor-pointer font-semibold">Create account</span>
          </div>
        </div>
        <form
          onSubmit={handleSubmit((data) => onsubmit(data))}
          className="flex flex-1 flex-col gap-2 md:border-l p-6"
        >
          {isEmailLogin ? (
            <>
              <div className="flex flex-col gap-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register("email")}
                  type="email"
                  name="email"
                  id="email"
                  placeholder="eg:example@example.com"
                />
              </div>
              {errors.email && (
                <div className="text-red-500">{errors.email.message}</div>
              )}
            </>
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <Label htmlFor="username">Username</Label>
                <Input
                  {...register("username")}
                  type="text"
                  id="username"
                  name="username"
                  placeholder="eg:example123"
                />
                {errors.username && (
                  <div className="text-red-500">{errors.username.message}</div>
                )}
              </div>
            </>
          )}
          <div className="flex flex-col gap-1">
            <Label htmlFor="password">Password</Label>
            <Input
              {...register("password")}
              type={isShowPassword ? "text" : "password"}
              name="password"
              id="password"
            />
            {errors.password && (
              <div className="text-red-500">{errors.password.message}</div>
            )}
          </div>
          {loginFormErr !== "" && (
            <div className="text-red-500">{loginFormErr}</div>
          )}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isShowPassword}
              onClick={() => setIsShowPassword(!isShowPassword)}
            />
            <span className="font-semibold">Show password</span>
          </div>
          <Button disabled={isSubmitting}>Login</Button>
        </form>
      </div>
    </>
  );
};

export default Login;
