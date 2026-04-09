import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { 
  Users, 
  Calendar, 
  Clock, 
  ClipboardList, 
  Play, 
  Video, 
  User, 
  LayoutDashboard, 
  Settings, 
  LogOut,
  ChevronRight,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'

export default async function DoctorDashboard() {
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

  const queue = [
    { name: 'Alex Thompson', time: '09:00 AM', type: 'Video', status: 'Next' },
    { name: 'Maria Garcia', time: '09:45 AM', type: 'In-person', status: 'Waiting' },
    { name: 'Robert Chen', time: '10:30 AM', type: 'Video', status: 'Waiting' },
    { name: 'Sarah Miller', time: '11:15 AM', type: 'In-person', status: 'Waiting' },
  ]

  const weeklySchedule = [
    { day: 'Mon', active: true, slots: 8 },
    { day: 'Tue', active: true, slots: 10 },
    { day: 'Wed', active: false, slots: 0 },
    { day: 'Thu', active: true, slots: 6 },
    { day: 'Fri', active: true, slots: 9 },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar navigation */}
      <aside className="w-full lg:w-72 bg-slate-900 text-white flex flex-col p-6 space-y-8">
        <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6" />
            </div>
            <span className="font-black text-xl tracking-tight">DocPortal</span>
        </div>

        <nav className="flex-1 space-y-1">
            {[
                { label: 'Overview', icon: LayoutDashboard, active: true },
                { label: 'Patient Queue', icon: Users },
                { label: 'Schedule', icon: Calendar },
                { label: 'Settings', icon: Settings },
            ].map((item, i) => (
                <button 
                    key={i}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold transition-all group ${
                        item.active 
                        ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                </button>
            ))}
        </nav>

        <div className="pt-6 border-t border-slate-800">
            <Link href="/api/auth/signout" className="flex items-center gap-3 px-4 py-3.5 text-slate-400 font-bold hover:text-white rounded-2xl transition-all">
                <LogOut className="w-5 h-5" />
                Logout
            </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10 space-y-10 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h1 className="text-3xl font-black text-gray-900">Dr. {profile?.full_name?.split(' ').pop()}</h1>
                <p className="text-gray-500 font-medium italic">General Practitioner • Internal Medicine</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex -space-x-3 overflow-hidden">
                    {[1,2,3].map(i => (
                        <div key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                            {i}
                        </div>
                    ))}
                    <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white">
                        +12
                    </div>
                </div>
                <div className="h-10 w-px bg-gray-200 mx-2" />
                <div className="px-4 py-2 bg-green-100 text-green-700 rounded-2xl text-xs font-black uppercase tracking-widest">Online</div>
            </div>
        </header>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
                { label: 'Patients Today', value: '18', icon: Users, sub: '+4 from yesterday', trend: true },
                { label: 'Pending Reports', value: '6', icon: ClipboardList, sub: '3 critical reviews', trend: false },
                { label: 'Next Break', value: '12:30 PM', icon: Clock, sub: 'In 2 hours', trend: true },
            ].map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 group hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            <stat.icon className="w-7 h-7" />
                        </div>
                        <TrendingUp className={`w-5 h-5 ${stat.trend ? 'text-green-500' : 'text-amber-500'}`} />
                    </div>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">{stat.label}</p>
                    <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
                    <p className="text-sm text-gray-400 mt-4 font-bold">{stat.sub}</p>
                </div>
            ))}
        </div>

        {/* Bento Grid: Patient Queue & Weekly Outlook */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
            {/* Today's Patient Queue */}
            <div className="xl:col-span-3 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">Today's Patient Queue</h2>
                        <p className="text-gray-400 font-medium">Real-time status of your consultations</p>
                    </div>
                    <button className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-indigo-600 transition-colors">
                        <Clock className="w-6 h-6" />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-50">
                                <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Patient Name</th>
                                <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Time Slot</th>
                                <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Appt. Type</th>
                                <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-10 py-6"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {queue.map((patient, i) => (
                                <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <span className="font-bold text-gray-900">{patient.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className="font-bold text-gray-400">{patient.time}</span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-2 font-bold text-gray-600">
                                            {patient.type === 'Video' ? <Video className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                            {patient.type}
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                            patient.status === 'Next' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                            {patient.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <button className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                                            <Play className="w-4 h-4 fill-current" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Side Panel: Weekly Availability */}
            <div className="space-y-8">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Weekly Availability</h3>
                        <Calendar className="w-4 h-4 text-gray-400" />
                    </div>
                    
                    <div className="space-y-6">
                        {weeklySchedule.map((day, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${day.active ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                                    <span className="font-bold text-gray-900">{day.day}</span>
                                </div>
                                <div className="text-right">
                                    {day.active ? (
                                        <p className="text-xs font-black text-indigo-600">{day.slots} Slots</p>
                                    ) : (
                                        <p className="text-xs font-bold text-gray-300">Closed</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-10 py-4 border-2 border-indigo-50 text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
                        Edit Schedule
                    </button>
                </div>

                <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 relative group overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                    <h4 className="font-black text-lg mb-2">Patient Feedback</h4>
                    <p className="text-indigo-100 text-xs font-medium leading-relaxed mb-6">"Dr. {profile?.full_name?.split(' ').pop()} was incredibly thorough and empathetic."</p>
                    <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(i => <div key={i} className="w-3 h-3 bg-white rounded-full opacity-40 last:opacity-10" />)}
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  )
}
