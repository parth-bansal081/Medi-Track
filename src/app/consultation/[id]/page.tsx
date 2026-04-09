import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import JitsiMeeting from '@/components/consultation/JitsiMeeting'
import PrescriptionPanel from '@/components/consultation/PrescriptionPanel'
import { ArrowLeft, User, ShieldAlert } from 'lucide-react'
import Link from 'next/link'

export default async function ConsultationPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch appointment details
  const { data: appointment, error } = await supabase
    .from('appointments')
    .select(`
      *,
      patient:profiles!patient_id(full_name),
      doctor:profiles!doctor_id(full_name)
    `)
    .eq('id', params.id)
    .single()

  if (error || !appointment) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50 text-center">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
                <ShieldAlert className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Session Not Found</h2>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">This consultation link is invalid or has expired.</p>
            <Link href="/dashboard" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg">Return to Dashboard</Link>
        </div>
    )
  }

  const isDoctor = user.id === appointment.doctor_id
  const isPatient = user.id === appointment.patient_id

  if (!isDoctor && !isPatient) {
    redirect('/unauthorized')
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <div className={`flex-1 flex flex-col ${isDoctor ? 'lg:w-[60%]' : 'w-full'} p-6 lg:p-10 space-y-8`}>
        {/* Navigation / Header */}
        <header className="flex justify-between items-center bg-white/50 backdrop-blur-md p-4 rounded-3xl border border-gray-100">
           <Link 
            href={isDoctor ? '/dashboard/doctor' : '/dashboard/patient'} 
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-all"
           >
              <ArrowLeft className="w-4 h-4" />
              Exit Session
           </Link>
           <div className="flex items-center gap-3">
              <div className="px-4 py-1.5 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-lg animate-pulse">
                Live Consultation
              </div>
           </div>
           <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-400">Connected as</span>
              <span className="text-xs font-black text-gray-900">{isDoctor ? 'Dr. ' + appointment.doctor.full_name : appointment.patient.full_name}</span>
           </div>
        </header>

        {/* Video Area */}
        <div className="flex-1 min-h-0 relative">
            <JitsiMeeting 
                roomName={appointment.id} 
                displayName={isDoctor ? 'Dr. ' + appointment.doctor.full_name : appointment.patient.full_name}
                onHangUp={() => {}} // Redirection handled by UI
            />
        </div>
      </div>

      {/* Doctor's Prescription Panel */}
      {isDoctor && (
        <aside className="hidden lg:block w-[40%] bg-white shadow-2xl">
            <PrescriptionPanel 
                appointmentId={appointment.id}
                patientId={appointment.patient_id}
                doctorId={appointment.doctor_id}
            />
        </aside>
      )}
    </div>
  )
}
