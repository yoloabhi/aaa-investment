import { ContactForm } from "@/components/forms/ContactForm"
import { Mail, Phone, MapPin, Globe, Clock, MessageSquare } from "lucide-react"
import { FadeIn } from "@/components/animations/FadeIn"
import { HeroBackground } from "@/components/animations/HeroBackground"
import { SpotlightCard } from "@/components/animations/SpotlightCard"
import { BlurFade } from "@/components/animations/BlurFade"

export const metadata = {
  title: "Initialize Consultation | AAA Investment & Insurance",
  description: "Secure your financial legacy through expert consultation.",
}

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <HeroBackground />
      
      <div className="container relative z-10 pt-40 pb-24">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <FadeIn>
            <div className="inline-flex items-center space-x-3 bg-secondary/50 border border-border px-6 py-2 rounded-full mb-8 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">
                Direct Channel Secure
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-8 uppercase italic leading-none">
              Initialize <br />
              <span className="text-blue-500">Consultation.</span>
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl md:text-2xl font-medium leading-relaxed max-w-2xl mx-auto">
              Our partners are ready to architect your financial future. Expect a response within 12 business hours.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            <BlurFade delay={0.2}>
              <div className="grid grid-cols-1 gap-6">
                <SpotlightCard>
                  <div className="flex items-start space-x-6">
                    <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0">
                      <Mail className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Encrypted Email</h3>
                      <a href="mailto:acaaainvestment@gmail.com" className="text-base sm:text-xl font-bold hover:text-blue-500 transition-colors break-all">
                        acaaainvestment@gmail.com
                      </a>
                    </div>
                  </div>
                </SpotlightCard>

                <SpotlightCard>
                  <div className="flex items-start space-x-6">
                    <div className="h-14 w-14 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shrink-0">
                      <Phone className="h-6 w-6 text-purple-500" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Direct Line</h3>
                      <a href="tel:+919811306046" className="text-xl font-bold hover:text-purple-500 transition-colors">
                        +91 98113 06046
                      </a>
                    </div>
                  </div>
                </SpotlightCard>

                <SpotlightCard>
                  <div className="flex items-start space-x-6">
                    <div className="h-14 w-14 rounded-2xl bg-green-500/10 flex items-center justify-center border border-green-500/20 shrink-0">
                      <MapPin className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Headquarters</h3>
                      <p className="text-lg font-bold leading-tight">
                        Block 5, Villa No. 4 (FF),<br />
                        Eros Garden, Surajkund Road,<br />
                        Faridabad, HR-121009
                      </p>
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            </BlurFade>

            <BlurFade delay={0.4}>
              <div className="bg-secondary/30 rounded-[2.5rem] p-8 border border-border backdrop-blur-sm">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-6 italic">Operating Standards</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Response Time</span>
                    </div>
                    <span className="text-sm font-black text-foreground">&lt; 12 Hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Service Region</span>
                    </div>
                    <span className="text-sm font-black text-foreground">Global Reach</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Availability</span>
                    </div>
                    <span className="text-sm font-black text-foreground">Mon - Sat</span>
                  </div>
                </div>
              </div>
            </BlurFade>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <BlurFade delay={0.3}>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-background/50 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 border border-border">
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 italic">Transmission Protocol</h3>
                  <ContactForm />
                </div>
              </div>
            </BlurFade>
          </div>
        </div>
      </div>
    </div>
  )
}
