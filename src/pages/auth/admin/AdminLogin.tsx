import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import Cookie from "js-cookie";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z.object({
  username: z.string().min(3, "At least 3 characters are required"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function AdminLogin() {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: authService.adminLogin,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: FormData) => {
    mutate(data, {
      onSuccess: (res) => {
        console.log(res);
        Cookie.set("token", res.accessToken);
        Cookie.set("role", res.role.toLowerCase());
        // Admin ma'lumotlarini localStorage ga saqlash
        localStorage.setItem(
          "admin",
          JSON.stringify({
            id: res.id,
            role: res.role,
          })
        );
        toast.success(res.message || "Logged in successfully", {
          position: "bottom-right",
        });
        navigate("/app/admin");
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Login failed. Please try again.",
          { position: "bottom-right" }
        );
      },
    });
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, var(--brand-secondary) 0%, var(--brand-primary) 100%)",
      }}
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10"
          style={{ backgroundColor: "var(--brand-accent)" }}
        ></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10"
          style={{ backgroundColor: "var(--brand-accent)" }}
        ></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="rounded-2xl bg-card border border-border shadow-2xl backdrop-blur-sm overflow-hidden">
          {/* Header Section with Brand Color */}
          <div
            className="px-8 pt-10 pb-8 text-center"
            style={{ backgroundColor: "var(--brand-accent)" }}
          >
            <h1
              className="text-3xl font-bold tracking-tight mb-2"
              style={{ color: "var(--brand-primary)" }}
            >
              Admin Panel
            </h1>
            <p className="text-sm" style={{ color: "var(--brand-tertiary)" }}>
              Sign in to your admin account
            </p>
          </div>

          {/* Form Section */}
          <div className="px-8 py-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Username
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter your username"
                            className="h-12 border-border focus:border-brand-primary transition-colors"
                            {...field}
                          />
                        </div>
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
                      <FormLabel className="text-foreground font-medium">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <PasswordInput
                            placeholder="••••••••"
                            className="h-12  border-border focus:border-brand-primary transition-colors"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 mt-6"
                  style={{
                    backgroundColor: "var(--brand-primary)",
                    color: "white",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--brand-primary-dark)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--brand-primary)";
                  }}
                  disabled={isPending}
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <Spinner className="h-5 w-5" />
                      Sign in
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
