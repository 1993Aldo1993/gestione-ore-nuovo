'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function GestioneDipendenti() {
  const [dipendenti, setDipendenti] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    caricaDipendenti()
  }, [])

  const caricaDipendenti = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('dipendenti')
        .select('*')
        .order('nome_dipendente', { ascending: true })
      
      if (error) throw error
      setDipendenti(data || [])
    } catch (error) {
      console.error("Errore caricamento dipendenti:", error)
    } finally {
      setLoading(false)
    }
  }

  const formattaData = (data: string) => {
    if (!data) return '---'
    return new Date(data).toLocaleDateString('it-IT')
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 p-6 pb-32">
      <div className="max-w-6xl mx-auto">
        
        {/* Intestazione */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 italic">Gestione Personale</h1>
          <p className="text-slate-500 font-medium tracking-tight">Anagrafica e scadenze documenti</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 animate-pulse font-bold uppercase tracking-widest text-xs">
            Caricamento database...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dipendenti.map((d) => (
              <div key={d.id} className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-200 hover:border-blue-200 transition-colors">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{d.nome_dipendente}</h2>
                    <p className="text-blue-600 font-bold text-sm">{d.telefono || 'Nessun numero salvato'}</p>
                  </div>
                  <div className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    ID: {d.id}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest border-b border-slate-50 pb-1">Scadenze Documenti</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Carta Identità</span>
                      <span className="text-sm font-semibold text-slate-700">{formattaData(d.scadenza_ci)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Permesso Sogg.</span>
                      <span className="text-sm font-semibold text-slate-700">{formattaData(d.scadenza_permesso)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Contratto</span>
                      <span className="text-sm font-semibold text-slate-700">{formattaData(d.scadenza_contratto)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Visita Medica</span>
                      <span className="text-sm font-semibold text-slate-700">{formattaData(d.scadenza_visita)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {dipendenti.length === 0 && !loading && (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Nessun dipendente trovato nel database</p>
          </div>
        )}
      </div>

      {/* Navigazione Bottom */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-white/90 backdrop-blur-xl border border-slate-200 p-3 rounded-3xl flex justify-around items-center z-50 shadow-2xl shadow-slate-300/50">
        <Link href="/" className="text-slate-400 font-bold text-[10px] uppercase tracking-tighter">Riepilogo</Link>
        <Link href="/calendario" className="text-slate-400 font-bold text-[10px] uppercase tracking-tighter">Calendario</Link>
        <Link href="/nuovo-inserimento" className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-transform">+ Aggiungi</Link>
        <Link href="/gestione" className="text-blue-600 font-extrabold text-[10px] uppercase tracking-tighter">Gestione</Link>
      </nav>
    </main>
  )
}