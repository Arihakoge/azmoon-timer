"use client";
import { useState, useEffect } from "react";
import { Handjet } from "next/font/google";
import { supabase } from "@/utils/supabase";
import ExamCard from "@/components/ExamCard";
import Link from "next/link"; // ابزار لینک دادن در نکست

const pixelFontFa = Handjet({ subsets: ["arabic"] });

export default function Home() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date().getTime());
  const [activeCategory, setActiveCategory] = useState<string>("همه");
  const [user, setUser] = useState<any>(null); // استیت برای چک کردن کاربر

  useEffect(() => {
    // گرفتن لیست آزمون‌ها و همزمان چک کردن اینکه آیا کاربر لاگین است یا نه
    const fetchInitialData = async () => {
      // چک کردن کاربر
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);

      // گرفتن آزمون‌ها
      const { data, error } = await supabase
        .from("exams")
        .select("*")
        .order("target_date", { ascending: true });
      if (!error) setExams(data || []);

      setLoading(false);
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date().getTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white font-bold text-xl tracking-widest">
        در حال بارگذاری اطلاعات...
      </div>
    );

  const categories = [
    "همه",
    ...Array.from(new Set(exams.map((exam) => exam.category))),
  ];
  const filteredExams =
    activeCategory === "همه"
      ? exams
      : exams.filter((exam) => exam.category === activeCategory);

  return (
    <main
      className={`min-h-screen relative bg-[#0a0a0a] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] text-white p-6 md:p-12 ${pixelFontFa.className}`}
      dir="rtl"
    >
      {/* دکمه هوشمند ورود / داشبورد در گوشه سمت چپ بالای صفحه */}
      <div className="absolute top-6 left-6 md:top-12 md:left-12 z-50">
        {user ? (
          <Link
            href="/dashboard"
            className="text-xl font-bold text-white bg-blue-600 px-6 py-2 border-2 border-white shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:bg-blue-500 hover:translate-y-[2px] hover:translate-x-[2px] transition-all"
          >
            ورود به داشبورد
          </Link>
        ) : (
          <Link
            href="/login"
            className="text-xl font-bold text-white bg-red-600 px-6 py-2 border-2 border-white shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:bg-red-500 hover:translate-y-[2px] hover:translate-x-[2px] transition-all"
          >
            ثبت‌نام | ورود
          </Link>
        )}
      </div>

      <div className="max-w-7xl mx-auto mt-16 md:mt-0">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white inline-block border-b-4 border-blue-500 pb-4 shadow-[0_4px_0_0_rgba(59,130,246,1)] leading-relaxed">
            مرجع زمان‌بندی آزمون‌های کشوری
          </h1>
          <p className="mt-6 text-gray-400 text-xl font-medium tracking-wide">
            لحظه‌شمار دقیق رقابت‌های تحصیلی و حرفه‌ای
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 text-xl font-bold border-2 transition-all ${
                activeCategory === category
                  ? "bg-blue-600 border-white text-white shadow-[4px_4px_0_0_rgba(255,255,255,1)] translate-y-[2px] translate-x-[2px]"
                  : "bg-gray-900 border-gray-600 text-gray-400 hover:text-white hover:border-white shadow-[4px_4px_0_0_rgba(75,85,99,1)]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredExams.length === 0 ? (
          <p className="text-center text-gray-500 text-2xl font-bold mt-10">
            آزمونی در این دسته‌بندی یافت نشد.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredExams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} now={now} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
