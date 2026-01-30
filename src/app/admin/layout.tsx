'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    Package,
    ShoppingCart,
    Palette,
    Bell,
    LogOut,
    Home,
    Menu,
    X,
    Sparkles
} from 'lucide-react';
import { isAdminAuthenticated, logoutAdmin } from '@/lib/admin-auth';

const navItems = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Custom Orders', href: '/admin/custom-orders', icon: Palette },
    { name: 'Stock Requests', href: '/admin/stock-requests', icon: Bell },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Check if we're on login page
    const isLoginPage = pathname === '/admin/login';

    // All hooks must be called before any conditional returns
    useEffect(() => {
        // Skip auth check for login page
        if (isLoginPage) return;

        const checkAuth = () => {
            const authenticated = isAdminAuthenticated();
            setIsAuthenticated(authenticated);
            if (!authenticated) {
                router.push('/admin/login');
            }
        };
        checkAuth();
    }, [router, isLoginPage]);

    const handleLogout = () => {
        logoutAdmin();
        router.push('/admin/login');
    };

    // Don't apply layout to login page
    if (isLoginPage) {
        return <>{children}</>;
    }

    // Show loading state while checking auth
    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Don't render anything if not authenticated (will redirect)
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-40 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-terracotta" />
                    <span className="font-semibold text-deep-brown">Admin</span>
                </div>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
                    {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 h-full w-64 bg-deep-brown text-white z-50
                transform transition-transform duration-300 ease-in-out
                lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <Sparkles className="w-8 h-8 text-terracotta" />
                        <div>
                            <h1 className="font-bold text-lg">Handcrafted Joy</h1>
                            <p className="text-sm text-gray-400">Admin Panel</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href !== '/admin' && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-terracotta text-white'
                                        : 'text-gray-300 hover:bg-white/10'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom section */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 rounded-lg transition-colors mb-2"
                    >
                        <Home className="w-5 h-5" />
                        View Website
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
                {children}
            </main>
        </div>
    );
}
