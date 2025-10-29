import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import i18next from "i18next";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import IconLockDots from "../../components/Icon/IconLockDots";

const OtpVerification = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  // ✅ Load saved email + token from session storage
  useEffect(() => {
    const savedData = JSON.parse(sessionStorage.getItem("formData") || "{}");
    if (savedData?.email) {
      setEmail(savedData.email);
    } else {
      toast.error(i18next.t("No email found, please register again."), {
        position: "top-center",
      });
      navigate("/otp");
    }

    const storedToken = sessionStorage.getItem("access_token");
    if (storedToken) setToken(storedToken);
  }, [navigate]);

  // ✅ Verify OTP Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otp.trim()) {
      setError(i18next.t("Please enter OTP."));
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://backend.onrequestlab.com/api/v1/users/auth/verify-otp/",
        { email, otp },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;

     if(response.data.message=="Email already verified"){
        toast.error(response.data.message);
          setTimeout(() => {
              window.location.href = "/login";
            }, 1200);
        }else{
            toast.success(i18next.t("✅ Email verified successfully!"), {
              position: "top-center",
              style: {
                background: "#4CAF50",
                color: "white",
                fontWeight: "bold",
                borderRadius: "8px",
              },
            });

            // ✅ Redirect after 1.2s to login page
            setTimeout(() => {
              window.location.href = "/login";
            }, 1200);
        }
    } catch (error: any) {
      console.error(error);
      const serverError =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.response?.data?.error ||
        "Something went wrong.";
      toast.error(i18next.t(serverError), { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };
const accessToken = getCookie("access");
console.log("accessToken=",accessToken);
  // ✅ Resend OTP Handler
  const handleResendOTP = async () => {
    if (!email) {
      toast.error(i18next.t("Email not found."), { position: "top-center" });
      return;
    }

    setResending(true);

    try {
      const response = await axios.post(
        "https://backend.onrequestlab.com/api/v1/users/auth/resend-otp/",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data?.error === "Email already verified") {
        toast.error(i18next.t("Email already verified"), {
          position: "top-center",
        });
      } else if (response.data?.message) {
        toast.success(i18next.t(response.data.message), {
          position: "top-center",
        });
      } else {
        toast.info(i18next.t("OTP has been resent to your email."), {
          position: "top-center",
        });
      }
    } catch (error: any) {
      const serverError =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to resend OTP.";
      toast.error(i18next.t(serverError), { position: "top-center" });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center px-6 py-10 dark:bg-[#060818] sm:px-16">
      <div className="relative w-full max-w-[420px] rounded-lg bg-white/80 p-8 dark:bg-black/60 backdrop-blur-md shadow-lg">
        <h1 className="text-3xl font-extrabold text-primary mb-6 uppercase text-center">
          {i18next.t("Verify OTP")}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-center text-sm text-gray-600 dark:text-gray-300">
            {i18next.t("An OTP has been sent to")} <b>{email}</b>
          </p>

          <div>
            <label className="block text-sm font-semibold">
              {i18next.t("Enter OTP")}
            </label>
            <div className="relative">
              <input
                type="text"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder={i18next.t("Enter your OTP")}
                className={`form-input ps-10 w-full placeholder:text-white-dark ${
                  error ? "border-red-500" : ""
                }`}
              />
              <span className="absolute start-4 top-1/2 -translate-y-1/2 text-white-dark">
                <IconLockDots />
              </span>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-gradient mt-6 w-full uppercase border-0 shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
          >
            {loading ? i18next.t("Verifying...") : i18next.t("Verify OTP")}
          </button>
        </form>

        <div className="text-center mt-6 text-sm dark:text-white">
          {i18next.t("Login")}{" "}
           <a href="/login">  <button
            type="button"
           
            className="text-primary font-semibold underline"
          >
            {resending
              ? i18next.t("Here...")
              : i18next.t("Here")}
          </button></a>
        </div>
      </div>

      <ToastContainer autoClose={2000} theme="colored" />
    </div>
  );
};

export default OtpVerification;
