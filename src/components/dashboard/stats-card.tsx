import { cn } from "@/lib/utils";

type Variant = "default" | "success" | "destructive" | "info" | "warning";

const VARIANT_STYLES: Record<Variant, string> = {
  default: "text-[#111827]",
  success: "text-[#16A34A]",
  destructive: "text-[#DC2626]",
  info: "text-[#2563EB]",
  warning: "text-[#D97706]",
};

interface StatsCardProps {
  label: string;
  value: number;
  variant?: Variant;
}

export function StatsCard({ label, value, variant = "default" }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
      <p className="text-sm font-medium text-[#6B7280]">{label}</p>
      <p className={cn("text-3xl font-bold mt-1", VARIANT_STYLES[variant])}>
        {value}
      </p>
    </div>
  );
}
