"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Handjet } from "next/font/google";
import { supabase } from "@/utils/supabase";

const pixelFontFa = Handjet({ subsets: ["arabic"] });

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // بررسی وضعیت ورود کاربر
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // اگر کاربر لاگین نکرده بود، پرتش کن به صفحه ورود
        router.push("/login");
      } else {
        // اگر لاگین بود، اطلاعاتش رو ذخیره کن
        setUser(session.user);
      }
      setLoading(false);
    };

    checkUser();
  }, [router]);

  // تابع خروج از حساب کاربری
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login"); // بعد از خروج برگرده به لاگین
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white font-bold text-2xl">
        در حال بررسی هویت...
      </div>
    );
  if (!user) return null; // جلوگیری از چشمک زدن صفحه قبل از انتقال

  return (
    <main
      className={`min-h-screen bg-[#0a0a0a] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] text-white p-6 md:p-12 ${pixelFontFa.className}`}
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto mt-10">
        <div className="bg-black p-8 border-4 border-white shadow-[8px_8px_0_0_rgba(59,130,246,1)]">
          {/* هدر داشبورد */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b-2 border-gray-800 pb-6 gap-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              مرکز فرماندهی کاربر
            </h1>
            <button
              onClick={handleLogout}
              className="text-xl font-bold text-black bg-red-500 px-6 py-2 border-2 border-white shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:bg-red-400 hover:translate-y-[2px] hover:translate-x-[2px] transition-all"
            >
              خروج از سیستم
            </button>
          </div>

          {/* اطلاعات کاربر */}
          <div className="space-y-4">
            <p className="text-gray-400 text-xl font-bold">
              شناسه ارتباطی (ایمیل):
            </p>
            <p
              className="text-2xl font-bold text-blue-400 bg-gray-900 p-4 border border-gray-700 inline-block"
              dir="ltr"
            >
              {user.email}
            </p>
          </div>

          {/* جایگاه‌های آینده برای گیمیفیکیشن */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 border-2 border-gray-700 p-6 opacity-60">
              <h3 className="text-2xl font-bold mb-2 text-yellow-400">
                سطح کاربر (Level)
              </h3>
              <p className="text-gray-400 text-lg">به زودی با سیستم XP...</p>
            </div>
            <div className="bg-gray-900 border-2 border-gray-700 p-6 opacity-60">
              <h3 className="text-2xl font-bold mb-2 text-green-400">
                آزمون‌های هدف
              </h3>
              <p className="text-gray-400 text-lg">به زودی...</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
