import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { 
  ShieldCheck, 
  Users, 
  UserPlus, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Activity, 
  Settings, 
  LogOut,
  ChevronRight,
  UserCheck
} from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin-portal/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/login')
  }

  const pendingDoctors = [
    { name: 'Dr. Emily Watson', specialty: 'Neurology', applied: '2h ago', id: '1' },
    { name: 'Dr. Raj Patel', specialty: 'Pediatrics', applied: '5h ago', id: '2' },
    { name: 'Dr. Sophia Loren', specialty: 'Dermatology', applied: '1d ago', id: '3' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar navigation */}
      <aside className="w-full lg:w-72 bg-white border-r border-gray-100 flex flex-col p-8 space-y-10">
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
                <span className="font-black text-xl text-gray-900 leading-none block">RootAdmin</span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">v1.2.4</span>
            </div>
        </div>

        <nav className="flex-1 space-y-2">
            {[
                { label: 'System Health', icon: ShieldCheck, active: true },
                { label: 'Doctor Approvals', icon: UserCheck },
                { label: 'User Directory', icon: Users },
                { label: 'Analytics', icon: Activity },
                { label: 'Settings', icon: Settings },
            ].map((item, i) => (
                <button 
                    key={i}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] font-bold text-sm transition-all group ${
                        item.active 
                        ? 'bg-slate-900 text-white shadow-2xl shadow-slate-200' 
                        : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                </button>
            ))}
        </nav>

        <div className="pt-8 border-t border-gray-100">
            <Link href="/admin-portal/login" className="flex items-center gap-4 px-5 py-4 text-red-500 font-bold text-sm hover:bg-red-50 rounded-[1.25rem] transition-all">
                <LogOut className="w-5 h-5" />
                Logout
            </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-12 space-y-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">System Statistics</h1>
                <p className="text-gray-500 font-medium mt-1">Administrator: {profile?.full_name}</p>
            </div>
            <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-gray-100 divide-x divide-gray-100">
                <div className="px-6 py-2 text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Server Status</p>
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm font-bold text-gray-900">Optimal</span>
                    </div>
                </div>
                <div className="px-6 py-2 text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Network</p>
                    <span className="text-sm font-bold text-gray-900">42 ms</span>
                </div>
            </div>
        </header>

        {/* Large Bento Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                { label: 'Total Active Doctors', value: '452', icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'Total Patients', value: '12,840', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Daily Revenue', value: '$24,402', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            ].map((stat, i) => (
                <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:shadow-2xl transition-all">
                    <div className="flex justify-between items-start mb-8">
                        <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-8 h-8" />
                        </div>
                        <ChevronRight className="w-6 h-6 text-gray-200 group-hover:text-gray-900 transition-colors" />
                    </div>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">{stat.label}</p>
                    <h3 className="text-4xl font-black text-gray-900">{stat.value}</h3>
                    <div className="mt-6 flex items-center gap-2 text-xs font-black text-green-600 uppercase tracking-widest">
                        <span className="bg-green-100 px-2 py-1 rounded-md">↑ 12.5%</span>
                        <span className="text-gray-400 font-bold">vs last week</span>
                    </div>
                </div>
            ))}
        </div>

        {/* Approval List Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            {/* Pending Doctor Registrations */}
            <div className="xl:col-span-2 bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">Registration Requests</h2>
                        <p className="text-gray-400 font-medium">Manage pending doctor applications</p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search applications..." 
                            className="pl-12 pr-6 py-4 bg-gray-50 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600/10 transition-all border-none"
                        />
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    {pendingDoctors.map((doc, i) => (
                        <div key={i} className="flex flex-col md:flex-row items-center justify-between p-6 bg-gray-50/50 rounded-[2rem] border border-gray-50 group hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all">
                            <div className="flex items-center gap-6 mb-4 md:mb-0">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-300 font-black text-xl shadow-sm">
                                    {doc.name.charAt(4)}
                                </div>
                                <div>
                                    <h4 className="font-black text-gray-900 text-lg">{doc.name}</h4>
                                    <p className="text-indigo-600 font-bold text-sm">{doc.specialty}</p>
                                    <p className="text-gray-400 text-xs font-bold mt-1 uppercase tracking-widest">Applied {doc.applied}</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-3">
                                <button className="px-6 py-4 bg-white text-gray-400 rounded-2xl font-bold text-sm shadow-sm border border-gray-100 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all flex items-center gap-2">
                                    <XCircle className="w-5 h-5" />
                                    Reject
                                </button>
                                <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5" />
                                    Approve Access
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="p-8 text-center bg-gray-50/20">
                    <button className="text-gray-400 font-black text-xs uppercase tracking-[0.2em] hover:text-gray-900 transition-colors">
                        View All Applications (144)
                    </button>
                </div>
            </div>

            {/* System Logs / Small Stat Column */}
            <div className="space-y-8">
                <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl shadow-slate-200">
                    <h3 className="text-xl font-black mb-6">Storage Usage</h3>
                    <div className="flex items-end gap-2 mb-4">
                        <span className="text-4xl font-black">2.4</span>
                        <span className="text-slate-500 font-bold pb-1 uppercase tracking-widest text-xs">TB / 10 TB</span>
                    </div>
                    <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden mb-8">
                        <div className="h-full w-1/4 bg-indigo-500 rounded-full" />
                    </div>
                    <button className="w-full py-4 bg-white/10 text-white rounded-[1.5rem] font-bold text-sm hover:bg-white/20 transition-all">
                        Server Management
                    </button>
                </div>

                <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 border-dashed border-2 flex flex-col items-center justify-center text-center py-16">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-6">
                        <UserPlus className="w-10 h-10" />
                    </div>
                    <h4 className="font-black text-gray-900 text-xl mb-2">New Admin?</h4>
                    <p className="text-gray-400 font-medium text-sm leading-relaxed mb-8">
                        Role delegation allows you to invite other health systems staff.
                    </p>
                    <button className="px-8 py-4 border-2 border-gray-100 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all">
                        Invite Admin
                    </button>
                </div>
            </div>
        </div>
      </main>
    </div>
  )
}
