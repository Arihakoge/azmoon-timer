"use client";
import { useState } from "react";
import { Handjet } from "next/font/google";
import { supabase } from "@/utils/supabase";

const pixelFontFa = Handjet({ subsets: ["arabic"] });

export default function Login() {
  const [isLogin, setIsLogin] = useState(true); // سوئیچ بین ورود و ثبت‌نام
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // تابع هندل کردن ثبت‌نام و ورود کلاسیک
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      if (isLogin) {
        // لاگین
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setMessage({
          text: "ورود موفقیت‌آمیز بود! در حال انتقال...",
          type: "success",
        });
        window.location.href = "/dashboard";
      } else {
        // ثبت‌نام
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage({
          text: "ثبت‌نام با موفقیت انجام شد! حالا وارد شوید.",
          type: "success",
        });
        setIsLogin(true); // بعد از ثبت‌نام بره به حالت لاگین
      }
    } catch (error: any) {
      setMessage({ text: error.message || "خطایی رخ داد!", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // تابع هندل کردن لاگین با گوگل
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) setMessage({ text: "خطا در اتصال به گوگل", type: "error" });
  };

  return (
    <main
      className={`min-h-screen flex items-center justify-center bg-[#0a0a0a] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] text-white p-6 ${pixelFontFa.className}`}
      dir="rtl"
    >
      <div className="bg-black p-8 border-4 border-white shadow-[8px_8px_0_0_rgba(59,130,246,1)] w-full max-w-md relative">
        {/* هدر فرم */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white border-b-2 border-blue-500 pb-2 inline-block">
            {isLogin ? "ورود به پایگاه" : "ثبت‌نام نیروی جدید"}
          </h1>
        </div>

        {/* نمایش پیام‌های خطا یا موفقیت */}
        {message.text && (
          <div
            className={`p-3 mb-6 font-bold border-2 text-center ${message.type === "error" ? "bg-red-900/50 border-red-500 text-red-200" : "bg-green-900/50 border-green-500 text-green-200"}`}
          >
            {message.text}
          </div>
        )}

        {/* فرم ایمیل و رمز */}
        <form onSubmit={handleAuth} className="flex flex-col gap-5">
          <div>
            <label className="block text-gray-400 text-xl font-bold mb-2">
              ایمیل ارتباطی:
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-900 border-2 border-gray-600 text-white p-3 text-lg focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="user@example.com"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-xl font-bold mb-2">
              رمز عبور امنیتی:
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900 border-2 border-gray-600 text-white p-3 text-lg focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="••••••••"
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full text-2xl font-bold text-black bg-white px-4 py-3 border-2 border-white shadow-[4px_4px_0_0_rgba(107,114,128,1)] hover:bg-gray-200 hover:shadow-[2px_2px_0_0_rgba(107,114,128,1)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all disabled:opacity-50"
          >
            {loading ? "در حال پردازش..." : isLogin ? "ورود" : "ثبت‌نام"}
          </button>
        </form>

        {/* خط جداکننده */}
        <div className="flex items-center my-6 gap-3">
          <div className="h-[2px] bg-gray-700 flex-1"></div>
          <span className="text-gray-500 font-bold text-lg">یا</span>
          <div className="h-[2px] bg-gray-700 flex-1"></div>
        </div>

        {/* دکمه ورود با گوگل */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full flex items-center justify-center gap-3 text-xl font-bold text-white bg-blue-600 px-4 py-3 border-2 border-blue-500 shadow-[4px_4px_0_0_rgba(37,99,235,0.5)] hover:bg-blue-500 hover:shadow-[2px_2px_0_0_rgba(37,99,235,0.5)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
          </svg>
          ورود سریع با گوگل
        </button>

        {/* سوئیچ وضعیت */}
        <div className="mt-8 text-center text-lg">
          <span className="text-gray-400">
            {isLogin ? "نیروی جدید هستی؟" : "قبلاً ثبت‌نام کردی؟"}
          </span>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage({ text: "", type: "" });
            }}
            className="text-blue-400 mr-2 font-bold hover:underline underline-offset-4 decoration-2"
          >
            {isLogin ? "ثبت‌نام کن" : "وارد شو"}
          </button>
        </div>
      </div>
    </main>
  );
}
