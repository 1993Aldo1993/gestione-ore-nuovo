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

      const eventiFormattati = data.map(record => ({
        title: `${record.nome_dipendente}: ${record.minerale}h`,
        start: record.dati,
        extendedProps: { cantiere: record.nome_cantiere },
        backgroundColor: '#eff6ff',
        textColor: '#1d4ed8',
        borderColor: '#dbeafe'
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
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 italic uppercase">Pianificazione</h1>
        </div>

        <div className="bg-white rounded-3xl p-4 md:p-6 shadow-xl border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-20 font-bold text-slate-400 animate-pulse uppercase text-xs tracking-widest">
              Sincronizzazione...
            </div>
          ) : (
            <div className="calendar-container overflow-x-auto">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale={itLocale}
                events={events}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridDay,listMonth'
                }}
                buttonText={{
                  today: 'Oggi',
                  month: 'Mese',
                  day: 'Giorno',
                  list: 'Agenda'
                }}
                height="auto"
                stickyHeaderDates={true}
                eventClassNames="text-[10px] font-bold rounded-md border-none p-0.5 mb-0.5"
              />
            </div>
          )}
        </div>
      </div>

      {/* Navigazione Bottom Responsive */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-lg bg-white/90 backdrop-blur-xl border border-slate-200 p-2 rounded-3xl flex justify-around items-center z-50 shadow-2xl">
        <Link href="/" className="px-4 py-2 text-slate-400 font-bold text-[10px] uppercase">Riepilogo</Link>
        <Link href="/calendario" className="px-4 py-2 text-blue-600 font-black text-[10px] uppercase">Calendario</Link>
        <Link href="/nuovo-inserimento" className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg">+ Aggiungi</Link>
        <Link href="/gestione" className="px-4 py-2 text-slate-400 font-bold text-[10px] uppercase">Gestione</Link>
      </nav>

      <style jsx global>{`
        .fc { --fc-border-color: #f1f5f9; font-family: inherit; }
        .fc .fc-toolbar { 
          display: flex; 
          flex-direction: column; 
          gap: 1rem; 
          margin-bottom: 1.5rem !important;
        }
        @media (min-width: 768px) {
          .fc .fc-toolbar { flex-direction: row; justify-content: space-between; }
        }
        .fc .fc-toolbar-title { font-size: 1.1rem !important; font-weight: 900; text-transform: uppercase; color: #0f172a; }
        .fc .fc-button { 
          background-color: #ffffff !important; 
          border: 1px solid #e2e8f0 !important; 
          color: #64748b !important; 
          font-weight: 800 !important; 
          text-transform: uppercase !important; 
          font-size: 9px !important; 
          border-radius: 12px !important;
          padding: 8px 12px !important;
        }
        .fc .fc-button-primary:not(:disabled).fc-button-active, 
        .fc .fc-button-primary:not(:disabled):active {
          background-color: #0f172a !important;
          color: white !important;
          border-color: #0f172a !important;
        }
      `}</style>
    </main>
  )
}