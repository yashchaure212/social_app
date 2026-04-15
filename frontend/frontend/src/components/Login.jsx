import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginUser } from "@/services/authServices";
import { loginValidation } from "@/validations/login";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const Login = () => {
  //hooks
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //handlers
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await loginUser(data);
      if (response.data.success) {
        navigate("/home");
        toast.success(response.data.message);
        reset();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
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
            <Label>email</Label>
            <Input
              disabled={loading}
              type="email"
              {...register("email", loginValidation.email)}
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
              {...register("password", loginValidation.password)}
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
            <Button disabled={loading} type="submit" className="w-full">
              Login
            </Button>
          )}
          <span className="text-xs">
            doesn't have an account please{" "}
            <Link to="/signup" className="text-blue-500 underline">
              signup
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
