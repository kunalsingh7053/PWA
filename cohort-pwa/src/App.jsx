import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem('metallic-fox-count')
    return saved ? parseInt(saved, 10) : 0
  })
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showInstallButton, setShowInstallButton] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [history, setHistory] = useState([0])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('metallic-fox-stats')
    return saved ? JSON.parse(saved) : { totalTaps: 0, maxCount: 0, sessions: 1 }
  })
  const audioRef = useRef(null)

  // Load stats
  useEffect(() => {
    localStorage.setItem('metallic-fox-count', count)
    setStats(prev => ({
      ...prev,
      totalTaps: prev.totalTaps + 1,
      maxCount: Math.max(prev.maxCount, count)
    }))
    localStorage.setItem('metallic-fox-stats', JSON.stringify(stats))
  }, [count])

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallButton(true)
    }
    window.addEventListener('beforeinstallprompt', handler)

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setShowInstallButton(false)
    })

    // Keyboard shortcuts
    const handleKeyPress = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault()
        increment()
      }
      if (e.code === 'ArrowDown') {
        e.preventDefault()
        decrement()
      }
      if (e.code === 'KeyR' && e.ctrlKey) {
        e.preventDefault()
        reset()
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setIsInstalled(true)
      }
      setDeferredPrompt(null)
      setShowInstallButton(false)
    }
  }

  const playSound = () => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    }
  }

  const increment = () => {
    const newCount = count + 1
    addToHistory(newCount)
    setCount(newCount)
    triggerAnimation()
    playSound()
  }

  const decrement = () => {
    const newCount = Math.max(0, count - 1)
    addToHistory(newCount)
    setCount(newCount)
    triggerAnimation()
    playSound()
  }

  const reset = () => {
    addToHistory(0)
    setCount(0)
    triggerAnimation()
    playSound()
  }

  const addToHistory = (newCount) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newCount)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setCount(history[newIndex])
      triggerAnimation()
      playSound()
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setCount(history[newIndex])
      triggerAnimation()
      playSound()
    }
  }

  const triggerAnimation = () => {
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const progressPercentage = Math.min((count / 1000) * 100, 100)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Audio Element for Sound Effects */}
      <audio ref={audioRef}>
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj==" type="audio/wav" />
      </audio>

      <div className="w-full max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Counter App
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Simple, powerful counting with undo/redo support
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 mb-8">
          
          {/* Counter Display */}
          <div className="mb-10">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-12 sm:p-16 text-center">
              <p className="text-blue-100 text-sm font-medium mb-5 uppercase tracking-wide">
                Current Count
              </p>
              <p className={`text-7xl sm:text-8xl md:text-9xl font-bold text-white tabular-nums transition-transform duration-200 ${isAnimating ? 'scale-105' : 'scale-100'}`}>
                {count.toLocaleString()}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mt-8 space-y-4">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-600">Progress to 1,000</span>
                <span className="text-blue-600 font-semibold">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-blue-600 h-full transition-all duration-500 rounded-full" 
                  style={{width: `${progressPercentage}%`}}
                ></div>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="space-y-8">
            {/* Main Actions Grid */}
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={decrement}
                aria-label="Decrease count (↓)"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-6 px-4 rounded-xl transition-colors duration-200 active:scale-95 text-3xl shadow-md hover:shadow-lg"
              >
                −
              </button>

              <button
                onClick={reset}
                aria-label="Reset count (Ctrl+R)"
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-6 px-4 rounded-xl transition-colors duration-200 active:scale-95 text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 1119.414 9.414 1 1 0 11-1.414-1.414A5.002 5.002 0 005.659 5.109V4a1 1 0 011-1H4z" clipRule="evenodd" />
                </svg>
                Reset
              </button>

              <button
                onClick={increment}
                aria-label="Increase count (Space/↑)"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 px-4 rounded-xl transition-colors duration-200 active:scale-95 text-3xl shadow-md hover:shadow-lg"
              >
                +
              </button>
            </div>

            {/* Secondary Actions Row */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                aria-label="Undo"
                className="bg-gray-700 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white disabled:text-gray-500 font-medium py-4 px-4 rounded-xl transition-colors duration-200 active:scale-95 shadow-md flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Undo
              </button>

              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                aria-label="Redo"
                className="bg-gray-700 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white disabled:text-gray-500 font-medium py-4 px-4 rounded-xl transition-colors duration-200 active:scale-95 shadow-md flex items-center justify-center gap-2"
              >
                Redo
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Sound Toggle & Install */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`font-medium py-4 px-4 rounded-xl transition-colors duration-200 active:scale-95 shadow-md flex items-center justify-center gap-2 ${
                  soundEnabled 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                    : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                }`}
              >
                {soundEnabled ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
                Sound {soundEnabled ? 'On' : 'Off'}
              </button>

              {showInstallButton && !isInstalled ? (
                <button
                  onClick={handleInstall}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-4 rounded-xl transition-colors duration-200 active:scale-95 shadow-md flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Install App
                </button>
              ) : isInstalled ? (
                <div className="bg-green-100 text-green-800 font-medium py-4 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Installed
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-2">Current</p>
            <p className="text-3xl font-bold text-gray-900">{count}</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-2">Max Count</p>
            <p className="text-3xl font-bold text-gray-900">{stats.maxCount}</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-2">Total Taps</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalTaps}</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-2">Sessions</p>
            <p className="text-3xl font-bold text-gray-900">{stats.sessions}</p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z"/>
              </svg>
              Auto-save
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
              Statistics
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              PWA Ready
            </span>
          </div>
          <p className="text-xs text-gray-500">
            <kbd className="px-2 py-1 bg-gray-200 rounded text-gray-700 font-mono">Space</kbd> or <kbd className="px-2 py-1 bg-gray-200 rounded text-gray-700 font-mono">↑</kbd> to increment • <kbd className="px-2 py-1 bg-gray-200 rounded text-gray-700 font-mono">↓</kbd> to decrement • <kbd className="px-2 py-1 bg-gray-200 rounded text-gray-700 font-mono">Ctrl+R</kbd> to reset
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
