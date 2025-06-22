import React, { useState, useRef } from 'react'
import './App.css'

function App() {
  const [recording, setRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const textRef = useRef('')

  const handleClick = async () => {
    if (recording) {
      mediaRecorderRef.current?.stop()
      setRecording(false)
    } else {
      if (!navigator.mediaDevices?.getUserMedia) {
        alert('getUserMedia not supported in this browser.')
        return
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const recorder = new MediaRecorder(stream)
        mediaRecorderRef.current = recorder
        audioChunksRef.current = []
        recorder.ondataavailable = (e: BlobEvent) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data)
        }
        recorder.onstop = async () => {
          const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType })
          const apiKey = import.meta.env.VITE_OPENAI_API_KEY
          if (!apiKey) {
            alert(
              'Missing OpenAI API key. Please set VITE_OPENAI_API_KEY in your .env file'
            )
            return
          }
          setTranscript('')
          textRef.current = ''
          const form = new FormData()
          // Supply a filename with extension so server can infer format
          form.append('file', blob, 'speech.webm')
          form.append('model', 'whisper-1')
          form.append('response_format', 'json')
          const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: { Authorization: `Bearer ${apiKey}` },
            body: form,
          })
          if (!response.ok) {
            const error = await response.text()
            alert('Error: ' + error)
            return
          }
          // Whisper-1 does not support streaming; display the full transcript once available.
          const data = await response.json()
          setTranscript(data.text)
        }
        recorder.start()
        setRecording(true)
      } catch (err) {
        console.error(err)
        alert('Error accessing microphone: ' + err)
      }
    }
  }

  return (
    <div className="App">
      <button
        onClick={handleClick}
        className={recording ? 'recording' : ''}
        aria-label={recording ? 'Stop recording' : 'Start recording'}
      >
        🎤
      </button>
      <pre>{transcript}</pre>
    </div>
  )
}

export default App
