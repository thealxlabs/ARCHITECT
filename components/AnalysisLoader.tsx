import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface AnalysisLoaderProps {
  /** Optional callback to cancel the analysis and return to input */
  onCancel?: () => void;
  /** Maximum seconds before showing a timeout warning (default: 60) */
  timeoutSeconds?: number;
}

const ANALYSIS_STEPS = [
  { id: 1, text: "Reading your code files...", duration: 2000 },
  { id: 2, text: "Understanding your project structure...", duration: 3000 },
  { id: 3, text: "Analyzing code quality...", duration: 4000 },
  { id: 4, text: "Checking for security issues...", duration: 5000 },
  { id: 5, text: "Identifying what's working well...", duration: 6000 },
  { id: 6, text: "Spotting areas to improve...", duration: 8000 },
  { id: 7, text: "Creating architecture diagrams...", duration: 10000 },
  { id: 8, text: "Writing your documentation...", duration: 15000 },
  { id: 9, text: "Almost done! Finishing up...", duration: 20000 }
];

const AnalysisLoader: React.FC<AnalysisLoaderProps> = ({ 
  onCancel, 
  timeoutSeconds = 60 
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);

  // Step progression animation
  useEffect(() => {
    let currentIndex = 0;
    let timeout: NodeJS.Timeout;

    const advanceStep = () => {
      if (currentIndex < ANALYSIS_STEPS.length) {
        setActiveStep(currentIndex);
        
        timeout = setTimeout(() => {
          setCompletedSteps(prev => [...prev, currentIndex]);
          currentIndex++;
          advanceStep();
        }, ANALYSIS_STEPS[currentIndex].duration);
      }
    };

    advanceStep();
    return () => { if (timeout) clearTimeout(timeout); };
  }, []);

  // Elapsed time counter + timeout detection
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(prev => {
        const next = prev + 1;
        if (next >= timeoutSeconds && !showTimeoutWarning) {
          setShowTimeoutWarning(true);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeoutSeconds, showTimeoutWarning]);

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Main spinner */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative mb-6">
            <Loader2 className="w-16 h-16 text-white animate-spin" />
            <div className="absolute inset-0 blur-xl bg-white/20 animate-pulse"></div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Analyzing Your Code</h2>
          <p className="text-zinc-400">This usually takes 10-30 seconds</p>
        </div>

        {/* Timeout warning */}
        {showTimeoutWarning && (
          <div className="mb-6 bg-amber-950/30 border border-amber-800/50 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-amber-300 font-medium text-sm">Taking longer than usual</p>
              <p className="text-amber-400/70 text-sm mt-1">
                The AI model might be under heavy load. You can keep waiting or cancel and try again.
              </p>
            </div>
          </div>
        )}

        {/* Progress steps */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 backdrop-blur">
          <div className="space-y-3">
            {ANALYSIS_STEPS.map((step, index) => (
              <div 
                key={step.id}
                className={`flex items-start gap-3 transition-all duration-300 ${
                  index === activeStep ? 'opacity-100' : 
                  completedSteps.includes(index) ? 'opacity-60' : 'opacity-30'
                }`}
              >
                <div className="mt-1">
                  {completedSteps.includes(index) ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : index === activeStep ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Clock className="w-5 h-5 text-zinc-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${
                    index === activeStep ? 'text-white font-medium' : 
                    completedSteps.includes(index) ? 'text-zinc-500' : 'text-zinc-600'
                  }`}>
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer: step counter, elapsed time, cancel button */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-zinc-500 text-sm">
            Step {Math.min(activeStep + 1, ANALYSIS_STEPS.length)} of {ANALYSIS_STEPS.length}
          </p>
          <p className="text-zinc-600 text-sm font-mono">
            {formatTime(elapsedSeconds)}
          </p>
        </div>

        {onCancel && (
          <div className="mt-4 text-center">
            <button
              onClick={onCancel}
              className="text-sm text-zinc-500 hover:text-white transition underline underline-offset-4"
            >
              Cancel analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisLoader;
