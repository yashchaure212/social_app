import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { signupValidation } from "@/validations/signUp";
import { signUpUser } from "@/services/authServices";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const SignUp = () => {
  //hooks
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();

  //handlers
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await signUpUser(data);

      if (response.data.success) {
        navigate("/home");
        toast.success(response.data.message);
        reset();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="shadow-sm flex p-10">
        <div className="flex items-center flex-col justify-center gap-5">
          <h3 className="font-bold">LOGO</h3>
          <div>
            <Label>username</Label>
            <Input
              disabled={loading}
              type="text"
              {...register("username", signupValidation.username)}
              className={"mt-1"}
            />
            {errors.username && (
              <p className="text-xs text-red-600 pt-1">
                {errors.username.message}
              </p>
            )}
          </div>
          <div>
            <Label>email</Label>
            <Input
              disabled={loading}
              type="email"
              {...register("email", signupValidation.email)}
              className={"mt-1"}
            />
            {errors.email && (
              <p className="text-xs text-red-600 pt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Label>password</Label>
            <Input
              disabled={loading}
              type="password"
              {...register("password", signupValidation.password)}
              className={"mt-1"}
            />
            {errors.password && (
              <p className="text-xs text-red-600 pt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          {loading ? (
            <Button className={"w-full"}>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait...
            </Button>
          ) : (
            <Button disabled={loading} type="submit" className={"w-full"}>
              Sign up
            </Button>
          )}
          <span className="text-xs">
            Already have an account please{" "}
            <Link to="/login" className="text-blue-500 underline">
              login
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
