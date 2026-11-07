/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CalculationMode, CalculationResult } from './types';
import { calculateMobileLoad, formatPKR } from './utils/calculator';
import { Check } from 'lucide-react';

export default function App() {
  // Option 1: 'required_load' ("I want to receive a specific balance.")
  // Option 2: 'actual_balance' ("I want to calculate balance from my load amount.")
  const [mode, setMode] = useState<CalculationMode>('actual_balance');
  const [amountInput, setAmountInput] = useState<string>('100');

  // Calculated result state (initially calculated with default 100)
  const [result, setResult] = useState<CalculationResult>(() => {
    return calculateMobileLoad(100, 'actual_balance');
  });

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const numeric = parseFloat(amountInput) || 0;
    const res = calculateMobileLoad(numeric, mode);
    setResult(res);
  };

  const handleModeChange = (newMode: CalculationMode) => {
    setMode(newMode);
    const numeric = parseFloat(amountInput) || 0;
    setResult(calculateMobileLoad(numeric, newMode));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-emerald-100 selection:text-emerald-900">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        {/* App Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-emerald-700 text-white font-black text-xl shadow-xs mb-3">
            ₨
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            Pakistan Load Calculator
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fast, clean mobile balance and tax calculation
          </p>
        </div>

        {/* 1. Two Calculation Options */}
        <div className="space-y-2 mb-5">
          <button
            type="button"
            onClick={() => handleModeChange('actual_balance')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              mode === 'actual_balance'
                ? 'border-emerald-700 bg-emerald-50/60 text-emerald-950 font-semibold'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
            }`}
          >
            <span className="text-xs sm:text-sm">
              I want to calculate balance from my load amount
            </span>
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ml-3 transition-colors ${
                mode === 'actual_balance'
                  ? 'bg-emerald-700 text-white'
                  : 'border-2 border-slate-300'
              }`}
            >
              {mode === 'actual_balance' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('required_load')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              mode === 'required_load'
                ? 'border-emerald-700 bg-emerald-50/60 text-emerald-950 font-semibold'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
            }`}
          >
            <span className="text-xs sm:text-sm">
              I want to receive a specific balance
            </span>
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ml-3 transition-colors ${
                mode === 'required_load'
                  ? 'bg-emerald-700 text-white'
                  : 'border-2 border-slate-300'
              }`}
            >
              {mode === 'required_load' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </button>
        </div>

        {/* Form with 2. One Input Field & 3. One Calculate Button */}
        <form onSubmit={handleCalculate} className="space-y-4">
          <div>
            <label
              htmlFor="amount-field"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              {mode === 'actual_balance'
                ? 'Mobile Load Amount'
                : 'Desired Balance'}
            </label>
            <div className="flex items-center rounded-xl bg-slate-50 border-2 border-slate-200 focus-within:border-emerald-700 focus-within:bg-white transition-all px-4 py-3">
              <span className="text-lg font-bold text-emerald-800 select-none mr-2">
                Rs.
              </span>
              <input
                id="amount-field"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder="100"
                value={amountInput}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9.]/g, '');
                  const parts = val.split('.');
                  if (parts.length > 2) return;
                  setAmountInput(val);
                }}
                className="w-full bg-transparent text-2xl font-bold text-slate-900 focus:outline-none font-mono-numbers"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold text-sm sm:text-base transition-all shadow-sm shadow-emerald-700/20 cursor-pointer"
          >
            Calculate
          </button>
        </form>

        {/* 4. Display Only Three Results */}
        <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs font-semibold text-slate-600">
              Load Amount
            </span>
            <span className="text-sm font-bold text-slate-900 font-mono-numbers">
              {formatPKR(result.loadAmount)}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs font-semibold text-slate-600">
              Tax Deducted
            </span>
            <span className="text-sm font-bold text-rose-600 font-mono-numbers">
              {formatPKR(result.taxDeducted)}
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 border border-emerald-300">
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
              Actual Balance Received
            </span>
            <span className="text-base sm:text-lg font-black text-emerald-800 font-mono-numbers">
              {formatPKR(result.actualBalance)}
            </span>
          </div>
        </div>

        {/* Footer Credit */}
        <div className="mt-6 pt-4 text-center border-t border-slate-100 text-xs font-medium text-slate-400">
          By Hamza Saif
        </div>
      </div>
    </div>
  );
}
