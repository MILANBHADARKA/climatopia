"use client"
import React from 'react';
import { motion } from 'framer-motion';
import {

  ArrowUp,
  ArrowDown,

} from 'lucide-react';


export const PredictionCard = ({ endpoint, data }) => {
    const isIncrease = data?.value > 0;
    const changeColor = isIncrease ? 'text-emerald-600' : 'text-rose-600';
    const changeIcon = isIncrease ? <ArrowUp size={16} /> : <ArrowDown size={16} />;

    // Special handling for Adaptation Strategy
    if (endpoint.key === 'predict_adaptation') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full flex flex-col"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${endpoint.color} text-white`}>
              <endpoint.icon size={20} />
            </div>
            <h3 className="font-semibold text-gray-800">{endpoint.name}</h3>
          </div>

          <div className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                {data?.value}
              </div>
              <div className="text-sm text-gray-500 mt-2">Recommended Approach</div>
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full"
      >
        <div className="flex items-start justify-between h-full">
          <div>
            <div className={`p-3 rounded-xl bg-gradient-to-r ${endpoint.color} text-white inline-block mb-4`}>
              <endpoint.icon size={20} />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">{endpoint.name}</h3>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {typeof data?.value === 'number' ? data.value.toFixed(2) : data?.value}
              <span className="text-lg text-gray-500 ml-1">{endpoint.unit}</span>
            </div>
            <div className={`text-sm ${changeColor} flex items-center`}>
              {changeIcon}
              <span className="ml-1">
                {Math.abs(data?.value)}{endpoint.unit} {isIncrease ? 'increase' : 'decrease'}
              </span>
            </div>
          </div>
          <div className="relative w-20 h-20">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * Math.min(100, Math.abs(data?.value))) / 100}
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ strokeDashoffset: 283 }}
                animate={{ strokeDashoffset: 283 - (283 * Math.min(100, Math.abs(data?.value))) / 100 }}
                transition={{ duration: 1 }}
                className={isIncrease ? 'stroke-emerald-500' : 'stroke-rose-500'}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-sm font-medium ${isIncrease ? 'text-emerald-600' : 'text-rose-600'}`}>
                {Math.min(100, Math.abs(data?.value))}%
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };