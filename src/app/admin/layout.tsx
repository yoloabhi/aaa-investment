import Link from "next/link"
import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  Image as ImageIcon, 
  FileText, 
  Settings, 
  LogOut, 
  Inbox,
  Layers
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Leads', href: '/admin/leads', icon: Inbox },
  { name: 'News', href: '/admin/news', icon: FileText },
  { name: 'Resources', href: '/admin/resources', icon: Layers },
  { name: 'Team', href: '/admin/team', icon: Users },
  { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/signin")
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed inset-y-0">
        <div className="p-6 border-b border-slate-800">
          <Link href="/" className="text-xl font-bold tracking-tight">
            AAA <span className="text-blue-400">Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <form
            action={async () => {
              'use server'
              await signOut({ redirectTo: "/" })
            }}
          >
            <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-400/10">
              <LogOut className="mr-3 h-5 w-5" /> Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-10">
        {children}
      </main>
    </div>
  )
}
