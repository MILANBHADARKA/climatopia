"use client"
import React, { useEffect, useState } from 'react';
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
  ArrowUp,
  ArrowDown,
  Share2,
  Bookmark,
  Trophy,
  CreditCard
} from 'lucide-react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useAuth, useUser } from '@clerk/nextjs';
import useCredit from '../../providers/UserCredit';
import { useRouter } from 'next/navigation';
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const EarthSimAI = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);

  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const [score, setScore] = useState(null);
  const { userCredits, setUserCredits } = useCredit()

  const router = useRouter()

  useEffect(() => {
    if (isSignedIn && user) {
      fetchUserCredits()
    }
  }, [isSignedIn, user])

  const fetchUserCredits = async () => {
    try {
      const res = await fetch('/api/user/credits')
      if (res.ok) {
        const data = await res.json()
        setUserCredits(data.credits)
      }
    } catch (error) {
      console.error('Failed to fetch credits:', error)
    }
  }

  const apiEndpoints = [
    {
      name: 'Economic Impact',
      url: process.env.NEXT_PUBLIC_ECONOMIC_API,
      icon: TrendingUp,
      color: 'from-emerald-400 to-teal-600',
      key: 'predict_economic_impact',
      unit: "USD",
      category: 'economic'
    },
    {
      name: 'Crop Yield',
      url: process.env.NEXT_PUBLIC_CROP_API,
      icon: Wheat,
      color: 'from-amber-400 to-orange-500',
      key: 'predict_croprate',
      unit: "tons/ha",
      category: 'agriculture'
    },
    {
      name: 'Energy Demand',
      url: process.env.NEXT_PUBLIC_ELECTRICITY_API,
      icon: Zap,
      color: 'from-yellow-400 to-amber-500',
      key: 'predict_electricity',
      unit: "GW",
      category: 'energy'
    },
    {
      name: 'Adaptation Strategy',
      url: process.env.NEXT_PUBLIC_ADAPTION_API,
      icon: Shield,
      color: 'from-blue-400 to-cyan-500',
      key: 'predict_adaptation',
      unit: "",
      category: 'resilience'
    },
    {
      name: 'Temperature Trend',
      url: process.env.NEXT_PUBLIC_TEMP_GRAPH_API,
      icon: Thermometer,
      color: 'from-rose-400 to-pink-600',
      key: 'temperature-graph',
      category: 'climate'
    },
    {
      name: 'Temperature',
      url: process.env.NEXT_PUBLIC_TEMP_PREDICT_API,
      icon: Activity,
      color: 'from-red-400 to-rose-500',
      key: 'temperature_prediction',
      unit: "°C",
      category: 'climate'
    },
    {
      name: 'Humidity',
      url: process.env.NEXT_PUBLIC_HUMIDITY_API,
      icon: Droplets,
      color: 'from-indigo-400 to-blue-500',
      key: 'humidity_prediction',
      unit: "%",
      category: 'climate'
    }
  ];


  const handleSubmit = async () => {
    if (userCredits < 1) {
      alert("You don't have enough credits to run this simulation");
      return;
    }

    setIsLoading(true);
    setResults(null);
    setGeneratedImage(null);
    setScore(null);

    try {
      const randomScore = Math.floor(Math.random() * 30) + 60;
      setScore(randomScore);
    } catch (error) {
      console.error('Error calling APIs:', error);
    } finally {
      setIsLoading(false);
    }


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
          const api = await axios.post(`${endpoint.url}/${endpoint.key}`, {
            scenario: prompt
          });
          const data = api.data;

          return {
            type: 'prediction',
            value: data.predicted_adaptation_strategy
          }

        }
        else if (endpoint.key === "temperature_prediction") {

          const obj = {
            scenario: prompt
          }

          const api = await fetch('https://temperature-prediction-climatopia.up.railway.app/temperature_prediction/?scenario=What%20if%20we%20boil%20earth%3F', {
            method: 'POST',
            headers: {
              'Accept': 'application/json'
            }
          })


          const data = await api.json();

          return {
            type: 'prediction',
            value: data?.prediction?.Temperature
          }
        }
        else if (endpoint.key === "humidity_prediction") {
          const api = await fetch('https://bountiful-imagination-production.up.railway.app/humidity_prediction/', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              scenario: "What if we boil earth?"
            })
          })

          const data = await  api.json();

          return {
            type: 'prediction',
            value: data.prediction.predicted_humidity
          }
        }
        else if (endpoint.key === "temperature-graph") {
          const api = await axios.get(`${endpoint.url}/${endpoint.key}`);
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

      try {
        await axios.post('/api/user/credits', {
          amount: 10
        });
        setUserCredits(prev => prev - 10);
      } catch (error) {
        console.error('Error deducting credit:', error);
      }

      // Simulate image generation
      setTimeout(() => {
        setGeneratedImage(`https://picsum.photos/600/400?random=${Date.now()}`);
      }, 1000);

    } catch (error) {
      console.error('Error calling APIs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const makeAPost = async (form) => {
    await axios.post("/api/posts", form);
    router.push("/community")
  }

  const postHandler = () => {
    const form = new FormData()
    const title = prompt.slice(0, 20);
    form.append("title", title);
    form.append("question", prompt);
    form.append("answer", prompt);
    form.append("score", score);

    makeAPost(form)
  }

  const savingWhatIf = async (form) => {
    await axios.post("/api/saved/whatifs", form);
    router.push("/save");
  }

  const savedWhatif = () => {
    const title = prompt.slice(0, 20);

    const form = {
      title,
      question: prompt,
      answer: prompt,
      score
    }

    savingWhatIf(form);
  }


  const ClimateSummaryCard = () => {
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
          <div className="p-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white">
            <Thermometer size={24} />
          </div>
          <h3 className="font-semibold text-gray-800 text-xl">Climate Overview</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Temperature and Humidity Indicators */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-5 border border-red-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-red-600">Temperature</span>
                <span className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full flex items-center">
                  {tempData?.value > 0 ? <ArrowUp size={16} className="mr-1" /> : <ArrowDown size={16} className="mr-1" />}
                  {tempData?.value?.toFixed(1)}°C
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
                  {humidityData?.value?.toFixed(1)}%
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

  const PredictionCard = ({ endpoint, data }) => {
    const isIncrease = data.value > 0;
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
                {data.value}
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
              {typeof data.value === 'number' ? data.value.toFixed(2) : data.value}
              <span className="text-lg text-gray-500 ml-1">{endpoint.unit}</span>
            </div>
            <div className={`text-sm ${changeColor} flex items-center`}>
              {changeIcon}
              <span className="ml-1">
                {Math.abs(data.value)}{endpoint.unit} {isIncrease ? 'increase' : 'decrease'}
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
                strokeDashoffset={283 - (283 * Math.min(100, Math.abs(data.value))) / 100}
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ strokeDashoffset: 283 }}
                animate={{ strokeDashoffset: 283 - (283 * Math.min(100, Math.abs(data.value))) / 100 }}
                transition={{ duration: 1 }}
                className={isIncrease ? 'stroke-emerald-500' : 'stroke-rose-500'}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-sm font-medium ${isIncrease ? 'text-emerald-600' : 'text-rose-600'}`}>
                {Math.min(100, Math.abs(data.value))}%
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const EnergyGraphCard = ({ endpoint, data }) => {
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


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 mt-16">


      <div className="container mx-auto">
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
                <div className=" absolute bottom-4 left-4 text-sm font-medium text-blue-700 px-3 py-1 rounded-full">
                  EarthSimAI(v1)
                </div>
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
      </div>

      {/* Results Section */}
      <AnimatePresence>
        {results && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >

            {score && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl mx-auto bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6 shadow-lg border border-amber-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-xl text-white">
                      <Trophy size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Simulation Score</h3>
                      <p className="text-sm text-gray-600">Your scenario effectiveness rating</p>
                    </div>
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-yellow-700 bg-clip-text text-transparent">
                    {score}/100
                  </div>
                </div>
              </motion.div>
            )}
            {/* Generated Image */}


            {generatedImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="max-w-4xl mx-auto"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 overflow-hidden">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Sparkles className="mr-2 text-yellow-500" />
                    AI Generated Visualization
                  </h3>
                  <div className="rounded-xl overflow-hidden border border-gray-200">
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
            <div className="w-[90vw] mx-auto">
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

                {/* Energy Graph (2 columns) */}
                {results['predict_electricity'] && (
                  <EnergyGraphCard
                    endpoint={apiEndpoints.find(e => e.key === 'predict_electricity')}
                    data={results['predict_electricity']}
                  />
                )}


                {/* Adaptation Strategy Card */}
                {results['predict_adaptation'] && (
                  <div className='flex h-full flex-col gap-4'>
                    <PredictionCard
                      endpoint={apiEndpoints.find(e => e.key === 'predict_croprate')}
                      data={results['predict_croprate']}
                    />
                    <PredictionCard
                      endpoint={apiEndpoints.find(e => e.key === 'predict_adaptation')}
                      data={results['predict_adaptation']}
                    />
                  </div>

                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {results && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg py-4 px-6"
          >
            <div className="container mx-auto flex justify-between items-center">

              <button
                onClick={savedWhatif}
                className="hover:cursor-pointer flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                <Bookmark size={18} />
                <span>Save</span>
              </button>


              <div className="flex space-x-4">

                <button
                  onClick={postHandler}
                  className="hover:cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium">
                  Post to Community
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default EarthSimAI;