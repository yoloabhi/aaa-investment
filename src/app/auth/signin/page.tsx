'use client'

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShieldAlert, Loader2, Mail } from "lucide-react"
import { FadeIn } from "@/components/animations/FadeIn"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await signIn("resend", { 
        email, 
        callbackUrl: "/admin",
        redirect: false 
      })
      setIsSent(true)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full">
        <FadeIn>
          <div className="bg-secondary/30 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] border border-border shadow-2xl">
            <div className="text-center mb-10">
              <div className="aaa-logo-shield mx-auto mb-8">A</div>
              <h1 className="text-3xl font-black tracking-tighter uppercase italic mb-3">Admin Portal</h1>
              <p className="text-muted-foreground text-sm font-medium">Authorized Personnel Only</p>
            </div>
            
            {isSent ? (
              <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
                <div className="h-16 w-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                  <Mail className="h-8 w-8 text-blue-500" />
                </div>
                <h2 className="text-xl font-bold mb-2">Check your inbox</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  A secure magic link has been sent to <br />
                  <span className="text-foreground font-bold">{email}</span>
                </p>
                <Button 
                  variant="link" 
                  className="mt-6 text-blue-500 font-bold uppercase tracking-widest text-xs"
                  onClick={() => setIsSent(false)}
                >
                  Try different email
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Corporate Email</label>
                  <Input 
                    type="email" 
                    placeholder="name@company.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-14 rounded-2xl bg-background/50 border-border focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black text-lg group border-none"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying...</>
                  ) : (
                    'Initialize Access'
                  )}
                </Button>
              </form>
            )}
            
            <div className="mt-10 pt-8 border-t border-border text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 leading-relaxed">
                TRANS-SECURE ENCRYPTION ACTIVE <br />
                IP ADDRESS LOGGED FOR AUDIT
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
