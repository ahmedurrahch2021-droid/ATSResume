import React from 'react';
import { Sparkles, ShieldCheck, Globe, CheckCircle2, ArrowRight } from 'lucide-react';
import { TargetMarket } from '../types';

interface BangladeshInitiativeBannerProps {
  currentMarket: TargetMarket;
  onSelectMarket: (market: TargetMarket) => void;
  onLoadBangladeshSample: () => void;
  isAutoDetected?: boolean;
}

export const BangladeshInitiativeBanner: React.FC<BangladeshInitiativeBannerProps> = ({
  currentMarket,
  onSelectMarket,
  onLoadBangladeshSample,
  isAutoDetected = false
}) => {
  return (
    <div className="bg-emerald-900 text-white border-b border-emerald-800 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-700">
            🇧🇩
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-emerald-200 uppercase tracking-wider">
                Bangladesh Talent Initiative
              </span>
              <span className="text-[11px] bg-emerald-700/80 text-emerald-100 px-2 py-0.5 rounded font-mono font-medium">
                100% Free Forever Active
              </span>
            </div>
            <p className="text-xs text-emerald-100/90 mt-0.5 leading-snug">
              Empowering Bangladeshi talents to crack top local tech firms (bKash, Pathao, Brain Station 23) and global dollar remote jobs without paywalls.
            </p>
          </div>
        </div>

        {/* Market Switcher & Quick Action */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center bg-emerald-950/70 p-1 rounded-lg border border-emerald-700/60 text-xs">
            <button
              onClick={() => onSelectMarket('bangladesh')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                currentMarket === 'bangladesh'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              🇧🇩 BD Tech & Remote
            </button>
            <button
              onClick={() => onSelectMarket('global')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                currentMarket === 'global'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              🌐 Global / Europass
            </button>
            <button
              onClick={() => onSelectMarket('us_uk')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                currentMarket === 'us_uk'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              🇺🇸 US/UK Anti-Bias
            </button>
          </div>

          <button
            onClick={onLoadBangladeshSample}
            className="text-xs bg-white text-emerald-950 hover:bg-emerald-50 font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-sm shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Load BUET / BD Dev Template
          </button>
        </div>
      </div>
    </div>
  );
};
