'use client'

import React, { useEffect, useRef } from 'react'
import Script from 'next/script'

interface JitsiMeetingProps {
  roomName: string
  displayName: string
  onHangUp: () => void
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: any
  }
}

export default function JitsiMeeting({ roomName, displayName, onHangUp }: JitsiMeetingProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<any>(null)

  const handleJitsiLoad = () => {
    if (window.JitsiMeetExternalAPI && containerRef.current) {
      const options = {
        roomName: roomName,
        width: '100%',
        height: '100%',
        parentNode: containerRef.current,
        userInfo: {
          displayName: displayName,
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
            'security'
          ],
        },
      }

      apiRef.current = new window.JitsiMeetExternalAPI('meet.jit.si', options)

      apiRef.current.addEventListeners({
        readyToClose: () => {
          onHangUp()
        },
      })
    }
  }

  useEffect(() => {
    return () => {
      if (apiRef.current) {
        apiRef.current.dispose()
      }
    }
  }, [])

  return (
    <div className="w-full h-full relative bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-800">
      <Script 
        src="https://meet.jit.si/external_api.js" 
        onLoad={handleJitsiLoad}
      />
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
}
