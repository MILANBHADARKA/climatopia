"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  TrendingUp,
  Zap,
  Droplets,
  Thermometer,
  Wheat,
  Shield,
  Send,
  Loader2,
  BarChart3,
  Activity,
  Sparkles,
  Gauge,
  Leaf,
  Sun,
  CloudRain
} from 'lucide-react';
import axios from 'axios';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const EarthSimAI = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);

  const apiEndpoints = [
    {
      name: 'Economic Impact',
      url: process.env.NEXT_PUBLIC_ECONOMIC_API,
      icon: TrendingUp,
      color: 'from-green-400 to-emerald-600',
      key: 'predict_economic_impact',
      unit: "USD",
      category: 'economic'
    },
    {
      name: 'Crop Prediction',
      url: process.env.NEXT_PUBLIC_CROP_API,
      icon: Wheat,
      color: 'from-amber-400 to-orange-600',
      key: 'predict_croprate',
      unit: "tons/ha",
      category: 'agriculture'
    },
    {
      name: 'Electricity Prediction',
      url: process.env.NEXT_PUBLIC_ELECTRICITY_API,
      icon: Zap,
      color: 'from-yellow-400 to-orange-500',
      key: 'predict_electricity',
      unit: "GW",
      category: 'energy'
    },
    {
      name: 'Adaptation Prediction',
      url: process.env.NEXT_PUBLIC_ADAPTION_API,
      icon: Shield,
      color: 'from-blue-400 to-cyan-600',
      key: 'predict_adaptation',
      unit: "",
      category: 'resilience'
    },
    {
      name: 'Temperature Graph',
      url: process.env.NEXT_PUBLIC_TEMP_GRAPH_API,
      icon: Thermometer,
      color: 'from-red-400 to-pink-600',
      key: 'temperature-graph',
      category: 'climate'
    },
    {
      name: 'Temperature Prediction',
      url: process.env.NEXT_PUBLIC_TEMP_PREDICT_API,
      icon: Activity,
      color: 'from-red-400 to-rose-600',
      key: 'temperature_prediction',
      unit: "°C",
      category: 'climate'
    },
    {
      name: 'Humidity Prediction',
      url: process.env.NEXT_PUBLIC_HUMIDITY_API,
      icon: Droplets,
      color: 'from-blue-400 to-indigo-600',
      key: 'humidity_prediction',
      unit: "%",
      category: 'climate'
    }
  ];

  // Group endpoints by category
  const groupedEndpoints = {
    climate: apiEndpoints.filter(e => e.category === 'climate'),
    economic: apiEndpoints.filter(e => e.category === 'economic'),
    energy: apiEndpoints.filter(e => e.category === 'energy'),
    agriculture: apiEndpoints.filter(e => e.category === 'agriculture'),
    resilience: apiEndpoints.filter(e => e.category === 'resilience')
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setResults(null);
    setGeneratedImage(null);

    try {
      // Your existing API call logic...
      // Simulate API calls to all endpoints
      const apiPromises = apiEndpoints.map(async (endpoint) => {
        // Simulate API call with random data
        if (endpoint.key === "predict_economic_impact") {
          const api = await axios.post(`${endpoint.url}/${endpoint.key}`, {
            scenario: prompt
          },
            {
              headers: {
                "Content-Type": "application/json"
              }
            });
          const data = api.data;

          return {
            type: 'prediction',
            value: data.predicted_economic_impact_million_usd
          }

        } else if (endpoint.key === "predict_croprate") {
          const api = await axios.post(`${endpoint.url}/${endpoint.key}`, {
            scenario: prompt
          }
          );
          const data = api.data;

          return {
            type: 'prediction',
            value: data.result.llm_predicted_crop_yield
          }
        } else if (endpoint.key === "predict_electricity") {
          const today = new Date();
          const formattedDate = today.toISOString().split('T')[0];
          console.log(formattedDate.toString);
          const api = await axios.post(`${endpoint.url}/${endpoint.key}`, {
            start_time: formattedDate.toString()
          });
          const data = api.data;

          return {
            type: 'graph',
            value: JSON.parse(data)
          }
        } else if (endpoint.key === 'predict_adaptation') {
          const api = await axios.post(`${endpoint.url}/${endpoint.key}?scenario=${prompt}`);
          const data = api.data;

          return {
            type: 'prediction',
            value: data.predicted_adaptation_strategy
          }

        } else if (endpoint.key === "temperature_prediction") {
          const api = await axios.post(`${endpoint.url}/${endpoint.key}?scenario=${prompt}`);
          const data = api.data;

          return {
            type: 'prediction',
            value: data.prediction.Temperature
          }
        }
        else if (endpoint.key === "humidity_prediction") {
          // Mock prediction data
          const api = await axios.post(`${endpoint.url}/${endpoint.key}?scenario=${prompt}`);
          const data = api.data;

          return {
            type: 'prediction',
            value: data.prediction.predicted_humidity
          }
        } else if (endpoint.key === "temperature-graph") {
          const api = await axios.post(`${endpoint.url}/${endpoint.key}`);
          const data = api.data;

          return {
            type: 'graph',
            value: JSON.parse(data.prediction.plotly)
          }
        }
      });

      const apiResults = await Promise.all(apiPromises);
      const resultsMap = {};

      apiEndpoints.forEach((endpoint, index) => {
        resultsMap[endpoint.key] = apiResults[index];
      });

      setResults(resultsMap);

      // Simulate image generation
      setTimeout(() => {
        setGeneratedImage(`https://picsum.photos/600/400?random=${Date.now()}`);
      }, 1500);

    } catch (error) {
      console.error('Error calling APIs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const ClimateSummaryCard = ({ data }) => {
    if (!results) return null;
    
    const tempData = results['temperature_prediction'];
    const humidityData = results['humidity_prediction'];
    const tempGraphData = results['temperature-graph'];

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 col-span-2"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-400 to-indigo-600 text-white">
            <Thermometer size={24} />
          </div>
          <h3 className="font-semibold text-gray-800">Climate Summary</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Temperature and Humidity Indicators */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 border border-red-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-red-600">Temperature</span>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                  {tempData?.value?.toFixed(1)}°C
                </span>
              </div>
              <div className="relative h-3 bg-red-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.abs(tempData?.value) * 10)}%` }}
                  transition={{ duration: 1 }}
                  className="absolute h-full bg-gradient-to-r from-red-400 to-pink-500 rounded-full"
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-600">Humidity</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {humidityData?.value?.toFixed(1)}%
                </span>
              </div>
              <div className="relative h-3 bg-blue-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.abs(humidityData?.value))}%` }}
                  transition={{ duration: 1 }}
                  className="absolute h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-100">
                <div className="text-xs text-purple-600 mb-1">Pressure</div>
                <div className="text-xl font-bold text-purple-800">1,012 hPa</div>
                <div className="text-xs text-purple-500 mt-1">Normal range</div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                <div className="text-xs text-amber-600 mb-1">Wind Speed</div>
                <div className="text-xl font-bold text-amber-800">12 km/h</div>
                <div className="text-xs text-amber-500 mt-1">Moderate</div>
              </div>
            </div>
          </div>

          {/* Temperature Graph */}
          <div className="h-full">
            {tempGraphData?.value ? (
              <Plot
                data={tempGraphData.value.data}
                layout={{
                  ...tempGraphData.value.layout,
                  autosize: true,
                  margin: { l: 40, r: 30, b: 40, t: 30, pad: 4 },
                  height: 300
                }}
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

  const PredictionCard = ({ endpoint, data }) => {
    const change = data.value > 0 ? 'increase' : 'decrease';
    const changeColor = data.value > 0 ? 'text-green-600' : 'text-red-600';
    const changeIcon = data.value > 0 ? '↑' : '↓';

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full"
      >
        <div className="flex items-start justify-between h-full">
          <div>
            <div className={`p-3 rounded-xl bg-gradient-to-r ${endpoint.color} text-white inline-block mb-4`}>
              <endpoint.icon size={24} />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">{endpoint.name}</h3>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {typeof data.value === 'number' ? data.value.toFixed(2) : data.value}
              <span className="text-lg text-gray-500 ml-1">{endpoint.unit}</span>
            </div>
            <div className={`text-sm ${changeColor}`}>
              {changeIcon} {Math.abs(data.value)}{endpoint.unit} {change}
            </div>
          </div>
          <div className="relative w-24 h-24">
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
                strokeDashoffset={283 - (283 * Math.min(100, Math.abs(data.value))) / 100}
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ strokeDashoffset: 283 }}
                animate={{ strokeDashoffset: 283 - (283 * Math.min(100, Math.abs(data.value))) / 100 }}
                transition={{ duration: 1 }}
                className={`${data.value > 0 ? 'stroke-green-500' : 'stroke-red-500'}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-medium text-gray-700">
                {Math.min(100, Math.abs(data.value))}%
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const GraphCard = ({ endpoint, data }) => {
    const plotlyData = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 col-span-2"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${endpoint.color} text-white`}>
            <endpoint.icon size={24} />
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
                margin: { l: 50, r: 50, b: 50, t: 50, pad: 4 },
              }}
              useResizeHandler={true}
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <BarChart3 size={48} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Loading chart data...</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
                <Globe size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EarthSim.AI
                </h1>
                <p className="text-sm text-gray-600">Climate Simulation Engine</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="text-yellow-500" size={20} />
              <span className="text-sm font-medium text-gray-700">Powered by AI</span>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Simulate Climate Impact
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Enter your climate scenario and get comprehensive predictions across multiple environmental and economic factors
              </p>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your climate scenario... (e.g., 'Deploy 5000 solar units in South Asia by 2030 and analyze the environmental and economic impact')"
                  rows={4}
                  className="w-full p-6 bg-white rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none text-gray-700 placeholder-gray-400 shadow-lg"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={isLoading || !prompt.trim()}
                  className="absolute bottom-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Simulate</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loading Animation */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-4xl mx-auto mb-12"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <Globe className="animate-spin text-blue-600" size={48} />
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Processing Your Scenario</h3>
                  <p className="text-gray-600 mb-6">Analyzing climate data across multiple prediction models...</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {apiEndpoints.map((endpoint, index) => (
                      <motion.div
                        key={endpoint.key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 rounded-xl p-4 flex items-center space-x-3"
                      >
                        <endpoint.icon className="text-gray-400" size={20} />
                        <span className="text-sm text-gray-600">{endpoint.name}</span>
                        <Loader2 className="animate-spin text-blue-500 ml-auto" size={16} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <AnimatePresence>
          {results && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Generated Image */}
              {generatedImage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="max-w-4xl mx-auto"
                >
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <Sparkles className="mr-2 text-yellow-500" />
                      AI Generated Visualization
                    </h3>
                    <div className="rounded-xl overflow-hidden">
                      <img
                        src={generatedImage}
                        alt="AI Generated Climate Scenario"
                        className="w-full h-96 object-cover"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Predictions Grid */}
              <div className="max-w-7xl mx-auto">
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-2xl font-bold text-gray-800 mb-6 text-center"
                >
                  Climate Impact Analysis
                </motion.h3>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Climate Summary Card (2 columns) */}
                  <ClimateSummaryCard />

                  {/* Economic Impact Card */}
                  {results['predict_economic_impact'] && (
                    <PredictionCard 
                      endpoint={apiEndpoints.find(e => e.key === 'predict_economic_impact')} 
                      data={results['predict_economic_impact']} 
                    />
                  )}

                  {/* Electricity Graph (2 columns) */}
                  {results['predict_electricity'] && (
                    <GraphCard 
                      endpoint={apiEndpoints.find(e => e.key === 'predict_electricity')} 
                      data={results['predict_electricity']} 
                    />
                  )}

                  {/* Crop Prediction Card */}
                  {results['predict_croprate'] && (
                    <PredictionCard 
                      endpoint={apiEndpoints.find(e => e.key === 'predict_croprate')} 
                      data={results['predict_croprate']} 
                    />
                  )}

                  {/* Adaptation Prediction Card */}
                  {results['predict_adaptation'] && (
                    <PredictionCard 
                      endpoint={apiEndpoints.find(e => e.key === 'predict_adaptation')} 
                      data={results['predict_adaptation']} 
                    />
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EarthSimAI;