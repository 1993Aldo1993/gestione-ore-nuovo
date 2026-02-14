'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function GestionePersonale() {
  const [dipendenti, setDipendenti] = useState<any[]>([])
  const [cantieri, setCantieri] = useState<any[]>([])
  const [nuovoDip, setNuovoDip] = useState({ nome: '', tel: '' })
  const [nuovoCant, setNuovoCant] = useState('')

  useEffect(() => { caricaTutto() }, [])

  const caricaTutto = async () => {
    const { data: d } = await supabase.from('dipendenti').select('*').order('nome_dipendente')
    const { data: c } = await supabase.from('cantieri').select('*').order('nome_cantiere')
    setDipendenti(d || [])
    setCantieri(c || [])
  }

  const aggiungiDipendente = async () => {
    if (!nuovoDip.nome) return
    await supabase.from('dipendenti').insert([{ nome_dipendente: nuovoDip.nome.toUpperCase(), telefono: nuovoDip.tel }])
    setNuovoDip({ nome: '', tel: '' })
    caricaTutto()
  }

  const eliminaDipendente = async (id: number) => {
    if (!confirm("Eliminare definitivamente questo dipendente?")) return
    await supabase.from('dipendenti').delete().eq('id', id)
    caricaTutto()
  }

  const aggiornaScadenza = async (id: number, campo: string, valore: string) => {
    await supabase.from('dipendenti').update({ [campo]: valore }).eq('id', id)
    setDipendenti(prev => prev.map(d => d.id === id ? { ...d, [campo]: valore } : d))
  }

  const aggiungiCantiere = async () => {
    if (!nuovoCant) return
    await supabase.from('cantieri').insert([{ nome_cantiere: nuovoCant.toUpperCase() }])
    setNuovoCant('')
    caricaTutto()
  }

  const eliminaCantiere = async (id: number) => {
    if (!confirm("Eliminare il cantiere?")) return
    await supabase.from('cantieri').delete().eq('id', id)
    caricaTutto()
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 pb-40">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 italic mb-8">Gestione Sistema</h1>

        {/* BOX DI INSERIMENTO ALLINEATI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 items-stretch">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <h2 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Nuovo Dipendente</h2>
            <div className="space-y-3">
              <input type="text" placeholder="NOME..." value={nuovoDip.nome} onChange={e=>setNuovoDip({...nuovoDip, nome: e.target.value})} className="w-full bg-slate-50 p-3 rounded-xl font-bold uppercase outline-none focus:ring-2 focus:ring-blue-100" />
              <input type="text" placeholder="TELEFONO..." value={nuovoDip.tel} onChange={e=>setNuovoDip({...nuovoDip, tel: e.target.value})} className="w-full bg-slate-50 p-3 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-100" />
              <button onClick={aggiungiDipendente} className="w-full bg-blue-600 text-white p-3 rounded-xl font-black uppercase text-xs shadow-lg">Salva Persona</button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <h2 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Nuovo Cantiere</h2>
            <div className="space-y-3">
              <div className="flex-1">
                <input type="text" placeholder="NOME CANTIERE..." value={nuovoCant} onChange={e=>setNuovoCant(e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl font-bold uppercase outline-none focus:ring-2 focus:ring-blue-100 mb-3" />
                <div className="h-[48px]"></div> {/* Spaziatore per allineare i bottoni */}
              </div>
              <button onClick={aggiungiCantiere} className="w-full bg-slate-900 text-white p-3 rounded-xl font-black uppercase text-xs shadow-lg">Aggiungi Cantiere</button>
            </div>
          </div>
        </div>

        {/* ANAGRAFICA DIPENDENTI CON TUTTI I DATI E ELIMINA */}
        <h2 className="text-xl font-black text-slate-900 italic mb-4">Anagrafica Personale</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {dipendenti.map(d => (
            <div key={d.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative group">
              <button 
                onClick={() => eliminaDipendente(d.id)}
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"
              >
                🗑️
              </button>
              
              <h3 className="font-black uppercase text-slate-900 mb-1">{d.nome_dipendente}</h3>
              <p className="text-blue-600 font-bold text-sm mb-6">{d.telefono || '---'}</p>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'C. Identità', key: 'scadenza_ci' },
                    { label: 'Permesso', key: 'scadenza_permesso' },
                    { label: 'Contratto', key: 'scadenza_contratto' },
                    { label: 'Visita', key: 'scadenza_visita' }
                  ].map(doc => (
                    <div key={doc.key} className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-400 uppercase mb-1">{doc.label}</span>
                      <input 
                        type="date" 
                        value={d[doc.key] || ''} 
                        onChange={(e) => aggiornaScadenza(d.id, doc.key, e.target.value)}
                        className="text-[10px] font-bold text-slate-700 bg-slate-50 p-2 rounded-lg border border-transparent focus:border-blue-200 outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* LISTA CANTIERI */}
        <h2 className="text-xl font-black text-slate-900 italic mb-4">Lista Cantieri</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {cantieri.map(c => (
            <div key={c.id} className="bg-white p-3 rounded-2xl border border-slate-200 flex justify-between items-center">
              <span className="font-bold uppercase text-[10px] text-slate-600 truncate">{c.nome_cantiere}</span>
              <button onClick={() => eliminaCantiere(c.id)} className="text-slate-200 hover:text-red-500 ml-2">🗑️</button>
            </div>
          ))}
        </div>
      </div>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-lg bg-white/80 backdrop-blur-xl border border-slate-200 p-2 rounded-3xl flex justify-around items-center z-50 shadow-2xl">
        <Link href="/" className="px-3 py-2 text-slate-400 font-bold text-[10px] uppercase">Riepilogo</Link>
        <Link href="/calendario" className="px-3 py-2 text-slate-400 font-bold text-[10px] uppercase">Calendario</Link>
        <Link href="/nuovo-inserimento" className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest">+ Aggiungi</Link>
        <Link href="/gestione" className="px-3 py-2 text-blue-600 font-black text-[10px] uppercase">Gestione</Link>
      </nav>
    </main>
  )
}