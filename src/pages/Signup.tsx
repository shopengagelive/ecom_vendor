import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthActions, usePreventAuthenticatedAccess } from "../hooks/useAuthActions";
import {
  Shield,
  Mail,
  Lock,
  Phone,
  MapPin,
  User,
  Building2,
  Link as LinkIcon,
} from "lucide-react";
import zxcvbn from "zxcvbn";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const formSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email(),
    password: z.string().min(6, "Min 6 characters"),
    phone: z
      .string()
      .min(8, "Enter valid phone in E.164 format")
      .refine((val) => {
        const p = parsePhoneNumberFromString(val || "");
        return !!p?.isValid();
      }, "Invalid phone number"),
    pinCode: z.string().min(3, "Pin code is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    address: z.string().min(3, "Address is required"),
    storeName: z.string().min(1, "Store name is required"),
    storeAddress: z.string().min(3, "Store address is required"),
    facebookUrl: z.string().url().optional().or(z.literal("")),
    instagramUrl: z.string().url().optional().or(z.literal("")),
    youtubeUrl: z.string().url().optional().or(z.literal("")),
  })
  .strict();

type FormValues = z.infer<typeof formSchema>;

export default function Signup() {
  const { startEmailPhoneSignup, verifyPhoneOtp } = useAuthActions();
  const { user, loading: authLoading } = usePreventAuthenticatedAccess();
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [recaptchaId, setRecaptchaId] = useState<string>("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"form" | "otp" | "success">("form");
  const [submitError, setSubmitError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  // Show loading while checking auth status
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mx-auto" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is already authenticated, this will redirect them
  if (user) {
    return null;
  }

  const onSubmit = async (values: FormValues) => {
    setSubmitError("");
    try {
      const { confirmationResult, recaptchaContainerId } =
        await startEmailPhoneSignup(values);
      setConfirmationResult(confirmationResult);
      if (recaptchaContainerId) {
        setRecaptchaId(recaptchaContainerId);
      }
      setStep("otp");
    } catch (e: any) {
      setSubmitError(e?.message ? String(e.message) : "Unable to create account.");
    }
  };

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    
    try {
      const result = await verifyPhoneOtp(confirmationResult, otp);
      
      if (result.user) {
        // OTP verification successful
        setStep("success");
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    } catch (error: any) {
      setSubmitError(error?.message ? String(error.message) : "OTP verification failed");
    }
  };

  if (step === "otp") {
    return (
      <div className="min-h-screen grid md:grid-cols-2">
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-[#7C3AED] via-[#6366F1] to-[#06B6D4] text-white p-12">
          <div>
            <h2 className="text-4xl font-extrabold mb-3">Verify your phone</h2>
            <p className="opacity-90">
              Enter the OTP sent to your mobile number to secure your account.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center bg-gray-50 p-6">
          <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold mb-4">Phone Verification</h2>
            <form className="space-y-4" onSubmit={onVerify}>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter 6-digit OTP"
              />
              {submitError && (
                <div className="text-sm text-red-600">{submitError}</div>
              )}
              <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                Verify & Continue
              </button>
            </form>
            <div id={recaptchaId} />
          </div>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen grid md:grid-cols-2">
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-[#7C3AED] via-[#6366F1] to-[#06B6D4] text-white p-12">
          <div>
            <h2 className="text-4xl font-extrabold mb-3">Account Created!</h2>
            <p className="opacity-90">
              Your vendor account has been successfully created and verified.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center bg-gray-50 p-6">
          <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-green-600">Verification Successful!</h2>
            <p className="text-gray-600 mb-4">
              Your phone number has been verified. Redirecting to dashboard...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left promo/branding panel */}
      <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-[#7C3AED] via-[#6366F1] to-[#06B6D4] text-white p-12">
        <div className="max-w-md w-full space-y-6">
          <div className="flex items-center gap-2 text-sm opacity-90">
            <Shield className="w-4 h-4" /> Secure, scalable, and vendor-first
          </div>
          <h2 className="text-4xl font-extrabold leading-tight">
            Multi‑Vendor
            <br /> Commerce
          </h2>
          <p className="opacity-90">
            Manage your marketplace with analytics, order management, and a
            robust, safe platform.
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">500+</p>
              <p className="text-xs opacity-80">Active Vendors</p>
            </div>
            <div>
              <p className="text-2xl font-bold">10K+</p>
              <p className="text-xs opacity-80">Products</p>
            </div>
            <div>
              <p className="text-2xl font-bold">$2M+</p>
              <p className="text-xs opacity-80">Monthly Sales</p>
            </div>
          </div>
          {/* Store preview card */}
          <div className="mt-6 rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-white/20" />
              <div>
                <p className="text-sm font-medium">
                  {watch("storeName") || "Your store name"}
                </p>
                <p className="text-xs opacity-80">{watch("city") || "City"}</p>
              </div>
            </div>
            <p className="text-xs opacity-80 mt-3">
              This is how your store could appear across the marketplace.
            </p>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-xl p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Create Vendor Account
            </h2>
            <div className="text-xs text-gray-500">
              {computeProgress(watch as any)}% complete
            </div>
          </div>
          <div className="h-1.5 rounded bg-gray-100 mb-6 overflow-hidden">
            <div
              className="h-full bg-blue-600"
              style={{ width: `${computeProgress(watch as any)}%` }}
            />
          </div>
          <p className="text-gray-500 mb-6">
            Sign up with your business details.
          </p>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-700">First name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className="w-full pl-9 pr-3 py-3 border rounded-lg"
                    {...register("firstName")}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-700">Last name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className="w-full pl-9 pr-3 py-3 border rounded-lg"
                    {...register("lastName")}
                  />
                </div>
                {errors.lastName && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className="w-full pl-9 pr-3 py-3 border rounded-lg"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    placeholder="At least 8 characters"
                    className="w-full pl-9 pr-3 py-3 border rounded-lg"
                    {...register("password")}
                  />
                </div>
                <StrengthBar value={watch("password") || ""} />
                {errors.password && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-700">Mobile (E.164)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className="w-full pl-9 pr-3 py-3 border rounded-lg"
                    placeholder="+1234567890"
                    {...register("phone")}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-700">Pin code</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className="w-full pl-9 pr-3 py-3 border rounded-lg"
                    {...register("pinCode")}
                  />
                </div>
                {errors.pinCode && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.pinCode.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-700">City</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className="w-full pl-9 pr-3 py-3 border rounded-lg"
                    {...register("city")}
                  />
                </div>
                {errors.city && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-700">State</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className="w-full pl-9 pr-3 py-3 border rounded-lg"
                    {...register("state")}
                  />
                </div>
                {errors.state && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.state.message}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-700">Address</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className="w-full pl-9 pr-3 py-3 border rounded-lg"
                    {...register("address")}
                  />
                </div>
                {errors.address && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-700">Store name</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className="w-full pl-9 pr-3 py-3 border rounded-lg"
                    {...register("storeName")}
                  />
                </div>
                {errors.storeName && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.storeName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-700">Store address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className="w-full pl-9 pr-3 py-3 border rounded-lg"
                    {...register("storeAddress")}
                  />
                </div>
                {errors.storeAddress && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.storeAddress.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-700">Facebook URL</label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className="w-full pl-9 pr-3 py-3 border rounded-lg"
                    placeholder="https://facebook.com/.."
                    {...register("facebookUrl")}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-700">Instagram URL</label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className="w-full pl-9 pr-3 py-3 border rounded-lg"
                    placeholder="https://instagram.com/.."
                    {...register("instagramUrl")}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-700">YouTube URL</label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className="w-full pl-9 pr-3 py-3 border rounded-lg"
                    placeholder="https://youtube.com/.."
                    {...register("youtubeUrl")}
                  />
                </div>
              </div>
            </div>
            {submitError && (
              <div className="text-sm text-red-600">{submitError}</div>
            )}
            <button
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              {isSubmitting ? "Creating..." : "Create account"}
            </button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600">
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function computeProgress(watch: ReturnType<typeof useForm>["watch"]) {
  const fields = [
    "firstName",
    "lastName",
    "email",
    "password",
    "phone",
    "pinCode",
    "city",
    "state",
    "address",
    "storeName",
    "storeAddress",
    "facebookUrl",
    "instagramUrl",
    "youtubeUrl",
  ] as const;
  const values = watch(fields as any) as string[];
  const filled = values.filter((v) => (v || "").trim().length > 0).length;
  const pct = Math.round((filled / fields.length) * 100);
  return pct;
}

function StrengthBar({ value }: { value: string }) {
  const score = useMemo(() => (value ? zxcvbn(value).score : 0), [value]);
  const widths = ["w-1/12", "w-1/4", "w-2/4", "w-3/4", "w-full"];
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-emerald-600",
  ];
  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong"];
  return (
    <div className="mt-2">
      <div className="h-1 bg-gray-200 rounded overflow-hidden">
        <div
          className={`h-full ${widths[score]} ${colors[score]} transition-all duration-300`}
        />
      </div>
      <div className="text-xs text-gray-500 mt-1">
        Strength: {labels[score]}
      </div>
    </div>
  );
}
