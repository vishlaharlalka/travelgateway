import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-16 w-16", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="tg-card" x1="24" y1="18" x2="176" y2="182" gradientUnits="userSpaceOnUse">
          <stop stopColor="#101F37" />
          <stop offset="0.48" stopColor="#0B2147" />
          <stop offset="1" stopColor="#07111F" />
        </linearGradient>
        <linearGradient id="tg-sun" x1="50" y1="42" x2="146" y2="142" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF4CF" />
          <stop offset="0.44" stopColor="#E4B85F" />
          <stop offset="1" stopColor="#B9792D" />
        </linearGradient>
        <linearGradient id="tg-horizon" x1="52" y1="120" x2="148" y2="150" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EED8A0" />
          <stop offset="1" stopColor="#8FB6AA" />
        </linearGradient>
        <linearGradient id="tg-compass" x1="68" y1="62" x2="132" y2="142" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#D7C08B" />
        </linearGradient>
        <filter id="tg-soft-shadow" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#000814" floodOpacity="0.35" />
        </filter>
      </defs>

      <rect x="17" y="17" width="166" height="166" rx="42" fill="url(#tg-card)" filter="url(#tg-soft-shadow)" />
      <rect x="17" y="17" width="166" height="166" rx="42" stroke="#D9B56D" strokeWidth="3.5" />
      <rect x="29" y="29" width="142" height="142" rx="34" stroke="#FFFFFF" strokeOpacity="0.12" strokeWidth="2" />

      <circle cx="100" cy="88" r="38" fill="url(#tg-sun)" opacity="0.98" />
      <path d="M56 127C69 113 84 107 101 109C119 111 131 124 145 116C154 111 162 101 169 91" stroke="#F8E9B8" strokeWidth="5.2" strokeLinecap="round" opacity="0.92" />
      <path d="M43 136C59 126 74 123 91 126C113 130 129 145 156 128" stroke="url(#tg-horizon)" strokeWidth="8" strokeLinecap="round" />
      <path d="M49 149C66 144 83 143 101 146C119 149 135 154 153 147" stroke="#8FB6AA" strokeOpacity="0.58" strokeWidth="5" strokeLinecap="round" />

      <path
        d="M100 57L112 103L145 115L114 127L100 159L86 127L55 115L88 103L100 57Z"
        fill="url(#tg-compass)"
        opacity="0.96"
      />
      <path
        d="M100 75L107 106L129 114L107 121L100 145L93 121L71 114L93 106L100 75Z"
        fill="#0B2147"
        opacity="0.88"
      />
      <path
        d="M57 69C72 56 88 50 106 51C125 52 140 61 154 76"
        stroke="#FFFFFF"
        strokeOpacity="0.82"
        strokeWidth="3.8"
        strokeLinecap="round"
      />
      <path
        d="M63 160C75 166 88 169 102 169C116 169 130 166 142 160"
        stroke="#D9B56D"
        strokeWidth="4.5"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
