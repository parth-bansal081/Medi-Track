'use client'

import { useState } from 'react'
import {
  Pill,
  FileText,
  Upload,
  CheckCircle2,
  Loader2,
  Plus,
  X,
  ClipboardList,
  ArrowRight
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { submitConsultation } from '@/app/actions/consultation'

interface PrescriptionItem {
  medicine: string
  dosage: string
  duration: string
}

export default function PrescriptionPanel({ appointmentId, patientId, doctorId }: {
  appointmentId: string,
  patientId: string,
  doctorId: string
}) {
  const [items, setItems] = useState<PrescriptionItem[]>([{ medicine: '', dosage: '', duration: '' }])
  const [notes, setNotes] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const addItem = () => setItems([...items, { medicine: '', dosage: '', duration: '' }])
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index))

  const updateItem = (index: number, field: keyof PrescriptionItem, value: string) => {
    const newItems = [...items]
    newItems[index][field] = value
    setItems(newItems)
  }

  const handleFinish = async () => {
    setLoading(true)

    // In a real app, we'd upload the file to Supabase Storage here
    // For this demo, we'll simulate the upload process
    const formData = new FormData()
    formData.append('appointmentId', appointmentId)
    formData.append('patientId', patientId)
    formData.append('doctorId', doctorId)
    formData.append('prescription', JSON.stringify(items))
    formData.append('notes', notes)
    if (file) formData.append('report', file)

    const result = await submitConsultation(formData)

    if (result.success) {
      setSuccess(true)
      setTimeout(() => router.push('/dashboard/doctor'), 2000)
    } else {
      alert('Error submitting consultation. Please try again.')
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-white text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-100 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">Consultation Completed</h3>
        <p className="text-gray-500 font-medium italic">The record has been saved and the patient has been notified.</p>
      </div>
    )
  }

  return (
    <div className="h-full bg-white border-l border-gray-100 flex flex-col">
      <div className="p-8 border-b border-gray-50 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black">
          <ClipboardList className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-900 leading-none">Consultation Panel</h2>
          <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Digital Prescription</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-10">
        {/* Prescription List */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <Pill className="w-4 h-4" /> Medicines
            </label>
            <button
              onClick={addItem}
              className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 relative group">
                {items.length > 1 && (
                  <button
                    onClick={() => removeItem(i)}
                    className="absolute -right-2 -top-2 w-6 h-6 bg-white rounded-full shadow-sm border border-gray-100 text-gray-400 hover:text-red-500 items-center justify-center hidden group-hover:flex"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <div className="space-y-3">
                  <input
                    placeholder="Medicine Name (e.g. Amoxicillin)"
                    className="w-full bg-transparent border-none p-0 focus:ring-0 font-bold text-gray-900 placeholder:text-gray-300"
                    value={item.medicine}
                    onChange={(e) => updateItem(i, 'medicine', e.target.value)}
                  />
                  <div className="flex gap-4">
                    <input
                      placeholder="Dosage"
                      className="w-1/2 bg-transparent border-none p-0 focus:ring-0 text-sm font-medium text-gray-600"
                      value={item.dosage}
                      onChange={(e) => updateItem(i, 'dosage', e.target.value)}
                    />
                    <input
                      placeholder="Duration"
                      className="w-1/2 bg-transparent border-none p-0 focus:ring-0 text-sm font-medium text-indigo-600"
                      value={item.duration}
                      onChange={(e) => updateItem(i, 'duration', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-4">
          <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Clinical Notes
          </label>
          <textarea
            placeholder="Enter diagnosis and additional remarks..."
            className="w-full h-32 bg-gray-50 p-6 rounded-[2rem] border-none focus:ring-2 focus:ring-indigo-600/10 font-medium text-gray-700 placeholder:text-gray-300 resize-none"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Lab Report Upload */}
        <div className="space-y-4">
          <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <Upload className="w-4 h-4" /> Lab Report (Optional)
          </label>
          <div className="relative">
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <div className={`p-8 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all ${file ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-100 bg-gray-50 text-gray-400'
              }`}>
              {file ? (
                <>
                  <CheckCircle2 className="w-8 h-8 mb-2" />
                  <span className="font-bold text-sm truncate max-w-[200px]">{file.name}</span>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 mb-2 opacity-50" />
                  <span className="font-bold text-xs uppercase tracking-widest">Attach PDF/Image</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 border-t border-gray-50">
        <button
          onClick={handleFinish}
          disabled={loading || !items[0].medicine || !notes}
          className="w-full py-5 bg-indigo-600 text-white rounded-[1.75rem] font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Finish & Submit'}
          {!loading && <ArrowRight className="w-5 h-5" />}
        </button>
      </div>
    </div>
  )
}
