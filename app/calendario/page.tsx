'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import itLocale from '@fullcalendar/core/locales/it'

export default function Calendario() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    caricaOre()
  }, [])

  const caricaOre = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('diario')
        .select('nome_dipendente, minerale, dati, nome_cantiere')
      
      if (error) throw error

      const eventiFormattati = data.map(record => ({
        // Titolo pulito: NOME - ORE - CANTIERE
        title: `${record.nome_dipendente.toUpperCase()}: ${record.minerale}h — ${record.nome_cantiere.toUpperCase()}`,
        start: record.dati,
        allDay: true
      }))

      setEvents(eventiFormattati)
    } catch (error) {
      console.error("Errore:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white text-slate-900 p-4 md:p-8 pb-32">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 italic uppercase mb-8 tracking-tighter">
          Pianificazione
        </h1>

        <div className="calendar-clean-container">
          {loading ? (
            <div className="text-center py-20 font-bold text-slate-300 animate-pulse uppercase text-xs">
              Caricamento...
            </div>
          ) : (
            <FullCalendar
              plugins={[dayGridPlugin, listPlugin]}
              initialView="listMonth" // Vista Agenda Mensile come da screenshot
              locale={itLocale}
              events={events}
              headerToolbar={{
                left: 'prev,next oggi',
                center: 'title',
                right: 'listMonth,dayGridMonth'
              }}
              customButtons={{
                oggi: {
                  text: 'OGGI',
                  click: () => { /* gestito da FullCalendar */ }
                }
              }}
              buttonText={{
                month: 'MESE',
                list: 'AGENDA'
              }}
              height="auto"
            />
          )}
        </div>
      </div>

      {/* NAV BAR CLASSICA */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-lg bg-white/90 backdrop-blur-md border border-slate-200 p-2 rounded-3xl flex justify-around items-center z-50 shadow-xl">
        <Link href="/" className="px-3 py-2 text-slate-400 font-bold text-[10px] uppercase">Riepilogo</Link>
        <Link href="/calendario" className="px-3 py-2 text-blue-600 font-black text-[10px] uppercase">Calendario</Link>
        <Link href="/nuovo-inserimento" className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest">+ Aggiungi</Link>
        <Link href="/gestione" className="px-3 py-2 text-slate-400 font-bold text-[10px] uppercase">Gestione</Link>
      </nav>

      <style jsx global>{`
        /* Ripristino stile Light e Pulito */
        .fc { font-family: inherit; border: none !important; }
        .fc-theme-standard td, .fc-theme-standard th { border: 1px solid #f1f5f9 !important; }
        
        /* Header Agenda Grigio Chiaro */
        .fc .fc-list-day-cushion {
          background-color: #f8fafc !important;
          padding: 12px 20px !important;
        }
        .fc .fc-list-day-text { font-weight: 800; text-transform: lowercase; color: #1e293b; }
        .fc .fc-list-day-side-text { font-weight: 800; text-transform: lowercase; color: #1e293b; }

        /* Righe Eventi */
        .fc-list-event { background: transparent !important; }
        .fc-list-event-title { 
          font-size: 11px !important; 
          font-weight: 600 !important; 
          color: #475569 !important;
          padding: 10px !important;
        }
        .fc-list-event-dot { border-color: #3b82f6 !important; }

        /* Bottoni Minimal */
        .fc .fc-button {
          background: white !important;
          border: 1px solid #e2e8f0 !important;
          color: #0f172a !important;
          font-weight: 900 !important;
          font-size: 9px !important;
          border-radius: 8px !important;
          padding: 6px 12px !important;
          text-transform: uppercase !important;
        }
        .fc .fc-button-primary:not(:disabled).fc-button-active {
          background: #0f172a !important;
          color: white !important;
        }
        .fc-toolbar-title { font-weight: 900; text-transform: uppercase; font-size: 1.2rem !important; letter-spacing: -0.05em; }
      `}</style>
    </main>
  )
}