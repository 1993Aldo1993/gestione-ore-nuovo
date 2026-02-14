'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
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

      // Formattazione evento: Mostra Nome + Ore + Cantiere direttamente nel titolo
      const eventiFormattati = data.map(record => ({
        title: `${record.nome_dipendente} (${record.minerale}h) - ${record.nome_cantiere}`,
        start: record.dati,
        allDay: true,
        backgroundColor: '#f8fafc',
        textColor: '#1e293b',
        borderColor: '#e2e8f0'
      }))

      setEvents(eventiFormattati)
    } catch (error) {
      console.error("Errore:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-6 pb-32">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 italic uppercase">Pianificazione Squadre</h1>
        </div>

        <div className="bg-white rounded-3xl p-4 shadow-xl border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-20 font-bold text-slate-400 animate-pulse uppercase text-xs tracking-widest">
              Caricamento Agenda...
            </div>
          ) : (
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
              initialView="listWeek" // Si apre direttamente in modalità Agenda Settimanale
              locale={itLocale}
              events={events}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'listWeek,dayGridMonth' // Permette di tornare al Mese se necessario
              }}
              buttonText={{
                today: 'Oggi',
                month: 'Mese',
                list: 'Agenda'
              }}
              height="auto"
              noEventsContent="Nessuna attività pianificata"
              eventClassNames="font-bold text-slate-700 border-l-4 border-l-blue-500"
            />
          )}
        </div>
      </div>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-lg bg-white/80 backdrop-blur-xl border border-slate-200 p-2 rounded-3xl flex justify-around items-center z-50 shadow-2xl">
        <Link href="/" className="px-3 py-2 text-slate-400 font-bold text-[10px] uppercase">Riepilogo</Link>
        <Link href="/calendario" className="px-3 py-2 text-blue-600 font-black text-[10px] uppercase">Calendario</Link>
        <Link href="/nuovo-inserimento" className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest">+ Aggiungi</Link>
        <Link href="/gestione" className="px-3 py-2 text-slate-400 font-bold text-[10px] uppercase">Gestione</Link>
      </nav>

      <style jsx global>{`
        .fc-list-day-side-text { font-weight: 800; color: #64748b; text-transform: uppercase; font-size: 0.7rem; }
        .fc-list-day-text { font-weight: 900; color: #0f172a; text-transform: uppercase; }
        .fc-list-event-title { font-size: 0.85rem !important; }
        .fc-list-event:hover td { background-color: #f1f5f9 !important; }
        .fc .fc-button-primary { background-color: #fff !important; color: #000 !important; border: 1px solid #e2e8f0 !important; border-radius: 12px !important; text-transform: uppercase !important; font-size: 10px !important; font-weight: 800 !important; }
        .fc .fc-button-primary:not(:disabled).fc-button-active { background-color: #0f172a !important; color: #fff !important; }
        .fc-theme-standard .fc-list { border-radius: 20px; overflow: hidden; border: none; }
      `}</style>
    </main>
  )
}