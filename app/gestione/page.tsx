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

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-6 pb-40">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 italic mb-8">Gestione Sistema</h1>

        {/* AGGIUNTA VELOCE (Responsive) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-4">Nuovo Dipendente</p>
            <div className="flex flex-col gap-3">
              <input type="text" placeholder="NOME..." value={nuovoDip.nome} onChange={e=>setNuovoDip({...nuovoDip, nome: e.target.value})} className="bg-slate-50 p-3 rounded-xl font-bold uppercase outline-none focus:ring-2 focus:ring-blue-100" />
              <input type="text" placeholder="TEL..." value={nuovoDip.tel} onChange={e=>setNuovoDip({...nuovoDip, tel: e.target.value})} className="bg-slate-50 p-3 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-100" />
              <button onClick={aggiungiDipendente} className="bg-blue-600 text-white p-3 rounded-xl font-black uppercase text-xs">Salva Dipendente</button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-4">Nuovo Cantiere</p>
            <div className="flex flex-col gap-3">
              <input type="text" placeholder="NOME CANTIERE..." value={nuovoCant} onChange={e=>setNuovoCant(e.target.value)} className="bg-slate-50 p-3 rounded-xl font-bold uppercase outline-none focus:ring-2 focus:ring-blue-100" />
              <button onClick={aggiungiCantiere} className="bg-slate-900 text-white p-3 rounded-xl font-black uppercase text-xs">Aggiungi Cantiere</button>
            </div>
          </div>
        </div>

        {/* LISTA DIPENDENTI (Responsive Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {dipendenti.map(d => (
            <div key={d.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start">
                <h3 className="font-black uppercase text-slate-900">{d.nome_dipendente}</h3>
                <span className="text-[10px] text-slate-300 font-bold">ID: {d.id}</span>
              </div>
              <p className="text-blue-600 font-bold text-sm mb-4">{d.telefono || '---'}</p>
              <div className="grid grid-cols-2 gap-2 text-[9px] font-black text-slate-400 uppercase">
                <div>CI: {d.scadenza_ci || '---'}</div>
                <div>Visita: {d.scadenza_visita || '---'}</div>
              </div>
            </div>
          ))}
        </div>

        {/* LISTA CANTIERI (Compact Grid) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {cantieri.map(c => (
            <div key={c.id} className="bg-white p-3 rounded-2xl border border-slate-200 text-center font-bold uppercase text-[10px] text-slate-600">
              {c.nome_cantiere}
            </div>
          ))}
        </div>
      </div>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-lg bg-white/90 backdrop-blur-xl border border-slate-200 p-2 rounded-3xl flex justify-around items-center z-50 shadow-2xl">
        <Link href="/" className="px-4 py-2 text-slate-400 font-bold text-[10px] uppercase">Riepilogo</Link>
        <Link href="/calendario" className="px-4 py-2 text-slate-400 font-bold text-[10px] uppercase">Calendario</Link>
        <Link href="/nuovo-inserimento" className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase">+ Aggiungi</Link>
        <Link href="/gestione" className="px-4 py-2 text-blue-600 font-black text-[10px] uppercase">Gestione</Link>
      </nav>
    </main>
  )
}