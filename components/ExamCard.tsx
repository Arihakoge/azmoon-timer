import { Press_Start_2P } from "next/font/google";

const pixelFontEn = Press_Start_2P({ weight: "400", subsets: ["latin"] });

// تعریف ساختار داده‌هایی که این کامپوننت نیاز دارد (Props)
interface ExamCardProps {
  exam: {
    id: string;
    title: string;
    category: string;
    target_date: string;
    news_link: string;
  };
  now: number;
}

export default function ExamCard({ exam, now }: ExamCardProps) {
  // محاسبه زمان مختص همین کارت
  const distance = new Date(exam.target_date).getTime() - now;
  const isExpired = distance < 0;
  
  const timeLeft = isExpired 
    ? { days: 0, hours: 0, minutes: 0, seconds: 0 }
    : {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      };

  return (
    <div className="bg-black p-6 border-4 border-white shadow-[8px_8px_0_0_rgba(59,130,246,1)] transition-all flex flex-col items-center relative overflow-hidden group">
      <span className="text-lg font-bold text-black bg-blue-400 px-4 py-1 mb-6 border-2 border-white shadow-[2px_2px_0_0_rgba(255,255,255,1)]">
        {exam.category}
      </span>
      
      <h2 className="text-3xl font-bold mb-8 text-center text-white h-12 flex items-center justify-center leading-loose z-10">
        {exam.title}
      </h2>

      <div className="flex gap-3 text-center z-10" dir="ltr">
        <div className="bg-gray-900 p-3 min-w-[70px] border-2 border-gray-600">
          <span className={`${pixelFontEn.className} text-xl text-white block`}>{timeLeft.days.toString().padStart(2, '0')}</span>
          <p className={`${pixelFontEn.className} mt-2 text-gray-400 text-[8px]`}>DAYS</p>
        </div>
        <div className="bg-gray-900 p-3 min-w-[70px] border-2 border-gray-600">
          <span className={`${pixelFontEn.className} text-xl text-white block`}>{timeLeft.hours.toString().padStart(2, '0')}</span>
          <p className={`${pixelFontEn.className} mt-2 text-gray-400 text-[8px]`}>HRS</p>
        </div>
        <div className="bg-gray-900 p-3 min-w-[70px] border-2 border-gray-600">
          <span className={`${pixelFontEn.className} text-xl text-white block`}>{timeLeft.minutes.toString().padStart(2, '0')}</span>
          <p className={`${pixelFontEn.className} mt-2 text-gray-400 text-[8px]`}>MIN</p>
        </div>
        <div className="bg-blue-900/30 p-3 min-w-[70px] border-2 border-blue-500">
          <span className={`${pixelFontEn.className} text-xl text-blue-400 block`}>{timeLeft.seconds.toString().padStart(2, '0')}</span>
          <p className={`${pixelFontEn.className} mt-2 text-blue-400 text-[8px]`}>SEC</p>
        </div>
      </div>

      {exam.news_link && (
         <a href={exam.news_link} target="_blank" rel="noopener noreferrer" className="mt-8 text-xl font-bold text-white bg-gray-800 px-6 py-2 border-2 border-gray-500 shadow-[4px_4px_0_0_rgba(107,114,128,1)] hover:bg-white hover:text-black hover:border-white hover:shadow-[2px_2px_0_0_rgba(255,255,255,1)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all">
           پیگیری اخبار و اطلاعیه‌ها
         </a>
      )}
    </div>
  );
}