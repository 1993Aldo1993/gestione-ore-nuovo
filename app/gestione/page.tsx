'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function GestioneCompleta() {
  const [dipendenti, setDipendenti] = useState<any[]>([])
  const [cantieri, setCantieri] = useState<any[]>([])
  const [nuovoCantiere, setNuovoCantiere] = useState('')
  const [nuovoDipendente, setNuovoDipendente] = useState({ nome: '', telefono: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => { caricaDati() }, [])

  const caricaDati = async () => {
    try {
      setLoading(true)
      const { data: d } = await supabase.from('dipendenti').select('*').order('nome_dipendente')
      const { data: c } = await supabase.from('cantieri').select('*').order('nome_cantiere')
      if (d) setDipendenti(d)
      if (c) setCantieri(c)
    } finally {
      setLoading(false)
    }
  }

  // --- LOGICA DIPENDENTI ---
  const aggiungiDipendente = async () => {
    if (!nuovoDipendente.nome) return
    const { error } = await supabase.from('dipendenti').insert([{ 
      nome_dipendente: nuovoDipendente.nome.toUpperCase(),
      telefono: nuovoDipendente.telefono 
    }])
    if (error) alert(error.message)
    else {
      setNuovoDipendente({ nome: '', telefono: '' })
      caricaDati()
    }
  }

  const eliminaDipendente = async (id: number) => {
    if (!confirm("Eliminare definitivamente questo dipendente?")) return
    await supabase.from('dipendenti').delete().eq('id', id)
    caricaDati()
  }

  const aggiornaCampo = async (id: number, campo: string, valore: string) => {
    await supabase.from('dipendenti').update({ [campo]: valore }).eq('id', id)
    setDipendenti(prev => prev.map(d => d.id === id ? { ...d, [campo]: valore } : d))
  }

  // --- LOGICA CANTIERI ---
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
    <main className="min-h-screen bg-slate-50 text-slate-800 p-6 pb-40">
      <div className="max-w-6xl mx-auto">
        
        {/* SEZIONE DIPENDENTI */}
        <div className="mb-16">
          <h1 className="text-3xl font-black text-slate-900 italic mb-2">Gestione Personale</h1>
          <p className="text-slate-500 mb-6">Anagrafica e scadenze documenti</p>

          {/* Form Nuovo Dipendente */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nome Dipendente</label>
              <input 
                type="text" 
                placeholder="ES: MARCO ROSSI" 
                value={nuovoDipendente.nome}
                onChange={(e) => setNuovoDipendente({...nuovoDipendente, nome: e.target.value})}
                className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 font-bold uppercase outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Telefono</label>
              <input 
                type="text" 
                placeholder="333 1234567" 
                value={nuovoDipendente.telefono}
                onChange={(e) => setNuovoDipendente({...nuovoDipendente, telefono: e.target.value})}
                className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 font-bold outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <button onClick={aggiungiDipendente} className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-black uppercase text-xs shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
              Aggiungi Persona
            </button>
          </div>

          {/* Griglia Dipendenti (Card Grandi) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dipendenti.map((d) => (
              <div key={d.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 uppercase">{d.nome_dipendente}</h2>
                    <input 
                      type="text" 
                      value={d.telefono || ''} 
                      onChange={(e) => aggiornaCampo(d.id, 'telefono', e.target.value)}
                      className="text-blue-600 font-bold text-sm bg-transparent outline-none border-b border-transparent focus:border-blue-200"
                      placeholder="Aggiungi telefono..."
                    />
                  </div>
                  <button onClick={() => eliminaDipendente(d.id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all">🗑️</button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-50">
                   {[
                    { label: 'Carta Identità', key: 'scadenza_ci' },
                    { label: 'Permesso Sogg.', key: 'scadenza_permesso' },
                    { label: 'Contratto', key: 'scadenza_contratto' },
                    { label: 'Visita Medica', key: 'scadenza_visita' }
                  ].map((doc) => (
                    <div key={doc.key} className="space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase">{doc.label}</span>
                      <input 
                        type="date" 
                        value={d[doc.key] || ''} 
                        onChange={(e) => aggiornaCampo(d.id, doc.key, e.target.value)}
                        className="w-full text-xs font-bold text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-slate-200 mb-16" />

        {/* SEZIONE CANTIERI */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-900 italic mb-2">Anagrafica Cantieri</h2>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-8 flex gap-2">
            <input 
              type="text" 
              placeholder="NOME NUOVO CANTIERE..." 
              value={nuovoCantiere}
              onChange={(e) => setNuovoCantiere(e.target.value)}
              className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100 font-bold uppercase outline-none"
            />
            <button onClick={aggiungiCantiere} className="bg-blue-600 text-white px-8 rounded-xl font-black uppercase text-xs">Aggiungi</button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cantieri.map((c) => (
              <div key={c.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex justify-between items-center">
                <span className="font-black text-slate-700 uppercase text-xs">{c.nome_cantiere}</span>
                <button onClick={() => eliminaCantiere(c.id)} className="text-slate-200 hover:text-red-500">🗑️</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NAV BAR */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-lg bg-white/80 backdrop-blur-xl border border-slate-200 p-2 rounded-3xl flex justify-around items-center z-50 shadow-2xl">
        <Link href="/" className="px-4 py-2 text-slate-400 font-bold text-[10px] uppercase">Riepilogo</Link>
        <Link href="/calendario" className="px-4 py-2 text-slate-400 font-bold text-[10px] uppercase">Calendario</Link>
        <Link href="/nuovo-inserimento" className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest">+ Aggiungi</Link>
        <Link href="/gestione" className="px-4 py-2 text-blue-600 font-black text-[10px] uppercase">Gestione</Link>
      </nav>
    </main>
  )
}