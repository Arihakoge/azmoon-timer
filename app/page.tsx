"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// اتصال به سوپربیس
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date().getTime());

  // دریافت تمام آزمون‌ها از دیتابیس
  useEffect(() => {
    const fetchExams = async () => {
      const { data, error } = await supabase
        .from("exams")
        .select("*")
        .order("target_date", { ascending: true }); // مرتب‌سازی از نزدیک‌ترین آزمون

      if (error) {
        console.error("خطا در دریافت اطلاعات:", error);
      } else {
        setExams(data || []);
      }
      setLoading(false);
    };

    fetchExams();
  }, []);

  // یک تایمر مرکزی که هر یک ثانیه به‌روز می‌شود
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date().getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // فرمول محاسبه زمان باقی‌مانده برای هر کارت
  const calculateTimeLeft = (targetDate: string) => {
    const distance = new Date(targetDate).getTime() - now;
    if (distance < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
    };
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white font-bold text-xl">
        در حال دریافت جدیدترین آزمون‌ها...
      </div>
    );

  return (
    <main
      className="min-h-screen bg-gray-950 text-white p-6 md:p-12 font-sans"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-12 text-center text-gray-100">
          مرجع زمان‌بندی آزمون‌های کشوری
        </h1>

        {exams.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">
            هیچ آزمونی در سیستم ثبت نشده است.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {exams.map((exam) => {
              const timeLeft = calculateTimeLeft(exam.target_date);
              return (
                <div
                  key={exam.id}
                  className="bg-gray-900 p-6 rounded-3xl shadow-xl border border-gray-800 flex flex-col items-center hover:border-gray-600 transition-colors"
                >
                  <span className="text-xs font-semibold text-blue-400 bg-blue-900/30 px-3 py-1.5 rounded-full mb-4">
                    {exam.category}
                  </span>

                  <h2 className="text-2xl font-bold mb-6 text-center text-gray-100 h-14 flex items-center justify-center leading-tight">
                    {exam.title}
                  </h2>

                  <div className="flex gap-2 text-center" dir="ltr">
                    <div className="bg-gray-800 p-3 rounded-xl min-w-[65px] border border-gray-700 shadow-inner">
                      <span className="text-2xl font-bold text-white block">
                        {timeLeft.days}
                      </span>
                      <p className="mt-1 text-gray-400 text-[11px] font-medium tracking-wider">
                        روز
                      </p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-xl min-w-[65px] border border-gray-700 shadow-inner">
                      <span className="text-2xl font-bold text-white block">
                        {timeLeft.hours}
                      </span>
                      <p className="mt-1 text-gray-400 text-[11px] font-medium tracking-wider">
                        ساعت
                      </p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-xl min-w-[65px] border border-gray-700 shadow-inner">
                      <span className="text-2xl font-bold text-white block">
                        {timeLeft.minutes}
                      </span>
                      <p className="mt-1 text-gray-400 text-[11px] font-medium tracking-wider">
                        دقیقه
                      </p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-xl min-w-[65px] border border-blue-900/40 shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                      <span className="text-2xl font-bold text-blue-400 block">
                        {timeLeft.seconds}
                      </span>
                      <p className="mt-1 text-blue-400/80 text-[11px] font-medium tracking-wider">
                        ثانیه
                      </p>
                    </div>
                  </div>

                  {exam.news_link && (
                    <a
                      href={exam.news_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 text-sm text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4 decoration-blue-400/30"
                    >
                      پیگیری اخبار این آزمون
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
