'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitConsultation(formData: FormData) {
  const supabase = await createClient()

  const appointmentId = formData.get('appointmentId') as string
  const patientId = formData.get('patientId') as string
  const doctorId = formData.get('doctorId') as string
  const prescription = formData.get('prescription') as string
  const notes = formData.get('notes') as string
  const reportFile = formData.get('report') as File | null

  try {
    let reportUrl = null

    if (reportFile) {
      const fileName = `${Date.now()}-${reportFile.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('lab-reports')
        .upload(fileName, reportFile)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('lab-reports')
        .getPublicUrl(fileName)

      reportUrl = publicUrl
    }

    const { error: recordError } = await supabase
      .from('records')
      .insert({
        patient_id: patientId,
        doctor_id: doctorId,
        diagnosis: notes,
        prescription: JSON.parse(prescription),
        report_url: reportUrl
      })

    if (recordError) throw recordError

    const { error: appointmentError } = await supabase
      .from('appointments')
      .update({ status: 'done' })
      .eq('id', appointmentId)

    if (appointmentError) throw appointmentError

    return { success: true }
  } catch (error) {
    console.error('Consultation Submission Error:', error)
    return { success: false, error: 'Internal Server Error' }
  }
}
