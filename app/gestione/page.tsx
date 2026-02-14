'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function GestioneCompleta() {
  const [dipendenti, setDipendenti] = useState<any[]>([])
  const [cantieri, setCantieri] = useState<any[]>([])
  const [nuovoCantiere, setNuovoCantiere] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { caricaDati() }, [])

  const caricaDati = async () => {
    try {
      setLoading(false)
      const { data: d } = await supabase.from('dipendenti').select('*').order('nome_dipendente')
      const { data: c } = await supabase.from('cantieri').select('*').order('nome_cantiere')
      if (d) setDipendenti(d)
      if (c) setCantieri(c)
    } finally {
      setLoading(false)
    }
  }

  const aggiungiCantiere = async () => {
    if (!nuovoCantiere) return
    const { error } = await supabase.from('cantieri').insert([{ nome_cantiere: nuovoCantiere.toUpperCase() }])
    if (error) alert(error.message)
    else {
      setNuovoCantiere('')
      caricaDati()
    }
  }

  const eliminaCantiere = async (id: number) => {
    if (!confirm("Eliminare questo cantiere?")) return
    await supabase.from('cantieri').delete().eq('id', id)
    caricaDati()
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 p-6 pb-32">
      <div className="max-w-6xl mx-auto">
        
        {/* SEZIONE DIPENDENTI */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-slate-900 italic mb-2">Gestione Personale</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dipendenti.map((d) => (
              <div key={d.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
                <h2 className="font-black text-slate-900 uppercase">{d.nome_dipendente}</h2>
                <p className="text-blue-600 text-sm font-bold">{d.telefono || 'Nessun telefono'}</p>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-slate-200 mb-12" />

        {/* SEZIONE CANTIERI (RIPRISTINATA) */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 italic mb-2">Anagrafica Cantieri</h2>
          <p className="text-slate-500 mb-6">Aggiungi o rimuovi i cantieri disponibili nel sistema</p>
          
          <div className="flex gap-2 mb-8">
            <input 
              type="text" 
              placeholder="Nome nuovo cantiere..." 
              value={nuovoCantiere}
              onChange={(e) => setNuovoCantiere(e.target.value)}
              className="flex-1 bg-white p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 font-bold uppercase"
            />
            <button 
              onClick={aggiungiCantiere}
              className="bg-blue-600 text-white px-8 rounded-2xl font-black uppercase text-xs shadow-lg shadow-blue-100"
            >
              Aggiungi
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cantieri.map((c) => (
              <div key={c.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex justify-between items-center group">
                <span className="font-bold text-slate-700 uppercase text-sm">{c.nome_cantiere}</span>
                <button 
                  onClick={() => eliminaCantiere(c.id)}
                  className="text-slate-300 hover:text-red-500 transition-colors"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* NAV BAR */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-white/90 backdrop-blur-xl border border-slate-200 p-3 rounded-3xl flex justify-around items-center z-50 shadow-2xl">
        <Link href="/" className="text-slate-400 font-bold text-[10px] uppercase">Riepilogo</Link>
        <Link href="/calendario" className="text-slate-400 font-bold text-[10px] uppercase">Calendario</Link>
        <Link href="/nuovo-inserimento" className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase">+ Aggiungi</Link>
        <Link href="/gestione" className="text-blue-600 font-extrabold text-[10px] uppercase">Gestione</Link>
      </nav>
    </main>
  )
}