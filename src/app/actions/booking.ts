'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

interface BookingData {
  doctorId: string
  date: string
  timeSlot: string
  type: 'in_person' | 'video'
}

export async function bookAppointment(data: BookingData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'User not authenticated' }
  }

  const { error } = await supabase
    .from('appointments')
    .insert({
      patient_id: user.id,
      doctor_id: data.doctorId,
      date: data.date,
      time_slot: data.timeSlot,
      status: 'confirmed',
      type: data.type
    })

  if (error) {
    console.error('Booking error:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
