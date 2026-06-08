'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Msg = { role: 'user' | 'assistant'; content: string }

export default function ChatBot() {
  const [open, setOpen]       = useState(false)
  const [msgs, setMsgs]       = useState<Msg[]>([])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [voiceOn, setVoiceOn] = useState(false)
  const [listening, setListening] = useState(false)
  const [showSugg, setShowSugg]   = useState(true)
  const [showArrow, setShowArrow] = useState(false)
  const msgsRef   = useRef<HTMLDivElement>(null)
  const audioRef  = useRef<HTMLAudioElement | null>(null)
  const recognRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    const show = setTimeout(() => setShowArrow(true), 2500)
    const hide = setTimeout(() => setShowArrow(false), 9000)
    return () => { clearTimeout(show); clearTimeout(hide) }
  }, [])

  useEffect(() => { if (open) setShowArrow(false) }, [open])

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight
  }, [msgs])

  useEffect(() => {
    if (!voiceOn) { audioRef.current?.pause(); audioRef.current = null }
  }, [voiceOn])

  const speak = async (text: string) => {
    if (!voiceOn) return
    audioRef.current?.pause()
    try {
      const res = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) return
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audioRef.current = audio
      audio.play()
      audio.onended = () => URL.revokeObjectURL(url)
    } catch { /* silent fail */ }
  }

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    setShowSugg(false)
    const next: Msg[] = [...msgs, { role: 'user', content: text }]
    setMsgs(next)
    setInput('')
    setLoading(true)
    try {
      const res  = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
      const reply = data.text || 'Something went wrong.'
      setMsgs(m => [...m, { role: 'assistant', content: reply }])
      speak(reply)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Connection error.'
      setMsgs(m => [...m, { role: 'assistant', content: `Error: ${msg}` }])
    }
    setLoading(false)
  }

  const toggleMic = () => {
    if (listening) {
      recognRef.current?.stop()
      setListening(false)
      return
    }
    const SR = (window as unknown as { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition
      || (window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition
    if (!SR) { alert('Voice input not supported in this browser.'); return }
    const r = new SR()
    r.lang = 'en-US'; r.interimResults = false; r.maxAlternatives = 1
    r.onresult = (e: SpeechRecognitionEvent) => {
      const t = e.results[0][0].transcript
      setInput(t)
      send(t)
    }
    r.onend = () => setListening(false)
    r.onerror = () => setListening(false)
    r.start()
    recognRef.current = r
    setListening(true)
  }

  return (
    <>
      {/* Arrow hint */}
      <AnimatePresence>
        {showArrow && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0, transition: { type: 'spring', damping: 10 } }}
            exit={{ opacity: 0 }}
            className="fixed bottom-[5.5rem] right-[8rem] z-30 pointer-events-none flex flex-col items-start"
          >
            <svg width="72" height="56" viewBox="0 0 72 56" fill="none">
              <defs>
                <marker id="arrtip" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
                  <path d="M0,0 L7,3.5 L0,7 L1.5,3.5 Z" fill="#FFB800" />
                </marker>
              </defs>
              <path d="M 5,3 Q 2,38 64,52" stroke="#FFB800" strokeWidth="2" strokeDasharray="5 3" fill="none" markerEnd="url(#arrtip)" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        initial={{ scale: 0, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 12, delay: 1.5 }}
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-40 group"
        aria-label="Chat with Perzy"
      >
        <div className="absolute -inset-3 rounded-2xl blur-xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,130,54,0.35) 0%, rgba(255,184,0,0.15) 50%, transparent 70%)', animation: 'chat-pulse 3s ease-in-out infinite' }} />
        <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-amber-600/80 group-hover:border-amber-400 transition-colors"
          style={{ background: 'linear-gradient(145deg, #3A2A1A 0%, #2A1C10 50%, #1E140C 100%)', boxShadow: '0 4px 16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,184,0,0.15), 0 0 20px rgba(255,130,54,0.15)' }}>
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 relative z-10" style={{ filter: 'drop-shadow(0 0 8px rgba(255,184,0,0.6))' }}>
            <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" fill="rgba(255,184,0,0.15)" stroke="#FFB800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="16" y1="8" x2="2" y2="22" stroke="#FFB800" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="17.5" y1="15" x2="9" y2="15" stroke="#FFB800" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="absolute bottom-full right-0 mb-2 px-2.5 py-1 rounded-lg text-[10px] text-amber-200/90 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-amber-700/60 font-medium"
          style={{ background: '#2A1C10', boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>Talk to me</span>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 w-[calc(100%-3rem)] sm:w-[400px] h-[520px] z-50 flex flex-col overflow-hidden rounded-2xl border border-white/15 shadow-2xl"
            style={{ background: '#1e1c1a' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-heading font-bold text-sm"
                  style={{ background: 'rgba(255,130,54,0.2)', border: '1.5px solid rgba(255,130,54,0.4)', color: '#FF8236' }}>P</div>
                <div>
                  <p className="text-white text-sm font-semibold">Pratham Dabas</p>
                  <p className="text-white/40 text-[10px]">Ask me anything</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {/* Voice output toggle */}
                <button
                  onClick={() => { setVoiceOn(v => !v) }}
                  title={voiceOn ? 'Mute voice' : 'Enable voice'}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors ${voiceOn ? 'bg-primary/20 text-primary' : 'bg-white/8 text-white/50 hover:text-white'}`}>
                  {voiceOn ? '🔊' : '🔇'}
                </button>
                <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-full bg-white/8 text-white/50 hover:text-white flex items-center justify-center text-sm">✕</button>
              </div>
            </div>

            {/* Messages */}
            <div ref={msgsRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {msgs.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center font-heading font-bold text-lg"
                    style={{ background: 'rgba(255,130,54,0.15)', border: '2px solid rgba(255,130,54,0.35)', color: '#FF8236' }}>P</div>
                  <p className="text-white/70 text-sm mb-1">Hey, I&apos;m Perzy.</p>
                  <p className="text-white/40 text-xs mb-4">Ask me about my work, projects, or anything.</p>
                  {showSugg && (
                    <div className="flex flex-col gap-2">
                      {["Who are you?", "What did you do at S&P?", "Tell me about your projects", "Are you open to work?"].map(q => (
                        <button key={q} onClick={() => send(q)}
                          className="text-xs text-left px-3 py-1.5 rounded-lg transition-colors"
                          style={{ background: 'rgba(255,130,54,0.1)', border: '1px solid rgba(255,130,54,0.2)', color: 'rgba(255,130,54,0.8)' }}>
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {msgs.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-semibold"
                    style={m.role === 'assistant' ? { background: 'rgba(255,130,54,0.2)', color: '#FF8236' } : { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
                    {m.role === 'assistant' ? 'P' : 'U'}
                  </div>
                  <div className="max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed"
                    style={m.role === 'assistant'
                      ? { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)', borderBottomLeftRadius: 4 }
                      : { background: '#FF8236', color: '#fff', borderBottomRightRadius: 4 }}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px]" style={{ background: 'rgba(255,130,54,0.2)', color: '#FF8236' }}>P</div>
                  <div className="rounded-2xl px-3 py-2 flex gap-1" style={{ background: 'rgba(255,255,255,0.08)', borderBottomLeftRadius: 4 }}>
                    {[0, 150, 300].map(d => <span key={d} className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={e => { e.preventDefault(); send(input) }}
              className="flex gap-2 px-3 py-3 border-t border-white/10" style={{ background: 'rgba(0,0,0,0.2)' }}>
              {/* Mic button */}
              <button
                type="button"
                onClick={toggleMic}
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 transition-colors ${listening ? 'text-red-400' : 'text-white/40 hover:text-white'}`}
                style={{ background: listening ? 'rgba(255,80,80,0.15)' : 'rgba(255,255,255,0.06)', border: `1px solid ${listening ? 'rgba(255,80,80,0.3)' : 'rgba(255,255,255,0.1)'}` }}
                title={listening ? 'Stop listening' : 'Speak your question'}
              >
                {listening ? '⏹' : '🎙️'}
              </button>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={listening ? 'Listening...' : 'Ask me anything...'}
                className="flex-1 rounded-xl px-3 py-2 text-sm text-white outline-none"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
              />
              <button type="submit" disabled={loading || !input.trim()}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm transition-colors disabled:opacity-30 flex-shrink-0"
                style={{ background: '#FF8236' }}>➤</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
