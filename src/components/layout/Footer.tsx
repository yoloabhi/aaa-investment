import Link from "next/link"
import { Instagram, Mail, ArrowUpRight } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-20">
      <div className="container">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-4 lg:grid-cols-5">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-8 group">
              <div className="aaa-logo-shield transition-transform group-hover:scale-110">A</div>
              <span className="text-lg font-bold tracking-tighter uppercase italic text-foreground">AAA Investment</span>
            </Link>
            <p className="text-muted-foreground max-w-sm leading-relaxed mb-10">
              Engineering financial security since 1993. A premier consulting firm dedicated to wealth management and comprehensive risk protection.
            </p>
            
            <div className="flex items-center space-x-4">
              <a 
                href="https://instagram.com/aaainvestmentandinsurance" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-12 w-12 rounded-2xl bg-secondary border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-500 group"
              >
                <Instagram className="h-5 w-5 transition-transform group-hover:scale-110" />
              </a>
              <a 
                href="mailto:acaaainvestment@gmail.com" 
                className="h-12 w-12 rounded-2xl bg-secondary border border-border flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all duration-500 group"
              >
                <Mail className="h-5 w-5 transition-transform group-hover:scale-110" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-foreground mb-8">Navigation</h4>
            <ul className="space-y-4 text-sm font-medium text-muted-foreground">
              <li><Link href="/services" className="hover:text-primary transition-colors">Services</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Legacy</Link></li>
              <li><Link href="/gallery" className="hover:text-primary transition-colors">Milestones</Link></li>
              <li><Link href="/news" className="hover:text-primary transition-colors">Insights</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-foreground mb-8">Support</h4>
            <ul className="space-y-4 text-sm font-medium text-muted-foreground">
              <li><Link href="/resources" className="hover:text-primary transition-colors">Knowledge Base</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Consultation</Link></li>
              <li><Link href="/admin" className="hover:text-primary transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-foreground mb-8">Contact</h4>
            <div className="space-y-4 text-sm font-medium text-muted-foreground">
              <p>+91 98113 06046</p>
              <p className="break-all">acaaainvestment@gmail.com</p>
            </div>
          </div>
        </div>
        
        <div className="mt-20 pt-10 border-t border-border flex flex-col md:flex-row justify-between gap-6">
          <div className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest max-w-2xl">
            INVESTMENTS ARE SUBJECT TO MARKET RISKS. INSURANCE IS THE SUBJECT MATTER OF SOLICITATION. 
            AAA INVESTMENT & INSURANCE © {new Date().getFullYear()} ALL RIGHTS RESERVED.
          </div>
          <div className="flex space-x-6 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
