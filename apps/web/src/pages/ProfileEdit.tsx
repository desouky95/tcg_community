import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { User, Mail, MapPin, ArrowLeft, Save, Phone, Ban } from "lucide-react";
import toast from "react-hot-toast";
import Layout from "../components/Layout";
import { EGYPT_GOVERNORATES } from "../lib/constants";
import { useProfile, useUpdateProfile } from "../hooks/useUsers";
import { useTranslation } from "react-i18next";
import { isValidPhoneNumber } from "libphonenumber-js";

const profileSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
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
  governorate: z.enum(EGYPT_GOVERNORATES),
  notReadyForSwap: z.boolean(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileEdit() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  // const currentUser = useStore((state) => (state as any).user);
  const { data: currentUser } = useProfile();
  const updateProfile = useUpdateProfile();
  const governorate = EGYPT_GOVERNORATES.find(
    (value) => value === currentUser?.data.governorate,
  ) ?? EGYPT_GOVERNORATES[0];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: {
      fullName: currentUser?.data.fullName || "",
      email: currentUser?.data.email || "",
      mobile: currentUser?.data.mobile || "",
      governorate,
      notReadyForSwap: !!currentUser?.data.notReadyForSwap,
    },
  });

  const notReadyForSwap = useWatch({ control, name: "notReadyForSwap" });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const result = await updateProfile.mutateAsync(data);
      const updatedUser = result.data.user;

      if (!updatedUser.isVerified && data.mobile !== currentUser?.data.mobile) {
        toast.success("Phone number updated. Please verify it.");
        navigate(`/verify-otp?mobile=${data.mobile}`);
      } else {
        toast.success("Profile updated successfully!");
        navigate("/profile");
      }
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <Layout>
      <div className="wax-workspace-view wax-profile-edit-view max-w-2xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary-500 transition-colors mb-2 uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("common.back")}
            </button>
            <h1 className="text-3xl font-black tracking-tight uppercase italic flex items-center gap-3">
              <span className="w-2 h-8 bg-primary-500 rounded-full" />
              {t("profile.edit")}
            </h1>
          </div>
        </div>

        <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary-500/10 transition-colors duration-700" />

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 relative z-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1">
                  {t("profile.full_name")}
                </label>
                <div className="relative group/field">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/field:text-primary-500 transition-colors" />
                  <input
                    {...register("fullName")}
                    type="text"
                    className={`w-full bg-input/20 border border-border/50 group-hover/field:border-primary-500/30 ${errors.fullName ? "border-danger-500/50" : ""} rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all text-sm font-bold`}
                    placeholder="Enter your full name"
                    disabled={updateProfile.isPending}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-danger-500 text-[10px] font-black uppercase tracking-tight mt-1 ml-1 animate-in fade-in slide-in-from-left-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1">
                  {t("profile.email")}
                </label>
                <div className="relative group/field">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/field:text-primary-500 transition-colors" />
                  <input
                    {...register("email")}
                    type="email"
                    className={`w-full bg-input/20 border border-border/50 group-hover/field:border-primary-500/30 ${errors.email ? "border-danger-500/50" : ""} rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all text-sm font-bold`}
                    placeholder="name@example.com"
                    disabled={updateProfile.isPending}
                  />
                </div>
                {errors.email && (
                  <p className="text-danger-500 text-[10px] font-black uppercase tracking-tight mt-1 ml-1 animate-in fade-in slide-in-from-left-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Mobile Number */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1">
                  {t("profile.phone")}
                </label>
                <div className="relative group/field">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/field:text-primary-500 transition-colors" />
                  <input
                    {...register("mobile")}
                    type="tel"
                    className={`w-full bg-input/20 border border-border/50 group-hover/field:border-primary-500/30 ${errors.mobile ? "border-danger-500/50" : ""} rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all text-sm font-bold`}
                    placeholder="010XXXXXXXX"
                    disabled={updateProfile.isPending}
                  />
                </div>
                {errors.mobile && (
                  <p className="text-danger-500 text-[10px] font-black uppercase tracking-tight mt-1 ml-1 animate-in fade-in slide-in-from-left-1">
                    {errors.mobile.message}
                  </p>
                )}
              </div>

              {/* Governorate */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1">
                  {t("common.region")}
                </label>
                <div className="relative group/field">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/field:text-primary-500 transition-colors" />
                  <select
                    {...register("governorate")}
                    className={`w-full bg-input/20 border border-border/50 group-hover/field:border-primary-500/30 ${errors.governorate ? "border-danger-500/50" : ""} rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all text-sm font-bold appearance-none`}
                    disabled={updateProfile.isPending}
                  >
                    <option value="" className="bg-card">
                      Select region
                    </option>
                    {EGYPT_GOVERNORATES.map((gov) => (
                      <option key={gov} value={gov} className="bg-card">
                        {t(`common.governorates.${gov}`)}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.governorate && (
                  <p className="text-danger-500 text-[10px] font-black uppercase tracking-tight mt-1 ml-1 animate-in fade-in slide-in-from-left-1">
                    {errors.governorate.message}
                  </p>
                )}
              </div>

              {/* Swap Readiness Status */}
              <div className="md:col-span-2 pt-2">
                <div
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${notReadyForSwap ? "bg-danger-500/5 border-danger-500/20" : "bg-success-500/5 border-success-500/20"}`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl transition-colors ${notReadyForSwap ? "bg-danger-500/10 text-danger-500" : "bg-success-500/10 text-success-500"}`}
                    >
                      {notReadyForSwap ? (
                        <Ban className="w-5 h-5" />
                      ) : (
                        <Save className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-wider">
                        {t("profile.swap_status")}
                      </p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">
                        {t("profile.swap_hint")}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setValue("notReadyForSwap", !notReadyForSwap)
                    }
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${notReadyForSwap ? "bg-danger-500" : "bg-success-500"}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${notReadyForSwap ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={updateProfile.isPending}
                className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-black py-4 px-8 rounded-2xl transition-all shadow-xl shadow-primary-500/25 active:scale-[0.98] disabled:opacity-50 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 group/save"
              >
                <Save
                  className={`w-4 h-4 transition-transform ${updateProfile.isPending ? "animate-spin" : "group-hover/save:scale-110"}`}
                />
                {updateProfile.isPending
                  ? "Validating..."
                  : "Synchronize Profile"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/profile")}
                disabled={updateProfile.isPending}
                className="px-8 py-4 rounded-2xl border-2 border-border font-black text-xs uppercase tracking-[0.2em] hover:bg-muted transition-all active:scale-[0.98] text-muted-foreground hover:text-foreground"
              >
                {t("common.back")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
