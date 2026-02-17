import { cn } from "@/lib/utils"

export function Logo({ className, textClassName }: { className?: string, textClassName?: string }) {
  return (
    <div className={cn("flex items-center space-x-3 group", className)}>
      <div className="aaa-logo-shield group-hover:rotate-6 transition-transform duration-500">
        <span className="relative z-10 text-xl tracking-tighter">A</span>
      </div>
      <div className={cn("flex flex-col leading-none", textClassName)}>
        <span className="text-xl font-black tracking-tighter uppercase italic">AAA</span>
        <span className="text-[8px] font-black tracking-[0.3em] uppercase opacity-50">INVESTMENT</span>
      </div>
    </div>
  )
}
