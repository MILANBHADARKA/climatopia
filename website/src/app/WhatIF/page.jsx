'use client';

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
  Sparkles
} from 'lucide-react';
import axios from 'axios';

const EarthSimAI = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const apiEndpoints = [
    {
      name: 'Economic Impact',
      url: process.env.NEXT_PUBLIC_ECONOMIC_API,
      icon: TrendingUp,
      color: 'from-green-400 to-emerald-600',
      key: 'predict_economic_impact'
    },
    {
      name: 'Crop Prediction',
      url: process.env.NEXT_PUBLIC_CROP_API,
      icon: Wheat,
      color: 'from-amber-400 to-orange-600',
      key: 'predict_croprate'
    },
    {
      name: 'Electricity Prediction',
      url: process.env.NEXT_PUBLIC_ELECTRICITY_API,
      icon: Zap,
      color: 'from-yellow-400 to-orange-500',
      key: 'predict_electricity'
    },
    {
      name: 'Adaptation Prediction',
      url: process.env.NEXT_PUBLIC_ADAPTION_API,
      icon: Shield,
      color: 'from-blue-400 to-cyan-600',
      key: 'predict_adaptation'
    },
    {
      name: 'Temperature Graph',
      url: process.env.NEXT_PUBLIC_TEMP_GRAPH_API,
      icon: Thermometer,
      color: 'from-red-400 to-pink-600',
      key: 'temperature-graph'
    },
    {
      name: 'Temperature Prediction',
      url: process.env.NEXT_PUBLIC_TEMP_PREDICT_API,
      icon: Activity,
      color: 'from-red-400 to-rose-600',
      key: 'temperature_prediction'
    },
    {
      name: 'Humidity Prediction',
      url: process.env.NEXT_PUBLIC_HUMIDITY_API,
      icon: Droplets,
      color: 'from-blue-400 to-indigo-600',
      key: 'humidity_prediction'
    }
  ];

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setResults(null);
    setGeneratedImage(null);

    try {
      // Simulate API calls to all endpoints
      const apiPromises = apiEndpoints.map(async (endpoint) => {
        // Simulate API call with random data


        if (endpoint.key === "predict_economic_impact") {
          const form = new FormData()
          form.append("scenario", prompt)
          const api = await axios.post(`${endpoint.url}/${endpoint.key}`, form);
          const data = api.data;

          return {
            type: 'prediction',
            value: data.predicted_economic_impact_million_usd
          }

        } else if (endpoint.key === "predict_croprate") {
          const form = new FormData()
          form.append("scenario", prompt)
          const api = await axios.post(`${endpoint.url}/${endpoint.key}`, form);
          const data = api.data;

          return {
            type: 'prediction',
            value: data.result.llm_predicted_crop_yield
          }
        } else if (endpoint.key === "predict_electricity") {
          const today = new Date();
          const formattedDate = today.toISOString().split('T')[0];
          const form = new FormData()
          form.append("start_time", formattedDate.toString())
          const api = await axios.post(`${endpoint.url}/${endpoint.key}`, form);
          const data = api.data;

          return {
            type: 'graph',
            value: data
          }
        }else if (endpoint.key === 'predict_adaptation') {
          // Mock Plotly graph data
          const api = await axios.post(`${endpoint.url}/${endpoint.key}`);
          const data = api.data;

          return {
            type: 'graph',
            value: data
          }
          
        } else if (endpoint.key === "/predict_electricity") {

        }
        else {
          // Mock prediction data
          return {
            type: 'prediction',
            value: Math.random() * 100,
            confidence: Math.random() * 30 + 70,
            trend: Math.random() > 0.5 ? 'up' : 'down',
            impact: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)]
          };
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

  const PredictionCard = ({ endpoint, data }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${endpoint.color} text-white`}>
            <endpoint.icon size={24} />
          </div>
          <h3 className="font-semibold text-gray-800">{endpoint.name}</h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${data.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
          {data.impact}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Prediction Value</span>
            <span>{data.value.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.value}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-2 rounded-full bg-gradient-to-r ${endpoint.color}`}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Confidence</span>
            <span>{data.confidence.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.confidence}%` }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );

  const GraphCard = ({ endpoint, data }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 col-span-2"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${endpoint.color} text-white`}>
          <endpoint.icon size={24} />
        </div>
        <h3 className="font-semibold text-gray-800">{data.title}</h3>
      </div>

      <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <BarChart3 size={48} className="text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Interactive Chart Visualization</p>
          <p className="text-sm text-gray-500 mt-1">Plotly Graph Integration</p>
        </div>
      </div>
    </motion.div>
  );

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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {apiEndpoints.map((endpoint, index) => {
                    const data = results[endpoint.key];

                    if (data.type === 'graph') {
                      return (
                        <GraphCard
                          key={endpoint.key}
                          endpoint={endpoint}
                          data={data}
                        />
                      );
                    } else {
                      return (
                        <motion.div
                          key={endpoint.key}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <PredictionCard endpoint={endpoint} data={data} />
                        </motion.div>
                      );
                    }
                  })}
                </div>
              </div>

              {/* Summary Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="max-w-4xl mx-auto"
              >
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Activity className="mr-2 text-blue-600" />
                    Impact Summary
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
                      <div className="text-sm text-gray-600">Positive Environmental Impact</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">92%</div>
                      <div className="text-sm text-gray-600">Model Confidence</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">7.2B</div>
                      <div className="text-sm text-gray-600">Economic Value ($)</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EarthSimAI;