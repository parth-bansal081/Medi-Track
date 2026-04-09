'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, Star, Clock, ArrowRight, X } from 'lucide-react'
import BookingModal from './BookingModal'

interface Doctor {
  id: string
  name: string
  specialty: string
  fee: number
  isApproved: boolean
  rating: string
  reviews: number
}

export default function SearchInterface({ initialDoctors }: { initialDoctors: Doctor[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('All')
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)

  const specializations = ['All', ...Array.from(new Set(initialDoctors.map(d => d.specialty)))]

  const filteredDoctors = useMemo(() => {
    return initialDoctors.filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSpecialty = selectedSpecialty === 'All' || doctor.specialty === selectedSpecialty
      return matchesSearch && matchesSpecialty
    })
  }, [searchTerm, selectedSpecialty, initialDoctors])

  return (
    <div className="space-y-8">
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by doctor name..."
            className="w-full pl-12 pr-6 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64 relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <select
            className="w-full pl-12 pr-10 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all font-bold text-gray-600 appearance-none cursor-pointer"
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
          >
            {specializations.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-2xl transition-all flex flex-col">
              <div className="p-8 flex-1">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        {doctor.name.charAt(4) || doctor.name.charAt(0)}
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl text-amber-600 font-black text-xs">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {doctor.rating}
                    </div>
                </div>

                <div className="space-y-1 mb-6">
                    <h3 className="text-xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{doctor.name}</h3>
                    <p className="font-bold text-indigo-600 text-sm tracking-wide">{doctor.specialty}</p>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold text-gray-400 capitalize mb-8">
                    <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${doctor.isApproved ? 'bg-green-500' : 'bg-amber-500'}`} />
                        {doctor.isApproved ? 'Verified Expert' : 'Under Review'}
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Available Tomorrow
                    </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl mb-2">
                    <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-gray-400">
                        <span>Consultation Fee</span>
                        <span className="text-gray-900">${doctor.fee}</span>
                    </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-50">
                <button 
                  onClick={() => setSelectedDoctor(doctor)}
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 group-hover:bg-indigo-600 transition-all shadow-lg hover:-translate-y-1"
                >
                  Book Appointment
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 text-center">
            <h3 className="text-xl font-black text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-500 font-medium tracking-tight">Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedDoctor && (
        <BookingModal 
          doctor={selectedDoctor} 
          onClose={() => setSelectedDoctor(null)} 
        />
      )}
    </div>
  )
}
