"use client"
import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
} from 'lucide-react';

import dynamic from 'next/dynamic';


const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export const EnergyGraphCard = ({ endpoint, data }) => {
    const plotlyData = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 col-span-2"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${endpoint.color} text-white`}>
            <endpoint.icon size={20} />
          </div>
          <h3 className="font-semibold text-gray-800">{endpoint.name}</h3>
        </div>

        <div className="h-80">
          {plotlyData ? (
            <Plot
              data={plotlyData.data}
              layout={{
                ...plotlyData.layout,
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
                <p className="text-gray-600">Loading energy data...</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };