import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { login, fetchMe } from "@/redux/slices/authSlice";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    const res = await dispatch(login(form));
    if (login.fulfilled.match(res)) {
      await dispatch(fetchMe());
      toast.success(res.payload?.message || "Login successful");
      navigate("/");
    } else {
      toast.error(getErrorMessage(res.payload));
    }
  };

  return (
    <div className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* Background Glow */}
      <div className="bg-primary/20 absolute -top-40 -left-40 h-120 w-120 rounded-full blur-3xl" />
      <div className="bg-primary/10 absolute right-0 bottom-0 h-100 w-100 rounded-full blur-3xl" />

      {/* Card */}
      <Card className="bg-card/80 border-border relative z-10 w-full max-w-md rounded-3xl border shadow-2xl shadow-black/30 backdrop-blur-xl">
        <CardHeader className="space-y-3 pb-2 text-center">
          {/* Logo */}
          <div className="bg-primary/15 border-primary/20 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border">
            <div className="bg-primary h-6 w-6 rounded-full" />
          </div>

          <div className="space-y-1">
            <CardTitle className="text-foreground text-3xl font-semibold tracking-tight">Welcome Back</CardTitle>

            <CardDescription className="text-muted-foreground text-sm">Login to continue your journey</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label className="text-foreground text-sm">Email</Label>

              <Input disabled={loading} type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter your email" className="bg-muted/40 border-border focus-visible:ring-primary/40 h-11 rounded-xl focus-visible:ring-2" />

              <div className="h-1">
                <p className="text-xs text-red-400">{errors.email || ""}</p>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label className="text-foreground text-sm">Password</Label>

              <Input disabled={loading} type="password" name="password" value={form.password} onChange={handleChange} placeholder="Enter your password" className="bg-muted/40 border-border focus-visible:ring-primary/40 h-11 rounded-xl focus-visible:ring-2" />

              <div className="h-1">
                <p className="text-xs text-red-400">{errors.password || ""}</p>
              </div>
            </div>

            {/* Button */}
            <Button type="submit" disabled={loading} className="shadow-primary/20 h-11 w-full rounded-xl text-sm font-medium shadow-lg transition-all duration-300 hover:scale-[1.01]">
              {!loading ? (
                "Login"
              ) : (
                <div className="flex items-center gap-2">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  <span>Logging in...</span>
                </div>
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-muted-foreground mt-8 text-center text-sm">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
