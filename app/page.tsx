'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Home() {
  const [records, setRecords] = useState<any[]>([])
  const [cantieri, setCantieri] = useState<any[]>([])
  const [dipendenti, setDipendenti] = useState<any[]>([])
  const [filtroMese, setFiltroMese] = useState('')
  const [filtroDipendente, setFiltroDipendente] = useState('')
  const [filtroCantiere, setFiltroCantiere] = useState('')

  useEffect(() => { caricaDati() }, [])

  const caricaDati = async () => {
    try {
      // Ordinamento basato sulla colonna 'dati' come da database
      const { data: recs, error: err1 } = await supabase.from('diario').select('*').order('dati', { ascending: false })
      const { data: cant, error: err2 } = await supabase.from('cantieri').select('nome_cantiere')
      const { data: dip, error: err3 } = await supabase.from('dipendenti').select('*')
      
      if (err1 || err2 || err3) {
        console.error("Errore Supabase:", err1 || err2 || err3)
      }

      if (recs) setRecords(recs)
      if (cant) setCantieri(cant)
      if (dip) setDipendenti(dip)
    } catch (error) {
      console.error("Errore generico durante il caricamento:", error)
    }
  }

  // Funzione per modificare le ore direttamente (+ / -)
  const modificaOre = async (id: number, oreAttuali: number, variazione: number) => {
    const nuoveOre = oreAttuali + variazione;
    if (nuoveOre < 0) return; // Impedisce di andare sotto zero

    const { error } = await supabase
      .from('diario')
      .update({ minerale: nuoveOre })
      .eq('id', id);

    if (error) {
      alert("Errore durante l'aggiornamento: " + error.message);
    } else {
      // Aggiorna lo stato locale per vedere subito la modifica e aggiornare il totale
      setRecords(prev => prev.map(r => r.id === id ? { ...r, minerale: nuoveOre } : r));
    }
  };

  const eliminaRecord = async (id: number) => {
    if (!window.confirm("Eliminare questa registrazione?")) return
    const { error } = await supabase.from('diario').delete().eq('id', id)
    if (error) alert(error.message)
    else setRecords(prev => prev.filter(r => r.id !== id))
  }

  const controllaScadenzeDipendente = (d: any) => {
    const oggi = new Date()
    const scadenze = [
      { etichetta: 'C.I.', data: d.scadenza_ci },
      { etichetta: 'Permesso', data: d.scadenza_permesso },
      { etichetta: 'Contratto', data: d.scadenza_contratto },
      { etichetta: 'Visita', data: d.scadenza_visita },
      { etichetta: 'Corso', data: d.scadenza_corso },
    ]
    return scadenze.map(s => {
      if (!s.data) return null
      const scad = new Date(s.data)
      const diff = Math.ceil((scad.getTime() - oggi.getTime()) / (1000 * 60 * 60 * 24))
      if (diff < 0) return { critico: true, msg: `${s.etichetta} SCADUTA` }
      if (diff <= 30) return { critico: false, msg: `${s.etichetta} scad. ${diff}gg` }
      return null
    }).filter(Boolean)
  }

  const datiFiltrati = records.filter(r => {
    const matchMese = filtroMese === '' || r.mese === filtroMese
    const matchDipendente = filtroDipendente === '' || r.nome_dipendente === filtroDipendente
    const matchCantiere = filtroCantiere === '' || r.nome_cantiere === filtroCantiere
    return matchMese && matchDipendente && matchCantiere
  })

  const totaleOre = datiFiltrati.reduce((acc, curr) => acc + (Number(curr.minerale) || 0), 0)

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 p-6 pb-32">
      <div className="max-w-6xl mx-auto">
        
        {/* Intestazione */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 italic">Riepilogo Ore</h1>
            <p className="text-slate-500 font-medium tracking-tight">Registro attività professionale</p>
          </div>
          <div className="text-right bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Totale Accumulato</p>
            <span className="text-3xl font-black text-blue-600">{totaleOre} h</span>
          </div>
        </div>

        {/* Avvisi Scadenze */}
        <div className="mb-8 space-y-2">
          {dipendenti.map(d => {
            const alerts = controllaScadenzeDipendente(d)
            return alerts.map((a: any, i) => (
              <div key={`${d.id}-${i}`} className={`p-4 rounded-xl border flex justify-between items-center shadow-sm ${a.critico ? 'bg-red-50 border-red-200 text-red-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                <span className="font-semibold uppercase text-xs tracking-wide">{d.nome_dipendente}</span>
                <span className="font-bold text-xs">{a.msg}</span>
              </div>
            ))
          })}
        </div>

        {/* Filtri */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter ml-1">Filtra per Persona</label>
            <select className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-700 focus:ring-2 focus:ring-blue-100 outline-none" onChange={(e) => setFiltroDipendente(e.target.value)}>
              <option value="">Tutti i Dipendenti</option>
              {dipendenti.map((d, i) => <option key={i} value={d.nome_dipendente}>{d.nome_dipendente}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter ml-1">Filtra per Cantiere</label>
            <select className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-700 focus:ring-2 focus:ring-blue-100 outline-none" value={filtroCantiere} onChange={(e) => setFiltroCantiere(e.target.value)}>
              <option value="">Tutti i Cantieri</option>
              {cantieri.map((c, i) => <option key={i} value={c.nome_cantiere}>{c.nome_cantiere}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter ml-1">Filtra per Mese</label>
            <select className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-700 focus:ring-2 focus:ring-blue-100 outline-none" onChange={(e) => setFiltroMese(e.target.value)}>
              <option value="">Tutti i mesi</option>
              {['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        {/* Tabella con tasti modifica ore */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                <th className="p-6">Data</th>
                <th className="p-6">Dipendente</th>
                <th className="p-6">Cantiere</th>
                <th className="p-6 text-center">Ore</th>
                <th className="p-6 text-right">Azione</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {datiFiltrati.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="p-6 text-slate-500 text-sm font-medium">
                    {r.dati ? new Date(r.dati).toLocaleDateString('it-IT') : '---'}
                  </td>
                  <td className="p-6 font-bold text-slate-900 uppercase text-sm tracking-tight">{r.nome_dipendente}</td>
                  <td className="p-6 text-slate-400 text-sm italic">{r.nome_cantiere}</td>
                  
                  {/* Cella Ore con tasti + e - */}
                  <td className="p-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={() => modificaOre(r.id, Number(r.minerale), -1)}
                        className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors text-lg font-bold"
                      >
                        -
                      </button>
                      
                      <span className="bg-blue-50 text-blue-700 px-4 py-1 rounded-lg font-black text-lg min-w-[50px]">
                        {r.minerale}
                      </span>
                      
                      <button 
                        onClick={() => modificaOre(r.id, Number(r.minerale), 1)}
                        className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-green-50 hover:text-green-600 transition-colors text-lg font-bold"
                      >
                        +
                      </button>
                    </div>
                  </td>

                  <td className="p-6 text-right">
                    <button onClick={() => eliminaRecord(r.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-500 p-2">
                        🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigazione Bottom */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-white/90 backdrop-blur-xl border border-slate-200 p-3 rounded-3xl flex justify-around items-center z-50 shadow-2xl shadow-slate-300/50">
        <Link href="/" className="text-blue-600 font-extrabold text-[10px] uppercase tracking-tighter">Riepilogo</Link>
        <Link href="/calendario" className="text-slate-400 font-bold text-[10px] uppercase tracking-tighter">Calendario</Link>
        <Link href="/nuovo-inserimento" className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-transform">+ Aggiungi</Link>
        <Link href="/gestione" className="text-slate-400 font-bold text-[10px] uppercase tracking-tighter">Gestione</Link>
      </nav>
    </main>
  )
}