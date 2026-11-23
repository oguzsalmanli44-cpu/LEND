// Language support. English text is the key; each dictionary maps it to its language.
// {name} placeholders are filled from the vars passed to t().
import { AZ } from "./az";
import { RU } from "./ru";

export type Lang = "az" | "ru" | "en";
export const LANGS: Lang[] = ["az", "ru", "en"];
const DICTS: Record<string, Record<string, string>> = { az: AZ, ru: RU };

let current: Lang = "az";
export const setLang = (l: Lang) => { current = l; };
export const getLang = () => current;

export function t(s: string, vars?: Record<string, string | number>) {
  const d = DICTS[current];
  const out = d && d[s] != null ? d[s] : s;
  return vars ? out.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? "")) : out;
}

// "{n} days" with the right plural form for each language.
export function daysLabel(n: number) {
  if (current === "ru") {
    const m10 = n % 10, m100 = n % 100;
    const w = m10 === 1 && m100 !== 11 ? "день" : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? "дня" : "дней";
    return `${n} ${w}`;
  }
  return t(n === 1 ? "{n} day" : "{n} days", { n });
}

// Month names written out, since some browsers lack Azerbaijani date data.
const MONTHS: Record<string, string[]> = {
  az: ["yanvar","fevral","mart","aprel","may","iyun","iyul","avqust","sentyabr","oktyabr","noyabr","dekabr"],
  ru: ["январь","февраль","март","апрель","май","июнь","июль","август","сентябрь","октябрь","ноябрь","декабрь"],
  en: ["January","February","March","April","May","June","July","August","September","October","November","December"],
};
const MONTHS_SHORT: Record<string, string[]> = {
  az: ["yan","fev","mar","apr","may","iyn","iyl","avq","sen","okt","noy","dek"],
  ru: ["янв","фев","мар","апр","мая","июн","июл","авг","сен","окт","ноя","дек"],
  en: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
};
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const fmtDay = (d: Date) => `${d.getDate()} ${MONTHS_SHORT[current][d.getMonth()]}`;
export const fmtMonthYear = (d: Date) => `${cap(MONTHS[current][d.getMonth()])} ${d.getFullYear()}`;
