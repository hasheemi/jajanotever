import Link from 'next/link'
import { ShoppingBag, TrendingUp, Users, CheckCircle } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-orange-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <Link className="flex items-center justify-center" href="/">
          <ShoppingBag className="h-6 w-6 text-orange-600" />
          <span className="ml-2 text-2xl font-bold tracking-tight text-orange-600">Jaja<span>Note</span></span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-orange-600 transition-colors" href="/login">
            Login
          </Link>
          <Link className="text-sm font-medium bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors shadow-sm" href="/login">
            Get Started
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Section 1: Hero */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-orange-50/50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Track Your <span className="text-orange-600">Jajan</span> <br />
                  from Maker to Seller
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl lg:text-2xl mt-4">
                  The ultimate web tool for Indonesian snack ecosystems. Manage production, inventory, and sales effortlessly.
                </p>
              </div>
              <div className="space-x-4 pt-4">
                <Link href="/login" className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-orange-700 transition-all hover:scale-105 active:scale-95">
                  Start Tracking for Free
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: How It Works */}
        <section className="w-full py-20 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12">How JajaNote Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-orange-50 hover:shadow-xl hover:shadow-orange-100/50 transition-all">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Track Production</h3>
                <p className="text-gray-600">Makers can log daily production batches and costs in real-time.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-orange-50 hover:shadow-xl hover:shadow-orange-100/50 transition-all">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Connect with Sellers</h3>
                <p className="text-gray-600">Distribute your jajan to various outlets and monitor stock levels remotely.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-orange-50 hover:shadow-xl hover:shadow-orange-100/50 transition-all">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Analyze Sales</h3>
                <p className="text-gray-600">Get insights on top-performing products and sales trends instantly.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Features */}
        <section className="w-full py-20 bg-orange-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-6 leading-tight">Built for the <br />Future of Warung</h2>
                <p className="text-orange-50 text-lg mb-8 max-w-[600px]">
                  JajaNote bridge the gap between snacks makers and neighborhood sellers using simple, intuitive digital logging.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-orange-200" />
                    <span>Inventory tracking for 50+ snack types</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-orange-200" />
                    <span>QR Code supported distribution</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-orange-200" />
                    <span>Simple daily bookkeeping</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 aspect-video flex items-center justify-center border border-white/30 shadow-2xl">
                <ShoppingBag className="h-32 w-32 text-white/50 animate-pulse" />
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Call to Action */}
        <section className="w-full py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 tracking-tight">Ready to grow your Jajan business?</h2>
            <p className="text-xl text-gray-500 mb-10 max-w-[600px] mx-auto">
              Join hundreds of makers and sellers already using JajaNote to streamline their operations.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link href="/login" className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-orange-600 px-10 py-5 text-xl font-bold text-white shadow-xl hover:bg-orange-700 transition-all hover:scale-105 active:scale-95">
                Join JajaNote Now
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-8 border-t border-orange-100 px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-500">© 2026 JajaNote. All rights reserved.</p>
        <nav className="flex gap-6">
          <Link className="text-sm text-gray-500 hover:text-orange-600" href="#">Privacy Policy</Link>
          <Link className="text-sm text-gray-500 hover:text-orange-600" href="#">Terms of Service</Link>
        </nav>
      </footer>
    </div>
  )
}
