'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

export default function CalendarioPage() {
  const [eventi, setEventi] = useState<any[]>([])

  useEffect(() => { caricaDati() }, [])

  const caricaDati = async () => {
    const { data } = await supabase.from('diario').select('*')
    if (data) {
      setEventi(data.map(r => ({
        id: r.id,
        title: `${r.nome_dipendente} @ ${r.nome_cantiere}`,
        start: r.data,
        backgroundColor: '#3b82f6',
        extendedProps: { ore: r.minerale }
      })))
    }
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6 pb-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black text-blue-400 mb-6">Pianificazione Squadre</h1>
        <div className="bg-gray-800 p-6 rounded-3xl border border-gray-700 shadow-2xl">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            locale="it"
            events={eventi}
            height="75vh"
            eventContent={(arg) => (
              <div className="p-1 overflow-hidden leading-tight">
                <div className="font-bold text-[10px] truncate">{arg.event.title}</div>
                <div className="text-[9px] text-blue-200">{arg.event.extendedProps.ore} ore</div>
              </div>
            )}
          />
        </div>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4 flex justify-around items-center z-50">
        <Link href="/" className="text-gray-400">Riepilogo</Link>
        <Link href="/nuovo-inserimento" className="bg-green-600 px-6 py-2 rounded-full font-bold">+ Inserisci</Link>
        <Link href="/calendario" className="text-blue-400 font-bold">Calendario</Link>
      </nav>
      <style jsx global>{`
        .fc { --fc-border-color: #374151; --fc-page-bg-color: #1f2937; }
        .fc-button { background: #4b5563 !important; border: none !important; font-weight: bold !important; text-transform: capitalize !important; }
        .fc-button-active { background: #3b82f6 !important; }
      `}</style>
    </main>
  )
}