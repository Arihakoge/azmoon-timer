"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Handjet } from "next/font/google";
import { supabase } from "@/utils/supabase";

// ایمپورت‌های مربوط به تقویم شمسی
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css"; // استایل دارک مود تقویم

const pixelFontFa = Handjet({ subsets: ["arabic"] });

export default function AdminPanel() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // استیت‌های فرم
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("دانشگاهی");
  
  // استیت تقویم حالا از نوع DateObject کتابخانه است
  const [targetDate, setTargetDate] = useState<DateObject | null>(null);
  
  const [newsLink, setNewsLink] = useState("");
  const [submitMessage, setSubmitMessage] = useState({ text: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || session.user.email !== "admin@azmoon.com") {
        router.push("/dashboard");
      } else {
        setIsAdmin(true);
      }
      setLoading(false);
    };

    checkAdmin();
  }, [router]);

  const handleAddExam = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // بررسی اینکه آیا تاریخ انتخاب شده یا نه
    if (!targetDate) {
      setSubmitMessage({ text: "لطفاً تاریخ و ساعت ماموریت را انتخاب کن!", type: "error" });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage({ text: "", type: "" });

    try {
      // تبدیل تاریخ شمسی انتخاب شده به فرمت استاندارد میلادی برای ذخیره در دیتابیس
      const isoDate = targetDate.toDate().toISOString();

      const { error } = await supabase
        .from("exams")
        .insert([
          { 
            title: title, 
            category: category, 
            target_date: isoDate, 
            news_link: newsLink || null 
          }
        ]);

      if (error) throw error;

      setSubmitMessage({ text: "ماموریت با موفقیت به سیستم اضافه شد!", type: "success" });
      
      // خالی کردن فرم
      setTitle("");
      setTargetDate(null);
      setNewsLink("");
    } catch (error: any) {
      setSubmitMessage({ text: "خطا در ثبت اطلاعات: " + error.message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-white font-bold text-2xl">در حال احراز هویت فرمانده...</div>;
  if (!isAdmin) return null;

  return (
    <main className={`min-h-screen bg-[#0a0a0a] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] text-white p-6 md:p-12 ${pixelFontFa.className}`} dir="rtl">
      <div className="max-w-3xl mx-auto mt-10">
        
        <div className="bg-black p-8 border-4 border-red-500 shadow-[8px_8px_0_0_rgba(239,68,68,1)]">
          
          <div className="text-center mb-10 border-b-2 border-red-900 pb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-red-500">پنل فرماندهی (مخفی)</h1>
            <p className="mt-2 text-gray-400 font-bold">دسترسی سطح بالا: فقط برای مدیر سیستم</p>
          </div>

          {submitMessage.text && (
            <div className={`p-4 mb-6 font-bold border-2 text-center text-xl ${submitMessage.type === "error" ? "bg-red-900/50 border-red-500 text-red-200" : "bg-green-900/50 border-green-500 text-green-200"}`}>
              {submitMessage.text}
            </div>
          )}

          <form onSubmit={handleAddExam} className="space-y-6">
            <div>
              <label className="block text-gray-400 text-xl font-bold mb-2">نام آزمون / ماموریت:</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-900 border-2 border-gray-600 text-white p-3 text-xl focus:border-red-500 focus:outline-none"
                placeholder="مثال: کنکور سراسری تجربی"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-xl font-bold mb-2">دسته‌بندی:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-900 border-2 border-gray-600 text-white p-3 text-xl focus:border-red-500 focus:outline-none cursor-pointer"
              >
                <option value="دانشگاهی">دانشگاهی</option>
                <option value="دانش‌آموزی">دانش‌آموزی</option>
                <option value="استخدامی">استخدامی</option>
                <option value="حرفه‌ای">حرفه‌ای و نظام مهندسی</option>
                <option value="المپیاد">المپیادها</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 text-xl font-bold mb-2">تاریخ و ساعت دقیق آزمون:</label>
              {/* تقویم خفن شمسی */}
              <div className="w-full">
                <DatePicker
                  value={targetDate}
                  onChange={setTargetDate}
                  calendar={persian}
                  locale={persian_fa}
                  format="YYYY/MM/DD HH:mm:ss"
                  plugins={[
                    <TimePicker key="time" position="bottom" />
                  ]}
                  className="bg-dark" // اعمال استایل دارک
                  inputClass="w-full bg-gray-900 border-2 border-gray-600 text-white p-3 text-xl focus:border-red-500 focus:outline-none text-left cursor-pointer"
                  containerClassName="w-full"
                  placeholder="انتخاب از روی تقویم..."
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-xl font-bold mb-2">لینک اخبار (اختیاری):</label>
              <input
                type="url"
                value={newsLink}
                onChange={(e) => setNewsLink(e.target.value)}
                className="w-full bg-gray-900 border-2 border-gray-600 text-white p-3 text-xl focus:border-red-500 focus:outline-none"
                placeholder="https://sanjesh.org/..."
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-8 w-full text-2xl font-bold text-white bg-red-600 px-4 py-4 border-2 border-red-400 shadow-[4px_4px_0_0_rgba(252,165,165,0.5)] hover:bg-red-500 hover:translate-y-[2px] hover:translate-x-[2px] transition-all disabled:opacity-50"
            >
              {isSubmitting ? "در حال تزریق به هسته..." : "➕ ثبت آزمون جدید در سیستم"}
            </button>
          </form>

        </div>
      </div>
    </main>
  );
}