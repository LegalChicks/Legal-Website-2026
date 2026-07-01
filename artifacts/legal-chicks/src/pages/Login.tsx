import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/lib/auth-context";
import { useLocation } from "wouter";
import farmLogo from "@assets/Legal_Chicks_Farm_Logo_1782840193981.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
type FormValues = z.infer<typeof schema>;

export default function Login() {
  const { login, user } = useAuth();
  const [, setLocation] = useLocation();
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "" },
  });

  if (user) {
    setLocation(user.role === "admin" ? "/admin" : "/dashboard");
    return null;
  }

  const onSubmit = async (values: FormValues) => {
    setError("");
    try {
      await login(values.username, values.password);
      const role = (await import("@/lib/api").then((m) =>
        m.api.auth.me().then((r) => r.user.role),
      )) as string;
      setLocation(role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError((err as Error).message || "Invalid credentials");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#3a0d0d] relative overflow-hidden px-4"
      style={{
        backgroundImage:
          "url(https://www.transparenttextures.com/patterns/diagmonds-light.png)",
      }}
    >
      <div className="absolute inset-0 bg-[#3a0d0d]/95" />

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <img
            src={farmLogo}
            alt="Legal Chicks Poultry Farm"
            className="w-28 h-28 object-contain mx-auto mb-4"
          />
          <h1 className="font-serif text-3xl font-bold text-white">
            Member Portal
          </h1>
          <p className="text-white/60 mt-1 text-sm">
            Legal Chicks Poultry Farm
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-[#3a0d0d] mb-6">
            Sign In to Your Account
          </h2>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#3a0d0d] font-medium">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your username"
                        autoComplete="username"
                        className="rounded-xl border-border/60"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#3a0d0d] font-medium">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPw ? "text" : "password"}
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          className="rounded-xl border-border/60 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw(!showPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPw ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full bg-[#3a0d0d] hover:bg-[#5a1919] text-white rounded-xl h-11 font-semibold mt-2"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Signing in…
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Contact the farm administrator to register your account.
          </p>
        </div>

        <p className="text-center text-white/40 text-xs mt-6">
          &copy; {new Date().getFullYear()} Legal Chicks Poultry Farm
        </p>
      </div>
    </div>
  );
}
