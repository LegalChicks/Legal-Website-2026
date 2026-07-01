import { useEffect, useState } from "react";
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
  const { login, user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) {
      setLocation(user.role === "admin" ? "/admin" : "/dashboard");
    }
  }, [user, loading, setLocation]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setError("");
    try {
      const loggedInUser = await login(values.username, values.password);
      setLocation(loggedInUser.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError((err as Error).message || "Invalid username or password");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#3a0d0d]">
        <Loader2 className="w-8 h-8 animate-spin text-white/50" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3a0d0d] relative overflow-hidden px-4">
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
      />

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <img
            src={farmLogo}
            alt="Legal Chicks Poultry Farm"
            className="w-28 h-28 object-contain mx-auto mb-4 drop-shadow-lg"
          />
          <h1 className="font-serif text-3xl font-bold text-white">
            Member Portal
          </h1>
          <p className="text-white/50 mt-1 text-sm">
            Legal Chicks Poultry Farm
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-[#3a0d0d] mb-1">
            Sign In
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Enter your credentials to access the portal.
          </p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
              <span className="mt-0.5">⚠</span>
              <span>{error}</span>
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
                        className="rounded-xl border-border/60 h-11"
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
                          className="rounded-xl border-border/60 h-11 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw(!showPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          tabIndex={-1}
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

          <div className="mt-6 pt-5 border-t border-border/40 text-center">
            <p className="text-xs text-muted-foreground">
              Don't have an account?{" "}
              <span className="font-medium text-[#3a0d0d]">
                Contact the farm administrator.
              </span>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-white/40 hover:text-white/70 text-xs transition-colors"
          >
            ← Back to Legal Chicks Farm
          </a>
        </div>

        <p className="text-center text-white/30 text-xs mt-4">
          © {new Date().getFullYear()} Legal Chicks Poultry Farm. All rights reserved.
        </p>
      </div>
    </div>
  );
}
