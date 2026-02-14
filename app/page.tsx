'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function RiepilogoOre() {
  const [registrazioni, setRegistrazioni] = useState<any[]>([])
  const [dipendenti, setDipendenti] = useState<any[]>([])
  const [cantieri, setCantieri] = useState<any[]>([])
  const [filtroPersona, setFiltroPersona] = useState('Tutti i Dipendenti')
  const [filtroCantiere, setFiltroCantiere] = useState('Tutti i Cantieri')
  const [filtroMese, setFiltroMese] = useState('Tutti i mesi')
  const [loading, setLoading] = useState(true)

  useEffect(() => { 
    caricaDati() 
  }, [])

  const caricaDati = async () => {
    try {
      setLoading(true)
      const { data: reg } = await supabase.from('diario').select('*').order('dati', { ascending: false })
      const { data: dip } = await supabase.from('dipendenti').select('*').order('nome_dipendente')
      const { data: can } = await supabase.from('cantieri').select('*').order('nome_cantiere')
      
      if (reg) setRegistrazioni(reg)
      if (dip) setDipendenti(dip)
      if (can) setCantieri(can)
    } catch (error) {
      console.error("Errore caricamento:", error)
    } finally {
      setLoading(false)
    }
  }

  const cambiaOre = async (id: number, attuale: number, variazione: number) => {
    const nuovaOra = attuale + variazione
    if (nuovaOra < 0) return
    const { error } = await supabase.from('diario').update({ minerale: nuovaOra }).eq('id', id)
    if (!error) {
      setRegistrazioni(prev => prev.map(r => r.id === id ? { ...r, minerale: nuovaOra } : r))
    }
  }

  const datiFiltrati = registrazioni.filter(r => {
    const matchPersona = filtroPersona === 'Tutti i Dipendenti' || r.nome_dipendente === filtroPersona
    const matchCantiere = filtroCantiere === 'Tutti i Cantieri' || r.nome_cantiere === filtroCantiere
    const dataRecord = new Date(r.dati)
    const meseRecord = dataRecord.toLocaleString('it-IT', { month: 'long' })
    const matchMese = filtroMese === 'Tutti i mesi' || meseRecord.toLowerCase() === filtroMese.toLowerCase()
    return matchPersona && matchCantiere && matchMese
  })

  const totaleOre = datiFiltrati.reduce((acc, curr) => acc + (Number(curr.minerale) || 0), 0)

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 pb-32">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 italic uppercase">Riepilogo Ore</h1>
            <p className="text-slate-500 text-sm font-bold">Registro attività professionale</p>
          </div>
          <div className="bg-white px-8 py-4 rounded-3xl shadow-sm border border-slate-100 text-center w-full md:w-auto">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Totale Ore Filtrate</p>
            <p className="text-4xl font-black text-blue-600">{totaleOre} h</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Dipendente</label>
            <select value={filtroPersona} onChange={e => setFiltroPersona(e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl font-bold text-slate-700 outline-none border border-transparent focus:border-blue-200">
              <option>Tutti i Dipendenti</option>
              {dipendenti.map(d => <option key={d.id} value={d.nome_dipendente}>{d.nome_dipendente}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Cantiere</label>
            <select value={filtroCantiere} onChange={e => setFiltroCantiere(e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl font-bold text-slate-700 outline-none border border-transparent focus:border-blue-200">
              <option>Tutti i Cantieri</option>
              {cantieri.map(c => <option key={c.id} value={c.nome_cantiere}>{c.nome_cantiere}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Mese</label>
            <select value={filtroMese} onChange={e => setFiltroMese(e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl font-bold text-slate-700 outline-none border border-transparent focus:border-blue-200">
              <option>Tutti i mesi</option>
              {['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[750px]">
              <table className="w-full">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                    <th className="px-6 py-4 text-left">Data</th>
                    <th className="px-6 py-4 text-left">Dipendente</th>
                    <th className="px-6 py-4 text-left">Cantiere</th>
                    <th className="px-6 py-4 text-center">Ore</th>
                    <th className="px-6 py-4 text-right">Azione</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {datiFiltrati.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-xs font-bold text-slate-400">
                        {new Date(r.dati).toLocaleDateString('it-IT')}
                      </td>
                      <td className="px-6 py-4 font-black text-slate-900 uppercase text-sm">
                        {r.nome_dipendente}
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-bold italic text-sm uppercase">
                        {r.nome_cantiere}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <button onClick={() => cambiaOre(r.id, r.minerale, -1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold hover:bg-slate-200">-</button>
                          <span className="w-10 text-center font-black text-blue-600 bg-blue-50 py-1 rounded-lg">{r.minerale}</span>
                          <button onClick={() => cambiaOre(r.id, r.minerale, 1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold hover:bg-slate-200">+</button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {/* Spazio azioni */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {loading && <div className="p-10 text-center font-bold text-slate-300 animate-pulse uppercase text-xs">Caricamento...</div>}
            </div>
          </div>
        </div>
      </div>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-lg bg-white/80 backdrop-blur-xl border border-slate-200 p-2 rounded-3xl flex justify-around items-center z-50 shadow-2xl">
        <Link href="/" className="px-3 py-2 text-blue-600 font-black text-[10px] uppercase">Riepilogo</Link>
        <Link href="/calendario" className="px-3 py-2 text-slate-400 font-bold text-[10px] uppercase">Calendario</Link>
        <Link href="/nuovo-inserimento" className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg">+ Aggiungi</Link>
        <Link href="/gestione" className="px-3 py-2 text-slate-400 font-bold text-[10px] uppercase">Gestione</Link>
      </nav>
    </main>
  )
}