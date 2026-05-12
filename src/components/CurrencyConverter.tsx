import { useMemo, useState } from "react";
import { ArrowRightLeft, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CURRENCY_LABELS,
  SUPPORTED_CURRENCIES,
  SupportedCurrency,
  formatForeignCurrency,
  formatInr,
} from "@/lib/pricing";

type ConverterRates = Partial<Record<SupportedCurrency, number>>;

type CurrencyConverterProps = {
  amountInInr: number;
  className?: string;
  compact?: boolean;
};

const FALLBACK_RATES: Record<SupportedCurrency, number> = {
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0094,
  AED: 0.044,
  AUD: 0.018,
  CAD: 0.016,
  SGD: 0.016,
};

export default function CurrencyConverter({
  amountInInr,
  className,
  compact = false,
}: CurrencyConverterProps) {
  const [currency, setCurrency] = useState<SupportedCurrency>("USD");
  const rates: ConverterRates = FALLBACK_RATES;
  const lastUpdated = "Using indicative fallback rates";

  const convertedAmount = useMemo(() => {
    const rate = rates[currency] || FALLBACK_RATES[currency];
    return amountInInr * rate;
  }, [amountInInr, currency, rates]);

  if (compact) {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          <ArrowRightLeft className="h-3.5 w-3.5 text-primary" />
          Currency View
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Select currency"
            value={currency}
            onChange={(event) => setCurrency(event.target.value as SupportedCurrency)}
            className="h-10 rounded-full border border-primary/15 bg-background px-4 text-sm font-semibold text-foreground outline-none"
          >
            {SUPPORTED_CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
          <span className="text-sm font-semibold text-muted-foreground">{formatInr(amountInInr)}</span>
          <span className="text-sm font-bold text-primary">approx. {formatForeignCurrency(convertedAmount, currency)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-[2rem] border border-primary/10 bg-primary/5 p-5", className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-primary">Currency Converter</p>
          <p className="mt-2 text-sm text-muted-foreground">Show this fare in a familiar currency for overseas guests.</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full"
          aria-label="Rates status"
        >
          <RefreshCcw className="h-4 w-4 text-primary" />
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <label className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Guest Currency</span>
          <select
            aria-label="Select currency"
            value={currency}
            onChange={(event) => setCurrency(event.target.value as SupportedCurrency)}
            className="h-12 w-full rounded-2xl border border-primary/15 bg-background px-4 text-sm font-semibold text-foreground outline-none"
          >
            {SUPPORTED_CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code} · {CURRENCY_LABELS[code]}
              </option>
            ))}
          </select>
        </label>
        <div className="rounded-2xl bg-background px-5 py-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Approximate Fare</p>
          <p className="mt-1 text-lg font-black text-primary">{formatForeignCurrency(convertedAmount, currency)}</p>
        </div>
      </div>

      <p className="mt-3 text-[11px] text-muted-foreground">
        {lastUpdated}. Base fare remains {formatInr(amountInInr)} per person.
      </p>
    </div>
  );
}
