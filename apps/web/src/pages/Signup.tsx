import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { AtSign, LockKeyhole, Mail, MapPin, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { PhoneNumber } from "../components/common/PhoneNumber";
import { isValidPhoneNumber } from "libphonenumber-js";
import { EGYPT_GOVERNORATES } from "../lib/constants";
import { useTranslation } from "react-i18next";
import AuthShell from "../components/AuthShell";
import type { ReactNode } from "react";
import { AuthField, AuthInput, AuthSelect, Button } from "@tcg/ui-web";

const signupSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  username: z.string().min(3, "Username must be at least 3 characters").regex(/^[a-zA-Z0-9_]+$/, "Only alphanumeric and underscore allowed"),
  email: z.string().email("Enter a valid email address"),
  mobile: z.string().refine((value) => isValidPhoneNumber(value, { defaultCallingCode: "20", defaultCountry: "EG" }), "Please enter a valid phone number").transform((value) => value.replace(/\s/g, "")),
  password: z.string().min(6, "Password must be at least 6 characters"),
  passwordConfirmation: z.string().min(6, "Please confirm your password"),
  governorate: z.enum(EGYPT_GOVERNORATES, { message: "Please select a valid governorate" }),
}).refine((data) => data.password === data.passwordConfirmation, { message: "Passwords don't match", path: ["passwordConfirmation"] });
type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({ resolver: zodResolver(signupSchema), mode: "onBlur" });
  const onSubmit = async (data: SignupFormData) => {
    await signup.mutateAsync(data);
    toast.success("Registration successful! Check WhatsApp for verification code.");
    navigate("/verify-otp", { state: { mobile: data.mobile } });
  };
  const field = (name: keyof SignupFormData, label: string, icon: ReactNode, input: ReactNode) => (
    <AuthField
      id={`signup-${name}`}
      label={label}
      icon={icon}
      error={errors[name]?.message as string | undefined}
    >
      {input}
    </AuthField>
  );
  return (
    <AuthShell eyebrow="Join the club / 01" title={<>Make room for <em>more.</em></>} description="Build your collector profile, find your people, and give every card a place in the story." asideTitle="Collection starts with a first pull." asideDescription="Bring your binder online and make every swap, want, and discovery count." asideItems={["A profile made for collecting", "Local context, global community", "WhatsApp verification for trust"]} footer={<>Already have a vault? <Link to="/login" className="font-mono text-utility uppercase text-wax-red hover:underline focus-ring">Sign in</Link></>}>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 ">
        <div className="grid gap-5 sm:grid-cols-2">
          {field("fullName", "Full name", <UserRound aria-hidden="true" />, <AuthInput id="signup-fullName" {...register("fullName")} type="text" autoComplete="name" placeholder="Your name" invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "signup-fullName-error" : undefined} disabled={signup.isPending} />)}
          {field("username", "Username", <AtSign aria-hidden="true" />, <AuthInput id="signup-username" {...register("username")} type="text" autoComplete="username" placeholder="collector_01" invalid={Boolean(errors.username)} aria-describedby={errors.username ? "signup-username-error" : undefined} disabled={signup.isPending} />)}
          {field("email", "Email", <Mail aria-hidden="true" />, <AuthInput id="signup-email" {...register("email")} type="email" autoComplete="email" placeholder="hello@nexus.com" invalid={Boolean(errors.email)} aria-describedby={errors.email ? "signup-email-error" : undefined} disabled={signup.isPending} />)}
          <div className="grid gap-2"><label htmlFor="signup-mobile" className="text-xs font-extrabold text-wax-ink">Mobile / WhatsApp</label><PhoneNumber register={register} errors={errors.mobile} name="mobile" id="signup-mobile" autoComplete="tel" aria-invalid={Boolean(errors.mobile)} aria-describedby={errors.mobile ? "signup-mobile-error" : undefined} disabled={signup.isPending} className="focus-ring min-h-control w-full rounded-md border border-wax-line bg-wax-input px-10 text-wax-ink placeholder:text-wax-muted aria-invalid:border-danger-500" />{errors.mobile && <p id="signup-mobile-error" className="m-0 text-xs font-semibold text-danger-600" role="alert">{errors.mobile.message}</p>}</div>
          {field("password", "Password", <LockKeyhole aria-hidden="true" />, <AuthInput id="signup-password" {...register("password")} type="password" autoComplete="new-password" placeholder="••••••••" invalid={Boolean(errors.password)} aria-describedby={errors.password ? "signup-password-error" : undefined} disabled={signup.isPending} />)}
          {field("passwordConfirmation", "Confirm password", <LockKeyhole aria-hidden="true" />, <AuthInput id="signup-passwordConfirmation" {...register("passwordConfirmation")} type="password" autoComplete="new-password" placeholder="••••••••" invalid={Boolean(errors.passwordConfirmation)} aria-describedby={errors.passwordConfirmation ? "signup-passwordConfirmation-error" : undefined} disabled={signup.isPending} />)}
          <AuthField id="signup-governorate" label={t("common.region")} icon={<MapPin aria-hidden="true" />} error={errors.governorate?.message} className="sm:col-span-2"><AuthSelect id="signup-governorate" {...register("governorate")} invalid={Boolean(errors.governorate)} aria-describedby={errors.governorate ? "signup-governorate-error" : undefined} disabled={signup.isPending}><option value="">Select your governorate</option>{EGYPT_GOVERNORATES.map((gov) => <option key={gov} value={gov}>{t(`common.governorates.${gov}`)}</option>)}</AuthSelect></AuthField>
        </div>
        <Button type="submit" loading={signup.isPending} className="w-full">Create my profile</Button>
      </form>
    </AuthShell>
  );
}
