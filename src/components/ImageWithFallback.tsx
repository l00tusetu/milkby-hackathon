import React, { useState, useEffect } from 'react';
import { Milk } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  fallbackSrc,
  alt,
  className = '',
  fallbackTitle,
}) => {
  const [step, setStep] = useState<'primary' | 'fallback' | 'error'>(() =>
  src ? 'primary' : fallbackSrc ? 'fallback' : 'error'
  );

  useEffect(() => {
    setStep(src ? 'primary' : fallbackSrc ? 'fallback' : 'error');
  }, [src, fallbackSrc]);

  const activeSrc = step === 'primary' ? src : step === 'fallback' ? fallbackSrc || '' : '';

  if (step === 'error' || !activeSrc) {
    return (
      <div
      className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50/50 text-slate-400 p-4 text-center ${className}`}
      role="img"
      aria-label={alt}
      >
      <Milk className="w-8 h-8 text-[#0057B8]/40 mb-2" strokeWidth={1.5} />
      {fallbackTitle && (
        <span className="text-xs font-medium text-slate-500 max-w-[18ch] truncate">
        {fallbackTitle}
        </span>
      )}
      </div>
    );
  }

  return (
    <img
    src={activeSrc}
    alt={alt}
    referrerPolicy="no-referrer"
    loading="lazy"
    onError={() => {
      if (step === 'primary' && fallbackSrc && fallbackSrc !== src) {
        setStep('fallback');
      } else {
        setStep('error');
      }
    }}
    className={className}
    />
  );
};
