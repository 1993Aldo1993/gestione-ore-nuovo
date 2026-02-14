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

        {/* MODULI DI AGGIUNTA - Adesso si impilano bene su mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Nuovo Dipendente</h2>
            <div className="space-y-3">
              <input type="text" placeholder="NOME..." value={nuovoDip.nome} onChange={e=>setNuovoDip({...nuovoDip, nome: e.target.value})} className="w-full bg-slate-50 p-3 rounded-xl font-bold uppercase outline-none focus:ring-2 focus:ring-blue-100" />
              <input type="text" placeholder="TELEFONO..." value={nuovoDip.tel} onChange={e=>setNuovoDip({...nuovoDip, tel: e.target.value})} className="w-full bg-slate-50 p-3 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-100" />
              <button onClick={aggiungiDipendente} className="w-full bg-blue-600 text-white p-3 rounded-xl font-black uppercase text-xs shadow-lg shadow-blue-200">Salva Persona</button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Nuovo Cantiere</h2>
            <div className="space-y-3">
              <input type="text" placeholder="NOME CANTIERE..." value={nuovoCant} onChange={e=>setNuovoCant(e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl font-bold uppercase outline-none focus:ring-2 focus:ring-blue-100" />
              <button onClick={aggiungiCantiere} className="w-full bg-slate-900 text-white p-3 rounded-xl font-black uppercase text-xs shadow-lg">Aggiungi Cantiere</button>
            </div>
          </div>
        </div>

        {/* GRIGLIA DIPENDENTI - FISSA LE CARD DEFORMATE */}
        <h2 className="text-xl font-black text-slate-900 italic mb-4">Anagrafica Personale</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {dipendenti.map(d => (
            <div key={d.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[160px]">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="font-black uppercase text-slate-900 leading-tight">{d.nome_dipendente}</h3>
                  <span className="text-[9px] bg-slate-100 px-2 py-1 rounded-full text-slate-500 font-bold">ID: {d.id}</span>
                </div>
                <p className="text-blue-600 font-bold text-sm mt-1">{d.telefono || '---'}</p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-50 grid grid-cols-2 gap-2 text-[9px] font-black text-slate-400 uppercase">
                <div className="flex flex-col">
                   <span>C.I.</span>
                   <span className="text-slate-700">{d.scadenza_ci || '---'}</span>
                </div>
                <div className="flex flex-col">
                   <span>Visita</span>
                   <span className="text-slate-700">{d.scadenza_visita || '---'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* GRIGLIA CANTIERI - PULITA */}
        <h2 className="text-xl font-black text-slate-900 italic mb-4">Lista Cantieri</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {cantieri.map(c => (
            <div key={c.id} className="bg-white p-3 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
              <span className="font-bold uppercase text-[10px] text-slate-600 truncate mr-2">{c.nome_cantiere}</span>
              <button onClick={() => eliminaCantiere(c.id)} className="text-slate-300 hover:text-red-500 transition-colors">🗑️</button>
            </div>
          ))}
        </div>
      </div>

      {/* NAV BAR FISSA */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-lg bg-white/80 backdrop-blur-xl border border-slate-200 p-2 rounded-3xl flex justify-around items-center z-50 shadow-2xl">
        <Link href="/" className="px-3 py-2 text-slate-400 font-bold text-[10px] uppercase">Riepilogo</Link>
        <Link href="/calendario" className="px-3 py-2 text-slate-400 font-bold text-[10px] uppercase">Calendario</Link>
        <Link href="/nuovo-inserimento" className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest">+ Aggiungi</Link>
        <Link href="/gestione" className="px-3 py-2 text-blue-600 font-black text-[10px] uppercase">Gestione</Link>
      </nav>
    </main>
  )
}