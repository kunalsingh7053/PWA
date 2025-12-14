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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-orange-900 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden">
      {/* Audio Element for Sound Effects */}
      <audio ref={audioRef}>
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj==" type="audio/wav" />
      </audio>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-yellow-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="mb-6 space-y-2">
            <p className="text-orange-400 text-sm font-semibold uppercase tracking-widest opacity-80">Professional Counter</p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-red-300 to-orange-200 tracking-tight">
              Metallic Fox
            </h1>
            <p className="text-orange-200/80 text-base sm:text-lg font-light tracking-wide">
              Advanced counting application with statistics
            </p>
          </div>
          <div className="flex justify-center gap-2">
            <div className="h-1 w-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
            <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full opacity-50"></div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-gradient-to-b from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 md:p-12 mb-6 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-500">
          
          {/* Counter Display with Progress Bar */}
          <div className="mb-12">
            <div className={`relative bg-gradient-to-br from-orange-600 via-red-600 to-orange-700 rounded-3xl p-10 sm:p-12 md:p-16 transition-all duration-300 overflow-hidden group ${isAnimating ? 'scale-105 shadow-2xl' : 'shadow-xl'}`}>
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
              
              <div className="relative z-10 text-center">
                <p className="text-gray-100 text-xs sm:text-sm font-bold mb-3 uppercase tracking-widest opacity-90 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  Current Count
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                </p>
                <p className={`text-7xl sm:text-8xl md:text-9xl font-black text-white tabular-nums transition-all duration-300 drop-shadow-lg ${isAnimating ? 'scale-110' : 'scale-100'}`}>
                  {count.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs sm:text-sm font-medium">
                <span className="text-gray-400">Progress to 1000</span>
                <span className="text-orange-400">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden border border-orange-500/20">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all duration-500 rounded-full shadow-lg" 
                  style={{width: `${progressPercentage}%`}}
                ></div>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="space-y-6">
            {/* Main Actions Grid */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <button
                onClick={decrement}
                aria-label="Decrease count (↓)"
                className="group relative bg-gradient-to-b from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black py-5 sm:py-6 px-3 rounded-2xl transition-all duration-200 transform hover:scale-110 active:scale-95 text-3xl sm:text-4xl shadow-xl hover:shadow-red-500/50 border border-red-500/40 hover:border-red-500/70"
              >
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-15 rounded-2xl transition-opacity"></span>
                −
              </button>

              <button
                onClick={reset}
                aria-label="Reset count (Ctrl+R)"
                className="group relative bg-gradient-to-b from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-5 sm:py-6 px-3 rounded-2xl transition-all duration-200 transform hover:scale-110 active:scale-95 text-sm sm:text-base shadow-xl hover:shadow-gray-600/50 border border-gray-600/40 hover:border-gray-600/70 flex items-center justify-center gap-1"
              >
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-15 rounded-2xl transition-opacity"></span>
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 1119.414 9.414 1 1 0 11-1.414-1.414A5.002 5.002 0 005.659 5.109V4a1 1 0 011-1H4z" clipRule="evenodd" />
                </svg>
                Reset
              </button>

              <button
                onClick={increment}
                aria-label="Increase count (Space/↑)"
                className="group relative bg-gradient-to-b from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white font-black py-5 sm:py-6 px-3 rounded-2xl transition-all duration-200 transform hover:scale-110 active:scale-95 text-3xl sm:text-4xl shadow-xl hover:shadow-orange-500/50 border border-orange-500/40 hover:border-orange-500/70"
              >
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-15 rounded-2xl transition-opacity"></span>
                +
              </button>
            </div>

            {/* Secondary Actions Row */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                aria-label="Undo"
                className="group relative bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 sm:py-4 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-500/50 border border-blue-500/40 hover:border-blue-500/70 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 001.414 1.414L9.414 12.414l2.293 2.293a1 1 0 001.414-1.414l-4-4a1 1 0 00-1.414 0z" clipRule="evenodd" />
                </svg>
                Undo
              </button>

              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                aria-label="Redo"
                className="group relative bg-gradient-to-b from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 sm:py-4 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-green-500/50 border border-green-500/40 hover:border-green-500/70 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Redo
              </button>
            </div>

            {/* Sound Toggle & Install */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`group relative text-white font-semibold py-3 sm:py-4 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg border flex items-center justify-center gap-2 text-sm sm:text-base ${
                  soundEnabled 
                    ? 'bg-gradient-to-b from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 hover:shadow-purple-500/50 border-purple-500/40 hover:border-purple-500/70' 
                    : 'bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 hover:shadow-gray-600/50 border-gray-500/40 hover:border-gray-500/70'
                }`}
              >
                {soundEnabled ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4a1 1 0 012 0v12a1 1 0 11-2 0V4z" />
                    <path d="M4 8a1 1 0 012 0v4a1 1 0 11-2 0V8z" />
                    <path d="M14 7a1 1 0 012 0v6a1 1 0 11-2 0V7z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M13.414 5.414a2 2 0 00-2.828 0L9.172 7.172a2 2 0 101.414 1.414l1.414-1.414a2 2 0 002.828-2.828z" clipRule="evenodd" />
                  </svg>
                )}
                Sound
              </button>

              {showInstallButton && !isInstalled ? (
                <button
                  onClick={handleInstall}
                  className="group relative bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-gray-900 font-bold py-3 sm:py-4 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-yellow-500/50 border border-yellow-300/50 hover:border-yellow-300/80 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  Install
                </button>
              ) : isInstalled ? (
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 sm:py-4 px-4 rounded-xl text-center text-sm sm:text-base shadow-lg border border-green-500/30 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Installed
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 group hover:scale-105">
            <p className="text-gray-500 text-xs sm:text-sm font-semibold uppercase tracking-wide mb-2">Current</p>
            <p className="text-3xl sm:text-4xl font-black text-orange-400 group-hover:text-orange-300 transition-colors">{count}</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-red-500/20 hover:border-red-500/40 transition-all duration-300 group hover:scale-105">
            <p className="text-gray-500 text-xs sm:text-sm font-semibold uppercase tracking-wide mb-2">Max Count</p>
            <p className="text-3xl sm:text-4xl font-black text-red-400 group-hover:text-red-300 transition-colors">{stats.maxCount}</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 group hover:scale-105">
            <p className="text-gray-500 text-xs sm:text-sm font-semibold uppercase tracking-wide mb-2">Total Taps</p>
            <p className="text-3xl sm:text-4xl font-black text-blue-400 group-hover:text-blue-300 transition-colors">{stats.totalTaps}</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group hover:scale-105">
            <p className="text-gray-500 text-xs sm:text-sm font-semibold uppercase tracking-wide mb-2">Sessions</p>
            <p className="text-3xl sm:text-4xl font-black text-purple-400 group-hover:text-purple-300 transition-colors">{stats.sessions}</p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center space-y-2">
          <p className="text-orange-200 text-sm sm:text-base font-medium">
            🦊 Professional Metallic Fox Counter
          </p>
          <p className="text-xs sm:text-sm text-orange-300/70 flex items-center justify-center gap-2 flex-wrap">
            <span>💾 Auto-save</span>
            <span>•</span>
            <span>⌨️ Keyboard shortcuts</span>
            <span>•</span>
            <span>📊 Statistics tracking</span>
          </p>
          <p className="text-xs text-gray-500 mt-3">
            Space/↑ to increment • ↓ to decrement • Ctrl+R to reset
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
