import { fmt } from "./util";
import type { Worker } from "./seed";

export const TEMPLATES = [
  { id: "contract", name: "Employment contract" },
  { id: "order", name: "Order of hire" },
  { id: "nda", name: "NDA" },
  { id: "certificate", name: "Work certificate" },
  { id: "leave", name: "Leave order" },
];

export type Built = { title: string; sub: string; body: string[] };

/** Generated documents are always in Azerbaijani (Azerbaijani letters ə ğ ı ö ü ş ç are the point). */
export function buildDoc(templateName: string, w: Worker, over: { salary?: string; probation?: string } = {}): Built {
  const salary = over.salary || String(w.salary);
  const probation = over.probation ?? String(w.probationMonths);
  const start = fmt(w.start);
  switch (templateName) {
    case "Order of hire":
      return {
        title: "ƏMR",
        sub: "İşə qəbul haqqında",
        body: [
          `${w.name} ${start} tarixindən etibarən ${w.dept} şöbəsinə ${w.position} vəzifəsinə işə qəbul edilsin.`,
          `Aylıq əmək haqqı ${salary} AZN müəyyən edilsin.`,
          `Sınaq müddəti ${probation} ay müəyyən edilsin.`,
          "Əsas: əmək müqaviləsi və işçinin ərizəsi.",
        ],
      };
    case "NDA":
      return {
        title: "MƏXFİLİK HAQQINDA RAZILAŞMA",
        sub: "",
        body: [
          `${w.name} (FİN: ${w.fin}) iş fəaliyyəti zamanı əldə etdiyi kommersiya və xidməti məlumatları üçüncü şəxslərə açıqlamamağı öhdəsinə götürür.`,
          "Bu öhdəlik əmək münasibətləri başa çatdıqdan sonra da qüvvədə qalır.",
          "Tərəflər qanunvericiliyə uyğun məsuliyyət daşıyırlar.",
        ],
      };
    case "Work certificate":
    case "Salary certificate":
    case "Employment verification":
      return {
        title: "ARAYIŞ",
        sub: "",
        body: [
          `Bu arayış ${w.name}-ın ${start} tarixindən "Şirkət" MMC-də ${w.dept} şöbəsində ${w.position} vəzifəsində çalışdığını təsdiq edir.`,
          `Aylıq əmək haqqı ${salary} AZN təşkil edir.`,
          "Arayış tələb olunduğu yerə təqdim etmək üçün verilmişdir.",
        ],
      };
    case "Leave order":
      return {
        title: "ƏMR",
        sub: "Məzuniyyət verilməsi haqqında",
        body: [
          `${w.name}-a ${w.position} vəzifəsi üzrə növbəti əmək məzuniyyəti verilsin.`,
          "Əsas: işçinin ərizəsi və HR-ın razılığı.",
        ],
      };
    default:
      return {
        title: "ƏMƏK MÜQAVİLƏSİ",
        sub: "",
        body: [
          `"Şirkət" MMC (bundan sonra — İşəgötürən) bir tərəfdən, ${w.name} (FİN: ${w.fin}) (bundan sonra — İşçi) digər tərəfdən aşağıdakılar barədə bu müqaviləni bağladılar:`,
          `1. İşçi ${w.dept} şöbəsində ${w.position} vəzifəsində işləməyi öhdəsinə götürür.`,
          `2. İşə başlama tarixi: ${start}. Sınaq müddəti — ${probation} ay.`,
          `3. Aylıq əmək haqqı ${salary} AZN təşkil edir.`,
          "4. Tərəflərin hüquq və vəzifələri Azərbaycan Respublikasının Əmək Məcəlləsinə uyğun müəyyən edilir.",
        ],
      };
  }
}
