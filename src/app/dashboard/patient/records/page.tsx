import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { 
  ClipboardList, 
  User, 
  Calendar, 
  Download, 
  FileText, 
  ArrowLeft,
  Pill,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'

export default async function PatientRecordsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch past medical records
  const { data: records } = await supabase
    .from('records')
    .select(`
      *,
      doctor:profiles!doctor_id(full_name)
    `)
    .eq('patient_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10 space-y-10">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <Link href="/dashboard/patient" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-indigo-600 transition-all mb-4">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Medical History</h1>
                <p className="text-gray-500 font-medium italic mt-1">View your past consultations, prescriptions, and lab reports.</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-sm font-black text-gray-900 leading-none">{records?.length || 0}</p>
                   <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest leading-none">Total Records</p>
                </div>
            </div>
        </header>

        {records && records.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {records.map((record, i) => (
                <div key={i} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all flex flex-col">
                    <div className="p-8 flex-1 space-y-8">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Consultation with</p>
                                    <h3 className="font-black text-gray-900 text-lg leading-none">Dr. {record.doctor.full_name}</h3>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-bold text-gray-400">{new Date(record.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest">
                                <Pill className="w-4 h-4" /> Prescription
                            </div>
                            <div className="space-y-2">
                                {record.prescription.map((item: any, j: number) => (
                                    <div key={j} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                        <span className="text-sm font-bold text-gray-700">{item.medicine}</span>
                                        <span className="text-xs font-bold text-gray-400 italic">{item.dosage} • {item.duration}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-50">
                            <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-2 italic">Doctor's Diagnosis</h4>
                            <p className="text-sm font-medium text-slate-600 leading-relaxed italic line-clamp-3">
                                "{record.diagnosis}"
                            </p>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                        {record.report_url ? (
                            <a 
                                href={record.report_url} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
                            >
                                <Download className="w-4 h-4" />
                                Lab Report
                            </a>
                        ) : (
                            <span className="text-xs font-bold text-gray-300 italic">No lab report attached</span>
                        )}
                        <button className="p-3 text-gray-400 hover:text-indigo-600 transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ))}
          </div>
        ) : (
          <div className="py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-200">
                <ClipboardList className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">No records found</h3>
            <p className="text-gray-500 font-medium">Your medical history will appear here once you complete a consultation.</p>
          </div>
        )}
      </div>
    </div>
  )
}
