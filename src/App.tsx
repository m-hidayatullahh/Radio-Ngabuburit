import React, { useState, useRef, useEffect } from 'react';
import { Radio, Volume2, Volume1, VolumeX, Sun, Moon } from 'lucide-react';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Direct stream URL for RRI PRO 1 Mataram
  const streamUrl = "http://stream-node1.rri.co.id:9113/rrimatarampro1.mp3";
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  // Set up audio element and event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleCanPlay = () => {
      setIsLoading(false);
      if (isPlaying) {
        audio.play().catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
      }
    };
    
    const handleWaiting = () => {
      setIsLoading(true);
    };
    
    const handleError = (e: Event) => {
      console.error("Audio error:", e);
      setIsPlaying(false);
      setIsLoading(false);
    };
    
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('error', handleError);
    
    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('error', handleError);
    };
  }, [isPlaying]);
  
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      
      // Use a small timeout to prevent rapid play/pause actions
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          }).catch(error => {
            console.error("Error playing audio:", error);
            setIsPlaying(false);
            setIsLoading(false);
          });
        }
      }, 300);
    }
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  const VolumeIcon = () => {
    if (volume === 0) return <VolumeX className="text-primary" />;
    if (volume < 0.5) return <Volume1 className="text-primary" />;
    return <Volume2 className="text-primary" />;
  };
  
  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800'}`}>
      {/* Audio element with direct source */}
      <audio ref={audioRef} preload="auto">
        <source src={streamUrl} type="audio/mpeg" />
        Browser Anda tidak mendukung pemutaran audio.
      </audio>
      
      {/* Header */}
      <header className={`py-4 px-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur-sm'} shadow-md`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Radio size={24} className="text-primary" />
            <h1 className="text-xl font-bold">Radio Ngabuburit Lombok</h1>
          </div>
          <button 
            onClick={toggleTheme} 
            className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className={`w-full max-w-md p-8 rounded-2xl shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white/90 backdrop-blur-sm'}`}>
          <div className="flex flex-col items-center">
            {/* Radio station image */}
            <div className="w-48 h-48 rounded-full overflow-hidden mb-6 shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                alt="Radio Ngabuburit Lombok" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Station info */}
            <h2 className="text-2xl font-bold mb-1">PRO 1 RRI Mataram</h2>
            <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Radio Ngabuburit Lombok</p>
            
            {/* Player controls */}
            <div className="w-full">
              <button 
                onClick={togglePlayPause}
                disabled={isLoading}
                className={`w-full py-3 px-6 rounded-lg font-medium mb-4 transition-all ${
                  isDarkMode 
                    ? (isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700') 
                    : (isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-500 hover:bg-indigo-600')
                } text-white ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Memuat...' : (isPlaying ? 'Berhenti' : 'Putar')}
              </button>
              
              {/* Volume control */}
              <div className="flex items-center gap-3">
                <VolumeIcon />
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={volume} 
                  onChange={handleVolumeChange}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className={`py-4 px-6 ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white/80 backdrop-blur-sm text-gray-600'}`}>
        <div className="container mx-auto text-center text-sm">
          <p>© {new Date().getFullYear()} Radio Ngabuburit Lombok. Semua hak cipta dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;