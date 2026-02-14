'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function GestioneDipendenti() {
  const [dipendenti, setDipendenti] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { caricaDipendenti() }, [])

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
      console.error("Errore:", error)
    } finally {
      setLoading(false)
    }
  }

  // FUNZIONE PER SALVARE OGNI MODIFICA IN TEMPO REALE
  const aggiornaCampo = async (id: number, campo: string, valore: string) => {
    const { error } = await supabase
      .from('dipendenti')
      .update({ [campo]: valore })
      .eq('id', id)
    
    if (error) {
      alert("Errore nel salvataggio: " + error.message)
    } else {
      setDipendenti(prev => prev.map(d => d.id === id ? { ...d, [campo]: valore } : d))
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 p-6 pb-32">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 italic">Gestione Personale</h1>
          <p className="text-slate-500 font-medium tracking-tight">Modifica anagrafica e documenti</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs">Caricamento...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dipendenti.map((d) => (
              <div key={d.id} className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h2 className="text-xl font-black text-slate-900 uppercase mb-2">{d.nome_dipendente}</h2>
                    <input 
                      type="text" 
                      placeholder="Telefono..."
                      value={d.telefono || ''} 
                      onChange={(e) => aggiornaCampo(d.id, 'telefono', e.target.value)}
                      className="text-blue-600 font-bold text-sm bg-blue-50/50 px-3 py-1 rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-slate-400">ID: {d.id}</div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest border-b pb-1">Documenti (Scadenze)</p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Carta Identità', key: 'scadenza_ci' },
                      { label: 'Permesso Sogg.', key: 'scadenza_permesso' },
                      { label: 'Contratto', key: 'scadenza_contratto' },
                      { label: 'Visita Medica', key: 'scadenza_visita' }
                    ].map((doc) => (
                      <div key={doc.key} className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">{doc.label}</span>
                        <input 
                          type="date" 
                          value={d[doc.key] || ''} 
                          onChange={(e) => aggiornaCampo(d.id, doc.key, e.target.value)}
                          className="text-xs font-semibold text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100 outline-none focus:border-blue-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-white/90 backdrop-blur-xl border border-slate-200 p-3 rounded-3xl flex justify-around items-center z-50 shadow-2xl">
        <Link href="/" className="text-slate-400 font-bold text-[10px] uppercase">Riepilogo</Link>
        <Link href="/calendario" className="text-slate-400 font-bold text-[10px] uppercase">Calendario</Link>
        <Link href="/nuovo-inserimento" className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase">+ Aggiungi</Link>
        <Link href="/gestione" className="text-blue-600 font-extrabold text-[10px] uppercase">Gestione</Link>
      </nav>
    </main>
  )
}