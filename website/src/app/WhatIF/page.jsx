"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Activity,
  Sparkles,
  Bookmark,
  Layers,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { useAuth, useUser } from "@clerk/nextjs";
import useCredit from "../../providers/UserCredit";
import { useRouter } from "next/navigation";
import { PredictionCard } from "@/components/whatif/Prediction";
import { EnergyGraphCard } from "@/components/whatif/EnergyGraph";
import { ClimateSummaryCard } from "@/components/whatif/ClimateCard";
import IsSignedIn from "@/components/HOC/IsSignedIn";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const EarthSimAI = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [explanation, setExplanation] = useState(null);

  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const [score, setScore] = useState(null);
  const { userCredits, setUserCredits } = useCredit();

  const router = useRouter();

  useEffect(() => {
    if (isSignedIn && user) {
      fetchUserCredits();
    }
  }, [isSignedIn, user]);

  const fetchUserCredits = async () => {
    try {
      const res = await fetch("/api/user/credits");
      if (res.ok) {
        const data = await res.json();
        setUserCredits(data.credits);
      }
    } catch (error) {
      console.error("Failed to fetch credits:", error);
    }
  };

  const apiEndpoints = [
    {
      name: "Economic Impact",
      url: "https://ideal-adventure-production.up.railway.app",
      icon: TrendingUp,
      color: "from-emerald-400 to-teal-600",
      key: "predict_economic_impact",
      unit: "USD",
      category: "economic",
    },
    {
      name: "Crop Yield",
      url: "https://climatopia-production.up.railway.app",
      icon: Wheat,
      color: "from-amber-400 to-orange-500",
      key: "predict_croprate",
      unit: "tons/ha",
      category: "agriculture",
    },
    {
      name: "Energy Demand",
      url: "https://daring-rejoicing-production.up.railway.app",
      icon: Zap,
      color: "from-yellow-400 to-amber-500",
      key: "predict_electricity",
      unit: "GW",
      category: "energy",
    },
    {
      name: "Adaptation Strategy",
      url: "https://adaption-classifier-climatopia.up.railway.app",
      icon: Shield,
      color: "from-blue-400 to-cyan-500",
      key: "predict_adaptation",
      unit: "",
      category: "resilience",
    },
    {
      name: "Temperature Trend",
      url: "https://temperature-graph-climatopia.up.railway.app",
      icon: Thermometer,
      color: "from-rose-400 to-pink-600",
      key: "temperature-graph",
      category: "climate",
    },
    {
      name: "Temperature",
      url: "https://temperature-prediction-climatopia.up.railway.app",
      icon: Activity,
      color: "from-red-400 to-rose-500",
      key: "temperature_prediction",
      unit: "°C",
      category: "climate",
    },
    {
      name: "Humidity",
      url: "https://bountiful-imagination-production.up.railway.app",
      icon: Droplets,
      color: "from-indigo-400 to-blue-500",
      key: "humidity_prediction",
      unit: "%",
      category: "climate",
    },
    {
      name: "Ozone Impact",
      url: "https://climatopia-production-451e.up.railway.app",
      icon: Layers,
      color: "from-purple-400 to-violet-600",
      key: "ozone_prediction",
      unit: "DU(Dobson Unit)",
      category: "economic",
    },
    {
      name: "Geopolitical Impact",
      url: "https://diligent-cooperation-production.up.railway.app",
      icon: Globe,
      color: "from-green-400 to-emerald-600",
      key: "geopolitial_impact",
      unit: "",
      category: "political",
    },
    {
      name: "Sentiment Analysis",
      url: "https://satisfied-serenity-production.up.railway.app",
      icon: Sparkles,
      color: "from-purple-400 to-indigo-600",
      key: "analyze_sentimental_report",
      unit: "",
      category: "analysis",
    },
  ];

  const handleSubmit = async () => {
    if (userCredits < 1) {
      alert("You don't have enough credits to run this simulation");
      return;
    }

    if (!prompt.trim()) return;

    setIsLoading(true);
    setResults(null);
    setGeneratedImage(null);
    setExplanation(null);
    setScore(null);

    const callApiWithRetry = async (apiCall, maxRetries = 3, delay = 1000) => {
      let retries = 0;

      while (retries < maxRetries) {
        try {
          const response = await apiCall();
          return response;
        } catch (error) {
          retries++;
          if (retries >= maxRetries) {
            throw error;
          }
          // Wait before retrying (with exponential backoff)
          await new Promise((resolve) => setTimeout(resolve, delay * retries));
        }
      }
    };

    try {
      // First generate a random score

      // Call all prediction APIs
      const link = process.env.NEXT_PUBLIC_NGROK_URI;
      const apiPromises = apiEndpoints.map(async (endpoint) => {
        try {
          if (endpoint.key === "predict_economic_impact") {
            const api = await axios.post("/api/whatif/postmethods", {
              scenario: prompt,
              api: `${link}/predict_economic_impact`,
            });
            // console.log(api.data)

            return {
              type: "prediction",
              value: api?.data?.data?.predicted_economic_impact_million_usd,
            };
          } else if (endpoint.key === "predict_electricity") {
            const today = new Date();
            const formattedDate = today.toISOString().split("T")[0];
            const api = await axios.post(`/api/whatif/postmethods`, {
              start_time: formattedDate.toString(),
              api: `${link}/predict_electricity`,
            });
            // console.log(api.data.data)
            return {
              type: "graph",
              value: JSON.parse(api?.data?.data),
            };
          } else if (endpoint.key === "predict_adaptation") {
            const api = await axios.post(`/api/whatif/postmethods`, {
              scenario: prompt,
              api: `${link}/predict_adaptation`,
            });
            // console.log(api.data.data)
            return {
              type: "prediction",
              value: api?.data?.data?.predicted_adaptation_strategy,
            };
          } else if (endpoint.key === "temperature_prediction") {
            // const urlprompt = encodeURIComponent(prompt);
            const api = await axios.post(`/api/whatif/postmethods`, {
              scenario: prompt,
              api: `${link}/temperature_prediction`,
            });
            const data = api.data;
            console.log(data.data);
            return {
              type: "prediction",
              value: data?.data?.prediction?.Temperature,
            };
          } else if (endpoint.key === "humidity_prediction") {
            console.log(prompt);

            const api = await axios.post("/api/whatif/postmethods", {
              api: `${link}/humidity_prediction/`,
              scenario: prompt,
            });
            await sleep(10000);
            // console.log(api)
            const data = await api.data;
            // console.log(data)
            return {
              type: "prediction",
              value: data?.data?.prediction.predicted_humidity,
            };
          } else if (endpoint.key === "temperature-graph") {
            const api = await axios.post(`/api/whatif/getmethods`, {
              api: `${link}/temperature-graph`,
            });
            console.log(api.data);
            return {
              type: "graph",
              value: JSON.parse(api?.data?.data?.prediction?.plotly),
            };
          } else if (endpoint.key === "ozone_prediction") {
            const api = await axios.post(`/api/whatif/postmethods`, {
              api: `${link}/ozone_prediction`,
              scenario: prompt
            })
            const data = api.data;
            return {
              type: "prediction",
              value: data?.data?.prediction,
            };
          } else if (endpoint.key === "geopolitial_impact") {
            const api = await axios.post(`/api/whatif/postmethods`, {
              api: `${link}/geopolitial_impact`,
              scenario: prompt,
            });
            const data = api.data;
            return {
              type: "prediction",
              value: data?.data?.prediction,
            };
          }
          // else if (endpoint.key === "geopolitical_impact") {
          //   const api = await axios.post("/api/whatif/postmethods", {
          //     api : `/geopolitial_impact`,
          //     scenario : prompt
          //   });
          //   const data = api.data;
          //   return {
          //     type: 'prediction',
          //     value: data?.prediction // Assuming the API returns { prediction: "text" }
          //   };
          // }
          // Add new sentiment analysis API
          else if (endpoint.key === "analyze_sentimental_report") {
            console.log(prompt);
            const api = await axios.post("/api/whatif/postmethods", {
              api: `${link}/analyze_sentimental_report`,
              text: prompt,
            });
            const data = api.data;
            console.log(data);
            console.log(data.data);
            return {
              type: "prediction",
              value: data?.data,
            };
          }
          else if(endpoint.key === "predict_croprate"){
            const api = await axios.post(`/api/whatif/postmethods`, {
              scenario: prompt,
              api: `${link}/predict_croprate`,
            });
            // console.log(api.data.data)
             const data = api.data;
            console.log(data.data);
            return {
              type: "prediction",
              value: api?.data?.data?.result?.llm_predicted_crop_yield,
            };
          }
          // return await callApiWithRetry(apiCall);
        } catch (error) {
          console.error(`Error calling ${endpoint.name} API:`, error);
          return {
            type: "error",
            error: `Failed to get ${endpoint.name} data`,
          };
        }
      });

      const apiResults = await Promise.all(apiPromises);

      // Check if any API failed
      const hasErrors = apiResults.some((result) => result?.type === "error");

      if (hasErrors) {
        alert(
          "Question is not appropriate or some services are unavailable. Please try a different scenario."
        );
        return;
      }

      // Build results map
      const resultsMap = {};
      apiEndpoints.forEach((endpoint, index) => {
        resultsMap[endpoint.key] = apiResults[index];
      });

      setResults(resultsMap);

      // Generate explanation
      try {
        const api = await axios.post("/api/whatif/postmethods", {
          api: `${link}/explain_whatif/`,
          scenario: prompt,
        });
        const data = api.data;
        setExplanation(data?.data?.prediction);
      } catch (error) {
        console.error("Error generating explanation:", error);
      }

      // Generate image
      try {
        const imageRes = await axios.post("/api/image_generate", {
          prompt,
        });
        setGeneratedImage(imageRes.data.imageUrl);
      } catch (error) {
        console.error("Error generating image:", error);
      }

      // Deduct credits only if all APIs succeeded
      try {
        await axios.post("/api/user/credits", {
          amount: 10,
        });
        setUserCredits((prev) => prev - 10);
      } catch (error) {
        console.error("Error deducting credit:", error);
      }
    } catch (error) {
      console.error("Error calling APIs:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const makeAPost = async (form) => {
    await axios.post("/api/posts", form);
    router.push("/community");
  };

  const postHandler = () => {
    const form = new FormData();
    const title = prompt.slice(0, 20);
    form.append("title", title);
    form.append("question", prompt);
    form.append("answer", explanation);
    form.append("image", generatedImage);
    form.append("score", score || 0);

    makeAPost(form);
  };

  const savingWhatIf = async (form) => {
    await axios.post("/api/saved/whatifs", form);
    router.push("/save");
  };

  const savedWhatif = () => {
    const title = prompt.slice(0, 20);

    const form = {
      title,
      question: prompt,
      answer: explanation,
      image: generatedImage,
      score: score || 0,
    };

    savingWhatIf(form);
  };

  return (
    <IsSignedIn>
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
                Enter your climate scenario and get comprehensive predictions
                across multiple environmental and economic factors
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
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Processing Your Scenario
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Analyzing climate data across multiple prediction models...
                  </p>

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
                        <span className="text-sm text-gray-600">
                          {endpoint.name}
                        </span>
                        <Loader2
                          className="animate-spin text-blue-500 ml-auto"
                          size={16}
                        />
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
            {/* Sentiment Analysis Card */}
            {results["analyze_sentimental_report"] && (
              <div className="col-span-1 lg:col-span-2">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-full">
                  <div className="flex items-center mb-4">
                    <Sparkles className="mr-2 text-purple-500" />
                    <h4 className="text-lg font-semibold text-gray-800">
                      Scenario Sentiment Analysis
                    </h4>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Sentiment:</span>
                      <span
                        className={`font-medium ${
                          results["analyze_sentimental_report"]?.value
                            ?.sentiment === "POSITIVE"
                            ? "text-green-600"
                            : results["sentiment_analysis"]?.value
                                ?.sentiment === "NEGATIVE"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {
                          results["analyze_sentimental_report"]?.value
                            ?.sentiment
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Score:</span>
                      <span className="font-medium text-gray-800">
                        {Math.round(
                          results["analyze_sentimental_report"]?.value?.score *
                            100
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Generated Image */}
            {(explanation || generatedImage) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="max-w-6xl mx-auto"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 overflow-hidden">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Sparkles className="mr-2 text-yellow-500" />
                    AI Analysis Summary
                  </h3>

                  <div className="flex flex-col h-full gap-6">
                    {explanation && (
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                        <h4 className="font-medium text-blue-800 mb-3">
                          Scenario Analysis
                        </h4>
                        {/* <p className="text-gray-700"> */}
                        <ReactMarkdown>{explanation}</ReactMarkdown>
                        {/* </p> */}
                      </div>
                    )}

                    {generatedImage && (
                      <div className="space-y-4">
                        <div className="rounded-xl overflow-hidden border border-gray-200">
                          <img
                            src={generatedImage}
                            alt="AI Generated Climate Scenario"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">5 credits</span> for
                            generating a new image
                          </p>

                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={async () => {
                              if (userCredits < 5) {
                                alert(
                                  "You don't have enough credits to generate a new image"
                                );
                                return;
                              }
                              setIsLoading(true);
                              try {
                                const imageRes = await axios.post(
                                  "/api/image_generate",
                                  {
                                    prompt,
                                  }
                                );
                                setGeneratedImage(imageRes.data.imageUrl);

                                // Deduct credits
                                await axios.post("/api/user/credits", {
                                  amount: 5,
                                });
                                setUserCredits((prev) => prev - 5);
                              } catch (error) {
                                console.error("Error generating image:", error);
                                alert("Failed to generate new image");
                              } finally {
                                setIsLoading(false);
                              }
                            }}
                            disabled={isLoading}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="animate-spin h-4 w-4" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-4 w-4" />
                                Generate New Image
                              </>
                            )}
                          </motion.button>
                        </div>
                      </div>
                    )}
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
                <ClimateSummaryCard results={results} />

                {/* Economic Impact Card */}
                {results["predict_economic_impact"] && (
                  <PredictionCard
                    endpoint={apiEndpoints.find(
                      (e) => e.key === "predict_economic_impact"
                    )}
                    data={results["predict_economic_impact"]}
                  />
                )}

                {/* Energy Graph (2 columns) */}
                {results["predict_electricity"] && (
                  <EnergyGraphCard
                    endpoint={apiEndpoints.find(
                      (e) => e.key === "predict_electricity"
                    )}
                    data={results["predict_electricity"]}
                  />
                )}

                {/* Adaptation Strategy Card */}
                {results["predict_adaptation"] && (
                  <div className="flex h-full flex-col gap-4">
                    <PredictionCard
                      endpoint={apiEndpoints.find(
                        (e) => e.key === "predict_croprate"
                      )}
                      data={results["predict_croprate"]}
                    />
                    <PredictionCard
                      endpoint={apiEndpoints.find(
                        (e) => e.key === "predict_adaptation"
                      )}
                      data={results["predict_adaptation"]}
                    />
                  </div>
                )}
              </div>
              {/* Geopolitical Impact Card */}
              {results["geopolitial_impact"] && (
                <div className="col-span-1">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-full">
                    <div className="flex items-center mb-4">
                      <Globe className="mr-2 text-green-500" />
                      <h4 className="text-lg font-semibold text-gray-800">
                        Geopolitical Impact
                      </h4>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-700">
                      <ReactMarkdown>
                        {results["geopolitial_impact"].value}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
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
                className="hover:cursor-pointer flex items-center space-x-2 text-gray-700 hover:text-gray-900"
              >
                <Bookmark size={18} />
                <span>Save</span>
              </button>

              <div className="flex space-x-4">
                <button
                  onClick={postHandler}
                  className="hover:cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Post to Community
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </IsSignedIn>
  );
};

export default EarthSimAI;
