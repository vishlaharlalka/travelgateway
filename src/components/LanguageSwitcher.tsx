import { useEffect, useMemo, useState } from "react";

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (
          options: Record<string, unknown>,
          elementId: string
        ) => unknown;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

const GOOGLE_SCRIPT_ID = "google-translate-script";
const GOOGLE_ELEMENT_ID = "google_translate_element";
const STORAGE_KEY = "travelgateway-language";

const languageOptions = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "vi", label: "Vietnamese", flag: "🇻🇳" },
  { code: "fr", label: "French", flag: "🇫🇷" },
  { code: "ja", label: "Japanese", flag: "🇯🇵" },
  { code: "es", label: "Spanish", flag: "🇪🇸" },
  { code: "de", label: "German", flag: "🇩🇪" },
  { code: "zh-CN", label: "Chinese", flag: "🇨🇳" },
  { code: "ko", label: "Korean", flag: "🇰🇷" },
  { code: "th", label: "Thai", flag: "🇹🇭" },
  { code: "ar", label: "Arabic", flag: "🇦🇪" },
];

const supportedLanguageCodes = new Set(languageOptions.map((language) => language.code));

function isLocalEnvironment() {
  if (typeof window === "undefined") return false;

  return ["localhost", "127.0.0.1"].includes(window.location.hostname);
}

function readSavedLanguage() {
  if (typeof window === "undefined") return "en";

  if (isLocalEnvironment()) return "en";

  const cookieMatch = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
  const cookieLang = cookieMatch?.[1]?.split("/").pop();
  const storedLang = window.localStorage.getItem(STORAGE_KEY);

  const preferredLanguage = cookieLang || storedLang || "en";
  return supportedLanguageCodes.has(preferredLanguage) ? preferredLanguage : "en";
}

function setTranslateCookie(languageCode: string) {
  const translateValue = languageCode === "en" ? "/auto/en" : `/auto/${languageCode}`;
  document.cookie = `googtrans=${translateValue};path=/;max-age=31536000`;
  document.cookie = `googtrans=${translateValue};path=/;domain=${window.location.hostname};max-age=31536000`;
}

function applyLanguage(languageCode: string) {
  const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");

  setTranslateCookie(languageCode);
  window.localStorage.setItem(STORAGE_KEY, languageCode);
  document.documentElement.lang = languageCode;

  if (combo) {
    combo.value = languageCode;
    combo.dispatchEvent(new Event("change"));
    return;
  }

  window.location.reload();
}

export default function LanguageSwitcher({
  mobile = false,
  renderTranslateTarget = false,
}: {
  mobile?: boolean;
  renderTranslateTarget?: boolean;
}) {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const selectClassName = useMemo(
    () =>
      mobile
        ? "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-lg font-semibold text-[#07111f] outline-none transition-colors focus:border-primary"
        : "h-9 w-14 rounded-full border border-white/20 bg-white/10 px-2 text-lg font-semibold text-inherit backdrop-blur-xl outline-none transition-colors focus:border-primary focus:bg-white/20",
    [mobile]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedLanguage = readSavedLanguage();
    setSelectedLanguage(savedLanguage);
    document.documentElement.lang = savedLanguage;
    setTranslateCookie(savedLanguage);
    window.localStorage.setItem(STORAGE_KEY, savedLanguage);

    if (savedLanguage === "en") {
      return;
    }

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: languageOptions.map((language) => language.code).join(","),
          autoDisplay: false,
        },
        GOOGLE_ELEMENT_ID
      );

      window.setTimeout(() => {
        if (savedLanguage !== "en") {
          applyLanguage(savedLanguage);
          return;
        }

        setTranslateCookie(savedLanguage);
        window.localStorage.setItem(STORAGE_KEY, savedLanguage);
      }, 300);
    };

    if (!document.getElementById(GOOGLE_SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = GOOGLE_SCRIPT_ID;
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit?.();
    }
  }, []);

  return (
    <>
      {renderTranslateTarget && <div id={GOOGLE_ELEMENT_ID} className="notranslate hidden" aria-hidden="true" />}
      <div className={mobile ? "space-y-2" : "relative"}>
        {mobile && <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0B2147]/60">Language</p>}
        <select
          aria-label="Select site language"
          value={selectedLanguage}
          onChange={(event) => {
            const nextLanguage = event.target.value;
            setSelectedLanguage(nextLanguage);
            applyLanguage(nextLanguage);
          }}
          title={languageOptions.find((language) => language.code === selectedLanguage)?.label || "Language"}
          className={selectClassName}
        >
          {languageOptions.map((language) => (
            <option key={language.code} value={language.code} className="text-slate-900">
              {mobile ? `${language.flag} ${language.label}` : language.flag}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
