'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NuovoInserimento() {
  const router = useRouter()
  const [dipendenti, setDipendenti] = useState<any[]>([])
  const [cantieri, setCantieri] = useState<any[]>([])
  const [selezionati, setSelezionati] = useState<string[]>([])
  
  const [data, setData] = useState(new Date().toISOString().split('T')[0])
  const [cantiere, setCantiere] = useState('')
  const [mese, setMese] = useState('febbraio')
  const [ore, setOre] = useState(8)

  useEffect(() => {
    caricaAnagrafiche()
  }, [])

  const caricaAnagrafiche = async () => {
    const { data: dip } = await supabase.from('dipendenti').select('nome_dipendente').order('nome_dipendente')
    const { data: cant } = await supabase.from('cantieri').select('nome_cantiere').order('nome_cantiere')
    if (dip) setDipendenti(dip)
    if (cant) setCantieri(cant)
  }

  const toggleDipendente = (nome: string) => {
    setSelezionati(prev => 
      prev.includes(nome) ? prev.filter(n => n !== nome) : [...prev, nome]
    )
  }

  const salvaAssegnazione = async () => {
    if (!cantiere || selezionati.length === 0) {
      alert("Seleziona un cantiere e almeno un dipendente")
      return
    }

    // Preparazione record per il database
    const nuoviRecord = selezionati.map(nome => ({
      dati: data,
      mese: mese.toLowerCase(),
      nome_dipendente: nome,
      nome_cantiere: cantiere,
      minerale: ore
    }))

    const { error } = await supabase.from('diario').insert(nuoviRecord)

    if (error) {
      alert("Errore: " + error.message)
    } else {
      // --- LOGICA WHATSAPP INTEGRATA ---
      const dataFormattata = new Date(data).toLocaleDateString('it-IT')
      const listaNomi = selezionati.join(', ')
      
      const messaggio = `*NOTIFICA CANTIERE* 🏗️%0A%0A` +
                        `*Data:* ${dataFormattata}%0A` +
                        `*Cantiere:* ${cantiere}%0A` +
                        `*Ore:* ${ore}h%0A` +
                        `*Squadra:* ${listaNomi}%0A%0A` +
                        `Buon lavoro! 👷‍♂️`

      const confermaInvio = window.confirm("Salvataggio riuscito! Vuoi inviare il riepilogo su WhatsApp?")
      
      if (confermaInvio) {
        window.open(`https://wa.me/?text=${messaggio}`, '_blank')
      }
      
      router.push('/')
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 p-6 pb-32">
      <div className="max-w-2xl mx-auto">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 italic">Assegnazione Cantieri</h1>
          <p className="text-slate-500 font-medium tracking-tight">Inserimento rapido presenze giornaliere</p>
        </div>

        {/* Form di Configurazione */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Data</label>
              <input type="date" value={data} onChange={(e) => setData(e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 font-bold outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Mese</label>
              <select value={mese} onChange={(e) => setMese(e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 font-bold outline-none">
                {['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'].map(m => (
                  <option key={m} value={m.toLowerCase()}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Cantiere di Destinazione</label>
            <select value={cantiere} onChange={(e) => setCantiere(e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 font-bold text-blue-600 outline-none">
              <option value="">--- SELEZIONA IL CANTIERE ---</option>
              {cantieri.map((c, i) => <option key={i} value={c.nome_cantiere}>{c.nome_cantiere}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Ore Lavorate (per persona)</label>
            <input type="number" value={ore} onChange={(e) => setOre(Number(e.target.value))} className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 font-bold outline-none" />
          </div>
        </div>

        {/* Lista Dipendenti */}
        <div className="space-y-2 mb-10">
          <p className="text-[10px] font-black text-slate-400 uppercase ml-1 mb-2">Seleziona la Squadra ({selezionati.length})</p>
          {dipendenti.map((d, i) => (
            <div 
              key={i} 
              onClick={() => toggleDipendente(d.nome_dipendente)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                selezionati.includes(d.nome_dipendente) 
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-[1.02]' 
                : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
              }`}
            >
              <span className="font-bold uppercase text-sm tracking-tight">{d.nome_dipendente}</span>
              {selezionati.includes(d.nome_dipendente) && <span className="text-xl">✓</span>}
            </div>
          ))}
        </div>

        <button 
          onClick={salvaAssegnazione}
          className="w-full bg-slate-900 text-white p-5 rounded-3xl font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-transform"
        >
          Salva e Notifica Squadra
        </button>
      </div>

      {/* Navigazione Bottom Coerente */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-white/90 backdrop-blur-xl border border-slate-200 p-3 rounded-3xl flex justify-around items-center z-50 shadow-2xl">
        <Link href="/" className="text-slate-400 font-bold text-[10px] uppercase tracking-tighter">Riepilogo</Link>
        <Link href="/calendario" className="text-slate-400 font-bold text-[10px] uppercase tracking-tighter">Calendario</Link>
        <Link href="/nuovo-inserimento" className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg">+ Aggiungi</Link>
        <Link href="/gestione" className="text-slate-400 font-bold text-[10px] uppercase tracking-tighter">Gestione</Link>
      </nav>
    </main>
  )
}