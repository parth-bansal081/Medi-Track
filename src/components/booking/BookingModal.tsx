'use client'

import { useState } from 'react'
import { 
    X, 
    Calendar as CalendarIcon, 
    Clock, 
    Video, 
    User as UserIcon, 
    CreditCard, 
    CheckCircle2, 
    ArrowRight,
    Loader2
} from 'lucide-react'
import { bookAppointment } from '@/app/actions/booking'

interface Doctor {
  id: string
  name: string
  specialty: string
  fee: number
}

type Step = 'selection' | 'type' | 'payment' | 'success'

export default function BookingModal({ doctor, onClose }: { doctor: Doctor, onClose: () => void }) {
  const [step, setStep] = useState<Step>('selection')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [type, setType] = useState<'in_person' | 'video'>('video')
  const [loading, setLoading] = useState(false)

  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']

  const handleBooking = async () => {
    setLoading(true)
    // Simulate payment delay
    await new Promise(r => setTimeout(r, 1500))
    
    const result = await bookAppointment({
        doctorId: doctor.id,
        date,
        timeSlot: time,
        type
    })

    if (result.success) {
        setStep('success')
    } else {
        alert('Booking failed. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                    {step === 'success' ? 'Booking Confirmed!' : 'Book Appointment'}
                </h2>
                <p className="text-gray-400 font-medium">With {doctor.name}</p>
            </div>
            {step !== 'success' && (
                <button 
                    onClick={onClose}
                    className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-gray-900 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            )}
        </div>

        {/* Content */}
        <div className="p-10">
            {step === 'selection' && (
                <div className="space-y-8 animate-in slide-in-from-right duration-300">
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                             <CalendarIcon className="w-4 h-4" /> Select Date
                        </label>
                        <input 
                            type="date" 
                            className="w-full p-5 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-600/10 font-bold text-gray-900 text-lg"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                             <Clock className="w-4 h-4" /> Available Slots
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {timeSlots.map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTime(t)}
                                    className={`py-4 rounded-2xl font-bold text-sm transition-all ${
                                        time === t 
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button 
                        disabled={!date || !time}
                        onClick={() => setStep('type')}
                        className="w-full py-5 bg-indigo-600 text-white rounded-[1.75rem] font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        Next Step
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            )}

            {step === 'type' && (
                <div className="space-y-8 animate-in slide-in-from-right duration-300">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                         Consultation Type
                    </label>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setType('video')}
                            className={`p-10 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 ${
                                type === 'video' 
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-600' 
                                : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'
                            }`}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${type === 'video' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-400'}`}>
                                <Video className="w-6 h-6" />
                            </div>
                            <span className="font-black text-lg">Video Call</span>
                        </button>

                        <button
                            onClick={() => setType('in_person')}
                            className={`p-10 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 ${
                                type === 'in_person' 
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-600' 
                                : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'
                            }`}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${type === 'in_person' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-400'}`}>
                                <UserIcon className="w-6 h-6" />
                            </div>
                            <span className="font-black text-lg">In Person</span>
                        </button>
                    </div>

                    <button 
                        onClick={() => setStep('payment')}
                        className="w-full py-5 bg-indigo-600 text-white rounded-[1.75rem] font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
                    >
                        Proceed to Payment
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            )}

            {step === 'payment' && (
                <div className="space-y-8 animate-in slide-in-from-right duration-300">
                    <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Consultation Fee</span>
                            <span className="text-3xl font-black text-gray-900">${doctor.fee}</span>
                        </div>
                        <div className="space-y-3 pt-6 border-t border-gray-200">
                            <div className="flex justify-between text-sm font-bold">
                                <span className="text-gray-400">Date & Time</span>
                                <span className="text-gray-900">{date} at {time}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold">
                                <span className="text-gray-400">Visit Type</span>
                                <span className="text-gray-900 capitalize">{type.replace('_', ' ')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-bold text-amber-700">Sandbox Mode: Payment is simulated for this demo.</p>
                    </div>

                    <button 
                        onClick={handleBooking}
                        disabled={loading}
                        className="w-full py-5 bg-slate-900 text-white rounded-[1.75rem] font-black text-lg shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Confirm & Pay'}
                        {!loading && <CheckCircle2 className="w-5 h-5" />}
                    </button>
                </div>
            )}

            {step === 'success' && (
                <div className="text-center py-10 space-y-10 animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-100 animate-bounce">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-gray-900 mb-2">Great news!</h3>
                        <p className="text-gray-500 font-medium">Your appointment is confirmed. A receipt and calendar invite have been sent to your email.</p>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 flex items-center justify-between text-left">
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Booking ID</p>
                            <p className="font-bold text-gray-900">#MT-{Math.floor(Math.random() * 90000 + 10000)}</p>
                        </div>
                        <button className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-black text-xs uppercase hover:bg-gray-100 transition-colors">
                            Download PDF
                        </button>
                    </div>

                    <button 
                        onClick={onClose}
                        className="w-full py-5 bg-indigo-600 text-white rounded-[1.75rem] font-black text-lg shadow-xl hover:bg-indigo-700 transition-all"
                    >
                        Return to Personal Dashboard
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  )
}
