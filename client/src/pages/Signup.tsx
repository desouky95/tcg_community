import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import {
  MessageCircle,
  User,
  AtSign,
  Mail,
  Lock as LockIcon,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";
import { PhoneNumber } from "../components/common/PhoneNumber";
import { DevTool } from "@hookform/devtools";
import { isValidPhoneNumber } from "libphonenumber-js";
import { EGYPT_GOVERNORATES } from "../lib/constants";
import { useTranslation } from "react-i18next";
const signupSchema = z
  .object({
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Only alphanumeric and underscore allowed"),
    email: z.string().email("Enter a valid email address"),
    mobile: z
      .string()
      .refine((args) => {
        const result = isValidPhoneNumber(args, {
          defaultCallingCode: "20",
          defaultCountry: "EG",
        });
        return result;
      }, "Please enter a valid phone number")
      .transform((value) => {
        return value.replace(/\s/g, "");
      }),
    password: z.string().min(6, "Password must be at least 6 characters"),
    passwordConfirmation: z.string().min(6, "Please confirm your password"),
    governorate: z.enum(EGYPT_GOVERNORATES, {
      errorMap: () => ({ message: "Please select a valid governorate" }),
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: SignupFormData) => {
    // try {
    await signup.mutateAsync(data);
    toast.success(
      "Registration successful! Check WhatsApp for verification code.",
    );
    navigate("/verify-otp", { state: { mobile: data.mobile } });
    // } catch (err: any) {
    //   toast.error(err.response?.data?.error || 'Signup failed');
    // }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <DevTool control={control} />

      <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-primary-500/10 blur-[120px] rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-green-500/10 blur-[120px] rounded-full animate-pulse pointer-events-none delay-700" />

      <div className="w-full max-w-xl bg-card/60 backdrop-blur-2xl border border-border/50 rounded-4xl shadow-2xl p-6 md:p-8 relative z-10 transition-all duration-500">
        <div className="text-center mb-6">
          <div className="mx-auto w-14 h-14 bg-linear-to-br from-primary-500 to-green-500 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-primary-500/20 transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <MessageCircle className="text-white w-7 h-7" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground uppercase italic leading-none">
            Join Nexus
          </h1>
          <p className="text-muted-foreground mt-1 text-xs font-medium">
            Create your collector profile today
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Row 1 */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary-500 transition-colors" />
                <input
                  {...register("fullName")}
                  type="text"
                  placeholder="John Doe"
                  className={`w-full bg-input/30 border-2 ${errors.fullName ? "border-danger-500/50" : "border-border/50"} rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all text-sm font-medium`}
                  disabled={signup.isPending}
                />
              </div>
              {errors.fullName && (
                <p className="text-danger-500 text-[9px] font-black uppercase tracking-tighter mt-1 ml-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Username
              </label>
              <div className="relative group">
                <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary-500 transition-colors" />
                <input
                  {...register("username")}
                  type="text"
                  placeholder="collector_01"
                  className={`w-full bg-input/30 border-2 ${errors.username ? "border-danger-500/50" : "border-border/50"} rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all text-sm font-medium`}
                  disabled={signup.isPending}
                />
              </div>
              {errors.username && (
                <p className="text-danger-500 text-[9px] font-black uppercase tracking-tighter mt-1 ml-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Row 2 */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary-500 transition-colors" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="hello@nexus.com"
                  className={`w-full bg-input/30 border-2 ${errors.email ? "border-danger-500/50" : "border-border/50"} rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all text-sm font-medium`}
                  disabled={signup.isPending}
                />
              </div>
              {errors.email && (
                <p className="text-danger-500 text-[9px] font-black uppercase tracking-tighter mt-1 ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Mobile
              </label>
              <PhoneNumber
                errors={errors.mobile}
                register={register}
                name={"mobile"}
              />
              {/* <div className="relative group">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary-500 transition-colors" />
                <input
                  {...register("mobile")}
                  type="text"
                  placeholder="+1 234 567 890"
                  className={`w-full bg-input/30 border-2 ${errors.mobile ? "border-danger-500/50" : "border-border/50"} rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all text-sm font-medium`}
                  disabled={signup.isPending}
                />
              </div> */}
              {errors.mobile && (
                <p className="text-danger-500 text-[9px] font-black uppercase tracking-tighter mt-1 ml-1">
                  {errors.mobile.message}
                </p>
              )}
            </div>

            {/* Row 3 */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Password
              </label>
              <div className="relative group">
                <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary-500 transition-colors" />
                <input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  className={`w-full bg-input/30 border-2 ${errors.password ? "border-danger-500/50" : "border-border/50"} rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all text-sm font-medium`}
                  disabled={signup.isPending}
                />
              </div>
              {errors.password && (
                <p className="text-danger-500 text-[9px] font-black uppercase tracking-tighter mt-1 ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Confirm
              </label>
              <div className="relative group">
                <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary-500 transition-colors" />
                <input
                  {...register("passwordConfirmation")}
                  type="password"
                  placeholder="••••••••"
                  className={`w-full bg-input/30 border-2 ${errors.passwordConfirmation ? "border-danger-500/50" : "border-border/50"} rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all text-sm font-medium`}
                  disabled={signup.isPending}
                />
              </div>
              {errors.passwordConfirmation && (
                <p className="text-danger-500 text-[9px] font-black uppercase tracking-tighter mt-1 ml-1">
                  {errors.passwordConfirmation.message}
                </p>
              )}
            </div>

            {/* Row 4: Governorate */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                {t("common.region")}
              </label>
              <div className="relative group">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary-500 transition-colors" />
                <select
                  {...register("governorate")}
                  className={`w-full bg-input/30 border-2 ${errors.governorate ? "border-danger-500/50" : "border-border/50"} rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all text-sm font-medium appearance-none`}
                  disabled={signup.isPending}
                >
                  <option value="">Select your region</option>
                  {EGYPT_GOVERNORATES.map((gov) => (
                    <option key={gov} value={gov}>
                      {t(`common.governorates.${gov}`)}
                    </option>
                  ))}
                </select>
              </div>
              {errors.governorate && (
                <p className="text-danger-500 text-[9px] font-black uppercase tracking-tighter mt-1 ml-1">
                  {errors.governorate.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={signup.isPending}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-black py-3.5 px-6 rounded-xl transition-all shadow-xl shadow-primary-500/25 active:scale-[0.98] disabled:opacity-50 uppercase tracking-[0.2em] text-xs relative overflow-hidden group mt-2"
          >
            <span className="relative z-10 flex items-center justify-center">
              {signup.isPending ? "Processing..." : "Complete Registration"}
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="text-xs text-foreground/50 hover:text-primary-500 font-bold transition-colors"
            >
              Already a member?{" "}
              <span className="text-primary-500 underline underline-offset-4">
                Sign In
              </span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
