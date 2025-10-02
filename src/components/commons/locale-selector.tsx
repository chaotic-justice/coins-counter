import { useLocaleSelector } from "gt-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { capitalize } from "@/lib/strings";

export default function LocaleSelector({
  locales: _locales,
  ...props
}: {
  locales?: string[];
  [key: string]: unknown;
}): React.JSX.Element | null {
  // Get locale selector properties
  const { locale, locales, setLocale, getLocaleProperties } = useLocaleSelector(
    _locales ? _locales : undefined,
  );

  // Get display name
  const getDisplayName = (l: string) =>
    capitalize(getLocaleProperties(l).nativeNameWithRegionCode);

  // If no locales are returned, just render nothing or handle gracefully
  if (!locales || locales.length === 0 || !setLocale) {
    return null;
  }

  return (
    <Select
      {...props}
      value={locale || ""}
      onValueChange={(value: string) => setLocale(value)}
    >
      <SelectTrigger>
        <SelectValue>{locale ? getDisplayName(locale) : ""}</SelectValue>
      </SelectTrigger>

      <SelectContent>
        {locales.map((l) => (
          <SelectItem key={l} value={l}>
            {getDisplayName(l)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
