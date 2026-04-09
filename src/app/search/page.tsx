import { createClient } from '@/utils/supabase/server'
import Navbar from '@/components/layout/Navbar'
import SearchInterface from '@/components/booking/SearchInterface'

export default async function SearchPage() {
  const supabase = await createClient()

  // Fetch doctors with their profile information
  const { data: doctorsData, error } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      doctors (
        specialty,
        bio,
        consultation_fee,
        is_approved
      )
    `)
    .eq('role', 'doctor')

  // Transform data for the UI
  const doctors = doctorsData?.map(d => ({
    id: d.id,
    name: d.full_name,
    specialty: d.doctors?.[0]?.specialty || 'General Practitioner',
    fee: d.doctors?.[0]?.consultation_fee || 100,
    isApproved: d.doctors?.[0]?.is_approved || false,
    rating: (Math.random() * (5 - 4) + 4).toFixed(1), // Mock rating 4.0 - 5.0
    reviews: Math.floor(Math.random() * 200) + 20,
  })) || []

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      <div className="pt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Find your specialist</h1>
            <p className="text-gray-500 font-medium mt-2">Book an appointment with top-rated healthcare providers.</p>
        </header>
        
        <SearchInterface initialDoctors={doctors} />
      </div>
    </main>
  )
}
