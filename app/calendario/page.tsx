'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import itLocale from '@fullcalendar/core/locales/it'

export default function Calendario() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    caricaOrePerCalendario()
  }, [])

  const caricaOrePerCalendario = async () => {
    try {
      setLoading(true)
      // Recuperiamo i dati dalla tabella 'diario' usando la colonna 'dati' per la data
      const { data, error } = await supabase
        .from('diario')
        .select('nome_dipendente, minerale, dati, nome_cantiere')
      
      if (error) throw error

      // Trasformiamo i dati nel formato che piace al calendario
      const eventiFormattati = data.map(record => ({
        title: `${record.nome_dipendente}: ${record.minerale}h`,
        start: record.dati, // Usa la data corretta
        extendedProps: { cantiere: record.nome_cantiere },
        backgroundColor: '#eff6ff', // Blu chiarissimo come le tue card
        textColor: '#1d4ed8',       // Blu scuro per il testo
        borderColor: '#dbeafe'
      }))

      setEvents(eventiFormattati)
    } catch (error) {
      console.error("Errore caricamento calendario:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 p-6 pb-32">
      <div className="max-w-6xl mx-auto">
        
        {/* Intestazione Coerente */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 italic">Pianificazione Squadre</h1>
          <p className="text-slate-500 font-medium tracking-tight">Visualizzazione mensile attività</p>
        </div>

        {/* Card Bianca del Calendario */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-20 text-slate-400 font-black uppercase tracking-widest text-xs animate-pulse">
              Sincronizzazione calendario...
            </div>
          ) : (
            <div className="calendar-container">
              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                locale={itLocale}
                events={events}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: ''
                }}
                height="auto"
                eventClassNames="text-[10px] font-bold rounded-md border-none p-0.5 mb-0.5"
              />
            </div>
          )}
        </div>
      </div>

      {/* Navigazione Bottom */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-white/90 backdrop-blur-xl border border-slate-200 p-3 rounded-3xl flex justify-around items-center z-50 shadow-2xl">
        <Link href="/" className="text-slate-400 font-bold text-[10px] uppercase">Riepilogo</Link>
        <Link href="/calendario" className="text-blue-600 font-extrabold text-[10px] uppercase">Calendario</Link>
        <Link href="/nuovo-inserimento" className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest">+ Aggiungi</Link>
        <Link href="/gestione" className="text-slate-400 font-bold text-[10px] uppercase">Gestione</Link>
      </nav>

      <style jsx global>{`
        .fc { --fc-border-color: #f1f5f9; font-family: inherit; }
        .fc .fc-toolbar-title { font-size: 1.25rem; font-weight: 800; text-transform: capitalize; color: #0f172a; }
        .fc .fc-button-primary { background-color: #ffffff; border-color: #e2e8f0; color: #64748b; font-weight: bold; text-transform: uppercase; font-size: 10px; border-radius: 12px; }
        .fc .fc-button-primary:hover { background-color: #f8fafc; color: #0f172a; }
        .fc .fc-button-primary:not(:disabled).fc-button-active { background-color: #0f172a; border-color: #0f172a; }
        .fc th { padding: 12px 0 !important; font-size: 10px; font-weight: 900; text-transform: uppercase; color: #94a3b8; }
        .fc-daygrid-day-number { font-weight: bold; font-size: 13px; color: #64748b; padding: 8px !important; }
        .fc-day-today { background-color: #f8fafc !important; }
      `}</style>
    </main>
  )
}