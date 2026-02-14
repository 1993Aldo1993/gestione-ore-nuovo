'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function NuovoInserimento() {
  const [dipendenti, setDipendenti] = useState<any[]>([])
  const [cantieri, setCantieri] = useState<any[]>([])
  const [dataSelezione, setDataSelezione] = useState(new Date().toISOString().split('T')[0])
  const [cantiereSelezionato, setCantiereSelezionato] = useState('')
  const [meseSelezionato, setMeseSelezionato] = useState('Gennaio')
  
  const [presenti, setPresenti] = useState<{[key: string]: boolean}>({})
  const [oreDipendenti, setOreDipendenti] = useState<{[key: string]: number}>({})

  useEffect(() => {
    caricaDati()
  }, [])

  const caricaDati = async () => {
    const { data: d } = await supabase.from('dipendenti').select('nome_dipendente')
    const { data: c } = await supabase.from('cantieri').select('nome_cantiere')
    if (d) {
      setDipendenti(d)
      const initialOre: {[key: string]: number} = {}
      const initialPresenti: {[key: string]: boolean} = {}
      d.forEach(dip => {
        initialOre[dip.nome_dipendente] = 8
        initialPresenti[dip.nome_dipendente] = false
      })
      setOreDipendenti(initialOre)
      setPresenti(initialPresenti)
    }
    if (c) setCantieri(c)
  }

  const togglePresenza = (nome: string) => {
    setPresenti(prev => ({ ...prev, [nome]: !prev[nome] }))
  }

  const modificaOre = (nome: string, valore: number) => {
    setOreDipendenti(prev => ({ ...prev, [nome]: Math.max(0, prev[nome] + valore) }))
  }

  const salvaSquadra = async () => {
    if (!cantiereSelezionato) return alert("Seleziona prima il cantiere!")
    
    const nomiDaSalvare = Object.keys(presenti).filter(nome => presenti[nome])
    
    const records = nomiDaSalvare.map(nome => ({
      data: dataSelezione,
      nome_dipendente: nome,
      nome_cantiere: cantiereSelezionato,
      ore: oreDipendenti[nome],
      mese: meseSelezionato
    }))

    if (records.length === 0) return alert("Seleziona almeno un dipendente!")

    const { error } = await supabase.from('diario').insert(records)
    
    if (error) {
      alert("Errore: " + error.message)
    } else {
      alert(`✅ Registrati ${records.length} dipendenti per ${cantiereSelezionato}`)
      
      // IL PEZZO NUOVO: Rimuoviamo dalla lista locale i dipendenti appena salvati
      setDipendenti(prev => prev.filter(d => !nomiDaSalvare.includes(d.nome_dipendente)))
      
      // Resettiamo lo stato dei presenti per i rimasti
      const nuoviPresenti = { ...presenti }
      nomiDaSalvare.forEach(nome => delete nuoviPresenti[nome])
      setPresenti(nuoviPresenti)
    }
  }

  return (
    <main className="p-4 bg-gray-900 min-h-screen text-white font-sans">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-blue-400 text-center uppercase">Assegnazione Cantieri</h1>
        
        {/* Contatore dipendenti rimasti */}
        <p className="text-center text-gray-400 mb-4 text-sm">
          Dipendenti ancora da assegnare: <span className="text-white font-bold">{dipendenti.length}</span>
        </p>

        <div className="bg-gray-800 p-4 rounded-2xl mb-6 border border-gray-700 space-y-3">
          <div className="grid grid-cols-2 gap-3">
             <input type="date" value={dataSelezione} onChange={(e)=>setDataSelezione(e.target.value)} className="bg-gray-700 p-3 rounded-xl text-white border-none text-sm"/>
             <select onChange={(e)=>setMeseSelezionato(e.target.value)} value={meseSelezionato} className="bg-gray-700 p-3 rounded-xl text-white border-none text-sm">
                {['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
             </select>
          </div>
          <select onChange={(e)=>setCantiereSelezionato(e.target.value)} className="w-full bg-blue-900/40 p-3 rounded-xl text-white border border-blue-500/30 font-bold">
            <option value="">--- SELEZIONA IL CANTIERE ---</option>
            {cantieri.map((c, i) => <option key={i} value={c.nome_cantiere}>{c.nome_cantiere}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          {dipendenti.length === 0 ? (
            <div className="text-center p-10 bg-gray-800/20 rounded-2xl border border-dashed border-gray-700">
               <p className="text-green-400 font-bold text-lg">Tutti i dipendenti assegnati! ✅</p>
               <button onClick={caricaDati} className="mt-4 text-blue-400 text-sm underline">Ricarica lista completa</button>
            </div>
          ) : (
            dipendenti.map((d, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${presenti[d.nome_dipendente] ? 'bg-gray-800 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'bg-gray-800/40 border-transparent opacity-70'}`}>
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={presenti[d.nome_dipendente] || false} onChange={() => togglePresenza(d.nome_dipendente)} className="w-5 h-5 rounded-full accent-blue-500 cursor-pointer"/>
                  <span className={`font-bold ${presenti[d.nome_dipendente] ? 'text-white' : 'text-gray-500'}`}>{d.nome_dipendente}</span>
                </div>
                
                {presenti[d.nome_dipendente] && (
                  <div className="flex items-center gap-3">
                    <button onClick={() => modificaOre(d.nome_dipendente, -1)} className="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white w-8 h-8 rounded-lg font-bold">-</button>
                    <span className="text-xl font-black text-orange-400 w-6 text-center">{oreDipendenti[d.nome_dipendente]}</span>
                    <button onClick={() => modificaOre(d.nome_dipendente, 1)} className="bg-green-500/20 text-green-500 hover:bg-green-700 hover:text-white w-8 h-8 rounded-lg font-bold">+</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {dipendenti.length > 0 && (
          <button onClick={salvaSquadra} className="w-full mt-8 bg-blue-600 hover:bg-blue-500 p-4 rounded-2xl font-black text-lg shadow-2xl active:scale-95 transition-all uppercase">
            Salva e Rimuovi dalla Lista
          </button>
        )}
        
        <Link href="/" className="block text-center mt-6 text-gray-500 text-sm hover:text-white underline">Vedi Riepilogo Ore</Link>
      </div>
    </main>
  )
}