import { KeyRound, LogOut, PanelLeft, UserCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const pageNames = {
    "/dashboard": "Хянах самбар",
    "/loans": "Зээлүүд",
    "/payments": "Төлөлтүүд",
    "/profile": "Профайл",
    "/settings": "Тохиргоо",
};

export default function Header({ user, onMenuClick, onLogout }) {
    const { pathname } = useLocation();
    const pageName = pageNames[pathname] || "Хэрэглэгчид";
    const username = user?.username || user?.full_name || "Хэрэглэгч";
    const email = user?.email || "И-мэйл байхгүй";

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="rounded-md p-1.5 text-slate-700 hover:bg-slate-100"
                    aria-label="Цэс нээх"
                >
                    <PanelLeft className="size-4" />
                </button>
                <div className="flex items-center gap-3 text-sm">
                    <span className="text-slate-500">Нүүр</span>
                    <span className="text-slate-400">»</span>
                    <span className="font-medium text-slate-900">{pageName}</span>
                </div>
            </div>

            <details className="relative">
                <summary className="flex cursor-pointer list-none items-center rounded-full p-1 hover:bg-slate-100">
                    <UserCircle className="size-5 text-slate-700" />
                </summary>
                <div className="absolute right-0 top-10 z-20 w-56 overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg">
                    <div className="border-b border-slate-200 px-3 py-2">
                        <p className="truncate text-xs font-semibold text-slate-900">{username}</p>
                        <p className="truncate text-xs text-slate-500">{email}</p>
                    </div>
                    <Link
                        to="/settings"
                        className="flex items-center gap-2 px-3 py-2 text-xs text-slate-800 hover:bg-slate-50"
                    >
                        <KeyRound className="size-4 text-slate-500" />
                        Нууц үг солих
                    </Link>
                    <button
                        type="button"
                        onClick={onLogout}
                        className="flex w-full items-center gap-2 border-t border-slate-200 px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50"
                    >
                        <LogOut className="size-4" />
                        Гарах
                    </button>
                </div>
            </details>
        </header>
    );
}
