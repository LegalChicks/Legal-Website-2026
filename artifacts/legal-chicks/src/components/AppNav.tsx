import { useAuth } from "@/lib/auth-context";
import { useLocation } from "wouter";
import farmLogo from "@assets/Legal_Chicks_Farm_Logo_1782840193981.png";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, ClipboardList, ShieldCheck, ReceiptText, Egg } from "lucide-react";

export function AppNav() {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: "/records", label: "My Records", icon: <ClipboardList className="w-4 h-4" /> },
    { href: "/sales", label: "Sales", icon: <ReceiptText className="w-4 h-4" /> },
    { href: "/incubation", label: "Incubation", icon: <Egg className="w-4 h-4" /> },
    ...(user.role === "admin"
      ? [{ href: "/admin", label: "Admin", icon: <ShieldCheck className="w-4 h-4" /> }]
      : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#3a0d0d] text-white shadow-lg border-b border-white/10">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-16">
        <a href="/" className="flex items-center gap-3">
          <img src={farmLogo} alt="LCPF Logo" className="w-9 h-9 object-contain" />
          <span className="font-serif font-bold text-lg tracking-tight text-white">LEGAL CHICKS</span>
        </a>

        <div className="flex items-center gap-2 md:gap-4">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => setLocation(link.href)}
              className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                location === link.href
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {link.icon}
              {link.label}
            </button>
          ))}

          <div className="flex items-center gap-2 ml-2 pl-2 border-l border-white/20">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-white leading-tight">{user.fullName}</p>
              <Badge className={`text-xs px-2 py-0 ${user.role === "admin" ? "bg-amber-500 text-black" : "bg-white/20 text-white"}`}>
                {user.role}
              </Badge>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleLogout}
              className="text-white/80 hover:text-white hover:bg-white/10 gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden flex border-t border-white/10 bg-[#2a0808]">
        {navLinks.map((link) => (
          <button
            key={link.href}
            onClick={() => setLocation(link.href)}
            className={`flex-1 flex flex-col items-center gap-1 py-2 text-xs font-medium transition-colors ${
              location === link.href
                ? "text-amber-400"
                : "text-white/60 hover:text-white"
            }`}
          >
            {link.icon}
            {link.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
