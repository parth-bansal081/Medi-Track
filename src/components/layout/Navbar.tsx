'use client'

import Link from 'next/link'
import { PlusSquare } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <PlusSquare className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900 tracking-tight">PharmaTech</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-indigo-600 transition-colors">Features</Link>
            <Link href="#services" className="text-gray-600 hover:text-indigo-600 transition-colors">Services</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="px-4 py-2 text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition-all"
            >
              Login
            </Link>
            <Link 
              href="/signup" 
              className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
