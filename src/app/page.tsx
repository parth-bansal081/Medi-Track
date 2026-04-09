import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Clock, Users } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-blue-200/40 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-8">
              Modern Healthcare <br /> 
              <span className="text-primary italic">Reimagined.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-10 leading-relaxed">
              Connect with top-tier specialists, manage your medical records securely, and book appointments in seconds. All in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/signup?role=patient" 
                className="group w-full sm:w-auto px-8 py-4 bg-primary text-white text-lg font-semibold rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-200"
              >
                Book Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/about" 
                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 text-lg font-semibold rounded-2xl border border-slate-200 hover:border-primary hover:text-primary transition-all flex items-center justify-center"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Stats/Features Banner */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: "Secure Records", desc: "End-to-end encrypted medical history management." },
              { icon: Users, title: "Top Specialists", desc: "Access to 500+ verified and approved doctors." },
              { icon: Clock, title: "Instant Booking", desc: "No more waiting rooms. Book on your schedule." }
            ].map((feature, i) => (
              <div key={i} className="bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-blue-50/50 hover:border-blue-200 transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-primary">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Placeholder */}
      <footer className="py-12 border-t border-blue-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          © 2026 PharmaTech. All rights reserved. Professional Healthcare Systems.
        </div>
      </footer>
    </main>
  )
}
