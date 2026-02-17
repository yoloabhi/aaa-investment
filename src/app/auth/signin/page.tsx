import { SignInButton } from "@/components/auth/SignInButton"
import { ShieldAlert } from "lucide-react"

export default function SignInPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full bg-white p-12 rounded-3xl shadow-xl border">
        <div className="text-center mb-8">
          <div className="bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Admin Portal</h1>
          <p className="text-muted-foreground">Authorized access only. Please sign in with your company Google account.</p>
        </div>
        
        <SignInButton />
        
        <div className="mt-8 text-center text-xs text-muted-foreground">
          If you encounter issues, contact the system administrator.
        </div>
      </div>
    </div>
  )
}
