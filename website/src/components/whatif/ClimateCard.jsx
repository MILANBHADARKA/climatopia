"use client"
import React from 'react';
import { motion } from 'framer-motion';
import {
  Thermometer,
  BarChart3,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

import dynamic from 'next/dynamic';



const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export const ClimateSummaryCard = ({results}) => {
    if (!results) return null;

    const tempData = results['temperature_prediction'];
    const humidityData = results['humidity_prediction'];
    const tempGraphData = results['temperature-graph'];
    const ozoneData = results['ozone_prediction'];

    console.log('Climate Summary Card Results:', results);
    console.log('Temperature Data:', tempData);
    console.log('Humidity Data:', humidityData);
    console.log('Temperature Graph Data:', tempGraphData);
    console.log('Ozone Data:', ozoneData);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 col-span-2"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white">
            <Thermometer size={24} />
          </div>
          <h3 className="font-semibold text-gray-800 text-xl">Climate Overview</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Climate Indicators */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-5 border border-red-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-red-600">Temperature</span>
                <span className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full flex items-center">
                  {tempData?.value > 0 ? <ArrowUp size={16} className="mr-1" /> : <ArrowDown size={16} className="mr-1" />}
                  {tempData?.value?.toFixed(4)}°C
                </span>
              </div>
              <div className="relative h-2 bg-red-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.abs(tempData?.value) * 10)}%` }}
                  transition={{ duration: 1 }}
                  className="absolute h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full"
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-blue-600">Humidity</span>
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {humidityData?.value?.toFixed(4)}%
                </span>
              </div>
              <div className="relative h-2 bg-blue-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.abs(humidityData?.value))}%` }}
                  transition={{ duration: 1 }}
                  className="absolute h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
                />
              </div>
            </div>

            {ozoneData && (
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-5 border border-purple-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-purple-600">Ozone Impact</span>
                  <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                    {ozoneData.value?.toFixed(4)} DU
                  </span>
                </div>
                <div className="relative h-2 bg-purple-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Math.abs(ozoneData.value) / 100)}%` }}
                    transition={{ duration: 1 }}
                    className="absolute h-full bg-gradient-to-r from-purple-400 to-violet-500 rounded-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Temperature Graph - Wider */}
          <div className="lg:col-span-2 h-full">
            {tempGraphData?.value ? (
              <Plot
                data={tempGraphData.value.data}
                layout={{
                  ...tempGraphData.value.layout,
                  autosize: true,
                  margin: { l: 60, r: 30, b: 60, t: 30, pad: 4 },
                  height: 300,
                  plot_bgcolor: 'rgba(0,0,0,0)',
                  paper_bgcolor: 'rgba(0,0,0,0)',
                  font: { family: 'Inter, sans-serif', color: '#4b5563' },
                  xaxis: { gridcolor: 'rgba(0,0,0,0.05)' },
                  yaxis: { gridcolor: 'rgba(0,0,0,0.05)' }
                }}
                config={{ displayModeBar: false }}
                useResizeHandler={true}
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 size={48} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Loading climate data...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  
