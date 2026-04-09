import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import {
    Calendar,
    FileText,
    Pill,
    Search,
    History,
    Activity,
    ArrowRight,
    LogOut,
    User,
    LayoutDashboard,
    Stethoscope,
    Bot
} from 'lucide-react'
import Link from 'next/link'

import { generateHealthTips } from '@/app/actions/ai'

export default async function PatientDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    const aiTips = await generateHealthTips()

    const stats = [
        { label: 'Upcoming Appointments', value: '1', icon: Calendar, sub: 'Next: tomorrow at 10 AM' },
        { label: 'Total Prescriptions', value: '12', icon: FileText, sub: '3 pending refill' },
        { label: 'Active Medications', value: '4', icon: Pill, sub: 'Updated 2 days ago' },
    ]

    const timeline = [
        { date: 'Oct 24, 2025', type: 'General Checkup', doctor: 'Dr. Sarah Wilson', status: 'Completed', icon: Activity },
        { date: 'Sep 12, 2025', type: 'Cardiology Visit', doctor: 'Dr. James Chen', status: 'Completed', icon: Stethoscope },
        { date: 'Aug 05, 2025', type: 'Dental Cleaning', doctor: 'Dr. Michael Rossi', status: 'Completed', icon: Activity },
    ]

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-72 bg-white border-r border-gray-100 flex flex-col p-6 space-y-8">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                        <LayoutDashboard className="w-6 h-6" />
                    </div>
                    <span className="font-black text-xl text-gray-900 tracking-tight">PharmaTech</span>
                </div>

                <nav className="flex-1 space-y-1">
                    {[
                        { label: 'Dashboard', icon: LayoutDashboard, active: true },
                        { label: 'Search Doctors', icon: Search, href: '/search' },
                        { label: 'Symptom Checker', icon: Bot, href: '/dashboard/patient/symptoms' },
                        { label: 'My Records', icon: FileText, href: '/dashboard/patient/records' },
                        { label: 'Settings', icon: History },
                    ].map((item, i) => (
                        <Link
                            key={i}
                            href={item.href || '#'}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold transition-all group ${item.active
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${item.active ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="pt-6 border-t border-gray-100">
                    <Link href="/api/auth/signout" className="flex items-center gap-3 px-4 py-3.5 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all">
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-10 space-y-10 overflow-y-auto">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">Welcome back, {profile?.full_name?.split(' ')[0]}!</h1>
                        <p className="text-gray-500 font-medium">Your health journey is looking great this month.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-3xl shadow-sm border border-gray-100">
                        <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-gray-900 leading-none">{profile?.full_name}</p>
                            <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">Patient Profile</p>
                        </div>
                    </div>
                </header>

                {/* Bento Grid: Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 group hover:shadow-xl hover:-translate-y-1 transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                    <stat.icon className="w-7 h-7" />
                                </div>
                                <span className="text-gray-400 font-bold hover:text-indigo-600 cursor-pointer">...</span>
                            </div>
                            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
                            <p className="text-sm text-gray-500 mt-4 font-medium flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                {stat.sub}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Main Section: Health Timeline & Quick Actions */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                    {/* Health Timeline */}
                    <div className="xl:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-2xl font-black text-gray-900">Health Timeline</h2>
                            <button className="text-indigo-600 font-bold hover:underline">View All</button>
                        </div>

                        <div className="space-y-8">
                            {timeline.map((item, i) => (
                                <div key={i} className="flex gap-6 relative group">
                                    {i !== timeline.length - 1 && (
                                        <div className="absolute left-7 top-14 w-0.5 h-10 bg-gray-100" />
                                    )}
                                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 border-b border-gray-100 pb-8 group-last:border-none">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-black text-gray-900 text-lg">{item.type}</h4>
                                            <span className="text-sm font-bold text-gray-400 tracking-tight">{item.date}</span>
                                        </div>
                                        <p className="text-gray-500 font-medium">Handled by <span className="text-indigo-600">{item.doctor}</span></p>
                                        <div className="mt-3 inline-flex items-center px-3 py-1 rounded-lg bg-green-50 text-green-600 text-xs font-black uppercase tracking-widest">
                                            {item.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Side Column: AI Insights & Quick Actions */}
                    <div className="space-y-8">
                        <div className="bg-indigo-600 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200 overflow-hidden relative group">
                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                            <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
                                <Bot className="w-6 h-6" />
                                AI Analysis
                            </h3>
                            <p className="text-indigo-100 font-medium leading-relaxed mb-8">
                                Unsure about your symptoms? Use our AI intelligence to identify potential issues.
                            </p>
                            <Link
                                href="/dashboard/patient/symptoms"
                                className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                            >
                                Try Symptom Checker
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-black text-gray-900">AI Health Insights</h3>
                                <div className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-md">Live</div>
                            </div>
                            <div className="space-y-4">
                                {aiTips.map((tip: string, i: number) => (
                                    <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-indigo-100 transition-all">
                                        <div className="w-2 h-2 bg-indigo-600 rounded-full mt-1.5 flex-shrink-0" />
                                        <p className="text-sm font-medium text-gray-700 leading-relaxed">{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
