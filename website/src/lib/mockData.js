// Mock data for development and testing
export const mockUsers = [
  {
    _id: "507f1f77bcf86cd799439011",
    name: "Dr. Sarah Chen",
    email: "sarah.chen@earthsim.ai",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date("2024-01-15"),
    bio: "Climate scientist specializing in renewable energy transitions",
  },
  {
    _id: "507f1f77bcf86cd799439012",
    name: "Marcus Rodriguez",
    email: "marcus.r@futuretech.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date("2024-02-01"),
    bio: "Tech entrepreneur focused on sustainable innovation",
  },
  {
    _id: "507f1f77bcf86cd799439013",
    name: "Prof. Elena Kowalski",
    email: "e.kowalski@university.edu",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date("2024-01-20"),
    bio: "Environmental economist and policy researcher",
  },
  {
    _id: "507f1f77bcf86cd799439014",
    name: "Alex Thompson",
    email: "alex.t@greentech.io",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date("2024-02-10"),
    bio: "Green technology advocate and startup founder",
  },
  {
    _id: "507f1f77bcf86cd799439015",
    name: "Dr. Raj Patel",
    email: "raj.patel@climatelab.org",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date("2024-01-25"),
    bio: "Climate modeling expert and data scientist",
  },
]

export const mockPosts = [
  {
    _id: "65f1a2b3c4d5e6f7a8b9c0d1",
    title: "Global Solar Revolution: 50% Renewable Energy by 2030",
    question:
      "What if we could deploy solar panels on every suitable rooftop worldwide and achieve 50% renewable energy by 2030?",
    answer:
      "Based on current solar technology trends and installation rates, achieving 50% renewable energy by 2030 would require unprecedented global coordination. The economic impact would be transformative - creating approximately 15 million new jobs in the renewable sector while reducing global carbon emissions by 35%. However, this would require massive infrastructure investments (~$2.5 trillion globally) and significant improvements in energy storage technology. The geopolitical implications would be enormous, reducing dependence on fossil fuel exports and potentially destabilizing oil-dependent economies. Grid modernization would be critical, requiring smart grid technology to handle variable renewable inputs. The environmental benefits would include not just reduced CO2 emissions, but also improved air quality in urban areas, potentially preventing 2.5 million premature deaths annually from air pollution.",
    score: 92,
    category: "climate",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=300&fit=crop",
    author: mockUsers[0],
    likes: [
      { user: mockUsers[1]._id, createdAt: new Date("2024-03-15") },
      { user: mockUsers[2]._id, createdAt: new Date("2024-03-16") },
      { user: mockUsers[3]._id, createdAt: new Date("2024-03-17") },
    ],
    likesCount: 127,
    commentsCount: 23,
    createdAt: new Date("2024-03-14"),
    updatedAt: new Date("2024-03-17"),
    isPublic: true,
  },
  {
    _id: "65f1a2b3c4d5e6f7a8b9c0d2",
    title: "Universal Basic Income: Economic Safety Net for AI Era",
    question:
      "What if every country implemented Universal Basic Income as AI automation displaces 40% of traditional jobs?",
    answer:
      "The implementation of UBI in response to AI-driven job displacement would fundamentally reshape global economics. Economic modeling suggests that providing $1,000/month to every adult would cost approximately 10-15% of GDP in developed nations. Funding mechanisms would likely include automation taxes on companies using AI, carbon taxes, and progressive wealth taxes. The social impact would be profound - reducing poverty rates by an estimated 60-80% and providing economic security for creative pursuits, education, and entrepreneurship. However, inflation concerns are significant; historical data suggests careful implementation with price controls on essential goods would be necessary. Labor market dynamics would shift dramatically, with people choosing more meaningful work rather than survival jobs. Mental health improvements could be substantial, as financial stress is a major contributor to anxiety and depression. The political feasibility remains challenging, requiring unprecedented international cooperation to prevent 'UBI arbitrage' where people migrate to higher-benefit countries.",
    score: 88,
    category: "economy",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&h=300&fit=crop",
    author: mockUsers[2],
    likes: [
      { user: mockUsers[0]._id, createdAt: new Date("2024-03-13") },
      { user: mockUsers[4]._id, createdAt: new Date("2024-03-14") },
    ],
    likesCount: 89,
    commentsCount: 31,
    createdAt: new Date("2024-03-12"),
    updatedAt: new Date("2024-03-14"),
    isPublic: true,
  },
  {
    _id: "65f1a2b3c4d5e6f7a8b9c0d3",
    title: "Ocean Cleanup Revolution: Plastic-Free Seas by 2035",
    question: "What if we deployed 1000 autonomous ocean cleanup systems and achieved plastic-free oceans by 2035?",
    answer:
      "Deploying 1000 autonomous ocean cleanup systems represents a $50 billion investment that could revolutionize marine ecosystems. Current technology like The Ocean Cleanup's systems can collect 5,000kg of plastic per system per month. At scale, this could remove 60 million kg of plastic annually - roughly equivalent to current annual ocean plastic input. The ecological benefits would be transformative: marine life mortality from plastic ingestion could drop by 90%, coral reef health would improve significantly, and fish populations could recover by 25-40% in cleaned areas. Economic impacts include revitalized fishing industries worth $80 billion globally and tourism benefits of $120 billion annually from pristine marine environments. However, the challenge lies in preventing new plastic input - this would require simultaneous implementation of circular economy principles, biodegradable packaging mandates, and improved waste management in developing nations. The collected plastic could be processed into valuable materials, creating a $15 billion recycling industry and making the operation partially self-sustaining.",
    score: 85,
    category: "environment",
    image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&h=300&fit=crop",
    author: mockUsers[1],
    likes: [
      { user: mockUsers[2]._id, createdAt: new Date("2024-03-11") },
      { user: mockUsers[3]._id, createdAt: new Date("2024-03-12") },
      { user: mockUsers[4]._id, createdAt: new Date("2024-03-13") },
    ],
    likesCount: 156,
    commentsCount: 18,
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-03-13"),
    isPublic: true,
  },
  {
    _id: "65f1a2b3c4d5e6f7a8b9c0d4",
    title: "Quantum Internet: Unhackable Global Communications",
    question:
      "What if quantum internet became globally accessible, making all digital communications theoretically unhackable?",
    answer:
      "A global quantum internet would represent the most significant advancement in cybersecurity since encryption was invented. Quantum entanglement-based communication is theoretically unbreachable due to the laws of physics - any attempt to intercept quantum information destroys it, immediately alerting both parties. The infrastructure investment would be massive, requiring quantum repeaters every 100km and specialized quantum computers at major nodes, totaling approximately $500 billion globally. The geopolitical implications would be staggering: current cyber warfare capabilities would become obsolete overnight, forcing nation-states to develop entirely new forms of digital conflict. Financial systems would become virtually impregnable, potentially eliminating the $6 trillion annual cost of cybercrime. However, the digital divide would initially worsen, as quantum internet access would be limited to wealthy nations and corporations. Privacy would be absolute for those with access, but surveillance states might ban quantum communication for civilians. The technology could also enable distributed quantum computing, accelerating scientific research in drug discovery, climate modeling, and artificial intelligence by orders of magnitude.",
    score: 91,
    category: "technology",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=300&fit=crop",
    author: mockUsers[3],
    likes: [
      { user: mockUsers[0]._id, createdAt: new Date("2024-03-09") },
      { user: mockUsers[1]._id, createdAt: new Date("2024-03-10") },
    ],
    likesCount: 203,
    commentsCount: 45,
    createdAt: new Date("2024-03-08"),
    updatedAt: new Date("2024-03-10"),
    isPublic: true,
  },
  {
    _id: "65f1a2b3c4d5e6f7a8b9c0d5",
    title: "Vertical Farming Cities: Food Security in Urban Environments",
    question: "What if every major city built vertical farms capable of producing 80% of their food locally?",
    answer:
      "Urban vertical farming at this scale would revolutionize food security and urban planning. Each major city would need approximately 200-300 vertical farms (50-story buildings) to achieve 80% food self-sufficiency, representing a $100 billion investment per major metropolitan area. The environmental benefits would be extraordinary: 95% reduction in agricultural water usage through hydroponic systems, elimination of pesticides in urban food production, and 90% reduction in food transportation emissions. Year-round production would stabilize food prices and eliminate weather-related crop failures. Urban air quality would improve significantly as these buildings would act as massive air purifiers, processing 40,000 tons of CO2 annually per facility. The social impact includes creating 2 million new jobs in urban agriculture and providing fresh, nutritious food in food deserts. However, energy consumption would be substantial - requiring renewable energy integration to avoid increasing carbon footprints. The technology would also enable food production in previously impossible locations like deserts and arctic regions, potentially supporting space colonization efforts.",
    score: 79,
    category: "society",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=300&fit=crop",
    author: mockUsers[4],
    likes: [
      { user: mockUsers[1]._id, createdAt: new Date("2024-03-07") },
      { user: mockUsers[2]._id, createdAt: new Date("2024-03-08") },
    ],
    likesCount: 94,
    commentsCount: 27,
    createdAt: new Date("2024-03-06"),
    updatedAt: new Date("2024-03-08"),
    isPublic: true,
  },
  {
    _id: "65f1a2b3c4d5e6f7a8b9c0d6",
    title: "Carbon Capture Megaprojects: Reversing Climate Change",
    question:
      "What if we built 10,000 industrial-scale carbon capture facilities and started reversing atmospheric CO2 levels?",
    answer:
      "Deploying 10,000 industrial-scale direct air capture (DAC) facilities would be humanity's largest engineering project, requiring $2 trillion in investment and consuming 20% of global electricity production. Each facility would capture 1 million tons of CO2 annually, totaling 10 billion tons - roughly 25% of current annual emissions. To reverse climate change, we'd need to capture historical emissions: approximately 1.5 trillion tons of excess CO2. At this rate, atmospheric CO2 could return to pre-industrial levels within 150 years. The captured CO2 could be permanently stored underground or converted into useful products like synthetic fuels, concrete, and plastics, creating a $500 billion circular carbon economy. Energy requirements would necessitate massive renewable energy expansion - approximately 50,000 TWh annually, equivalent to tripling current global electricity production. The economic impact would create 50 million jobs globally while potentially destabilizing fossil fuel industries. Geopolitical cooperation would be essential, as climate benefits are global while costs are local. Success would require unprecedented international coordination, similar to the Manhattan Project but 1000 times larger.",
    score: 96,
    category: "climate",
    image: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=600&h=300&fit=crop",
    author: mockUsers[0],
    likes: [
      { user: mockUsers[1]._id, createdAt: new Date("2024-03-05") },
      { user: mockUsers[3]._id, createdAt: new Date("2024-03-06") },
      { user: mockUsers[4]._id, createdAt: new Date("2024-03-07") },
    ],
    likesCount: 278,
    commentsCount: 52,
    createdAt: new Date("2024-03-04"),
    updatedAt: new Date("2024-03-07"),
    isPublic: true,
  },
  {
    _id: "65f1a2b3c4d5e6f7a8b9c0d7",
    title: "Space-Based Solar Power: Unlimited Clean Energy",
    question: "What if we launched 100 space-based solar power satellites to beam unlimited clean energy to Earth?",
    answer:
      "Space-based solar power represents the ultimate solution to Earth's energy needs. 100 satellites, each generating 5GW, would provide 500GW of continuous clean energy - equivalent to 500 nuclear power plants. The investment would be astronomical: $5 trillion for satellite construction and launch costs, plus $1 trillion for ground-based receiving stations. However, space-based solar is 10x more efficient than terrestrial solar due to 24/7 sunlight and no atmospheric interference. The energy would be beamed to Earth via microwave transmission with 85% efficiency. This could provide unlimited clean energy for all of humanity's needs, making energy essentially free and abundant. The geopolitical implications would be revolutionary - energy independence for all nations, elimination of energy poverty affecting 1 billion people, and the end of resource wars over fossil fuels. Manufacturing could move to space, reducing Earth's environmental burden. The technology would enable massive desalination projects, vertical farming expansion, and direct air capture at unprecedented scales. However, concerns about weaponization of space-based energy beams would require international treaties and oversight.",
    score: 89,
    category: "technology",
    image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=600&h=300&fit=crop",
    author: mockUsers[3],
    likes: [
      { user: mockUsers[0]._id, createdAt: new Date("2024-03-03") },
      { user: mockUsers[2]._id, createdAt: new Date("2024-03-04") },
    ],
    likesCount: 167,
    commentsCount: 38,
    createdAt: new Date("2024-03-02"),
    updatedAt: new Date("2024-03-04"),
    isPublic: true,
  },
  {
    _id: "65f1a2b3c4d5e6f7a8b9c0d8",
    title: "Global Reforestation: 1 Trillion Trees by 2030",
    question: "What if we planted 1 trillion trees by 2030 and restored 30% of degraded ecosystems worldwide?",
    answer:
      "Planting 1 trillion trees would be the largest ecological restoration project in human history, requiring coordination across 195 countries and investment of $300 billion. This would restore an area equivalent to the size of the United States, sequestering approximately 200 billion tons of CO2 over the trees' lifetimes - roughly 25% of excess atmospheric carbon. The biodiversity benefits would be immense: creating habitat for millions of species, restoring wildlife corridors, and potentially preventing the sixth mass extinction. Economic impacts include creating 60 million jobs in rural areas, generating $1.2 trillion in ecosystem services annually, and supporting 1.6 billion people who depend on forests for their livelihoods. Water cycle restoration would be significant - forests generate 40% of rainfall in some regions, so reforestation could end droughts in previously arid areas and restore major river systems. However, success requires careful species selection, community involvement, and protection from deforestation. The project would need to address underlying causes of deforestation: agricultural expansion, urban development, and illegal logging. Satellite monitoring and AI would be essential for tracking progress and preventing backsliding.",
    score: 87,
    category: "environment",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=300&fit=crop",
    author: mockUsers[2],
    likes: [
      { user: mockUsers[1]._id, createdAt: new Date("2024-03-01") },
      { user: mockUsers[4]._id, createdAt: new Date("2024-03-02") },
    ],
    likesCount: 234,
    commentsCount: 41,
    createdAt: new Date("2024-02-28"),
    updatedAt: new Date("2024-03-02"),
    isPublic: true,
  },
]

export const mockComments = [
  {
    _id: "65f1a2b3c4d5e6f7a8b9c0e1",
    content:
      "This is incredibly ambitious but absolutely necessary. The economic modeling here is spot-on. We need to start implementing pilot programs in major cities immediately.",
    author: mockUsers[1],
    post: "65f1a2b3c4d5e6f7a8b9c0d1",
    likes: [{ user: mockUsers[0]._id, createdAt: new Date("2024-03-15") }],
    likesCount: 12,
    createdAt: new Date("2024-03-15"),
  },
  {
    _id: "65f1a2b3c4d5e6f7a8b9c0e2",
    content:
      "The grid modernization aspect is crucial. Without smart grids, we'll face massive stability issues. Has anyone calculated the infrastructure costs for grid upgrades?",
    author: mockUsers[4],
    post: "65f1a2b3c4d5e6f7a8b9c0d1",
    likes: [],
    likesCount: 8,
    createdAt: new Date("2024-03-16"),
  },
  {
    _id: "65f1a2b3c4d5e6f7a8b9c0e3",
    content:
      "UBI is the future, but we need to address the inflation concerns more thoroughly. Maybe start with targeted basic income for specific sectors affected by AI?",
    author: mockUsers[3],
    post: "65f1a2b3c4d5e6f7a8b9c0d2",
    likes: [
      { user: mockUsers[0]._id, createdAt: new Date("2024-03-13") },
      { user: mockUsers[2]._id, createdAt: new Date("2024-03-14") },
    ],
    likesCount: 15,
    createdAt: new Date("2024-03-13"),
  },
  {
    _id: "65f1a2b3c4d5e6f7a8b9c0e4",
    content:
      "The automation tax idea is brilliant! Companies benefiting from AI should definitely contribute to supporting displaced workers.",
    author: mockUsers[0],
    post: "65f1a2b3c4d5e6f7a8b9c0d2",
    likes: [{ user: mockUsers[4]._id, createdAt: new Date("2024-03-14") }],
    likesCount: 9,
    createdAt: new Date("2024-03-14"),
  },
  {
    _id: "65f1a2b3c4d5e6f7a8b9c0e5",
    content:
      "Ocean cleanup is great, but we absolutely must stop the plastic input first. Otherwise we're just treating symptoms, not the disease.",
    author: mockUsers[2],
    post: "65f1a2b3c4d5e6f7a8b9c0d3",
    likes: [
      { user: mockUsers[1]._id, createdAt: new Date("2024-03-11") },
      { user: mockUsers[3]._id, createdAt: new Date("2024-03-12") },
    ],
    likesCount: 18,
    createdAt: new Date("2024-03-11"),
  },
]

// Helper function to get mock data
export function getMockPosts(filter = "latest", category = "all", search = "") {
  let filteredPosts = [...mockPosts]

  // Apply category filter
  if (category !== "all") {
    filteredPosts = filteredPosts.filter((post) => post.category === category)
  }

  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase()
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchLower) ||
        post.question.toLowerCase().includes(searchLower) ||
        post.answer.toLowerCase().includes(searchLower),
    )
  }

  // Apply sorting
  switch (filter) {
    case "popular":
      filteredPosts.sort((a, b) => b.likesCount - a.likesCount)
      break
    case "trending":
      // Simple trending algorithm: likes + comments, weighted by recency
      filteredPosts.sort((a, b) => {
        const aScore =
          (a.likesCount * 2 + a.commentsCount) /
          Math.max(1, (Date.now() - new Date(a.createdAt)) / (1000 * 60 * 60 * 24))
        const bScore =
          (b.likesCount * 2 + b.commentsCount) /
          Math.max(1, (Date.now() - new Date(b.createdAt)) / (1000 * 60 * 60 * 24))
        return bScore - aScore
      })
      break
    default: // latest
      filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  return filteredPosts
}

export function getMockPost(id) {
  return mockPosts.find((post) => post._id === id)
}

export function getMockComments(postId) {
  return mockComments.filter((comment) => comment.post === postId)
}

export function getMockUserPosts(userId = "507f1f77bcf86cd799439011") {
  return mockPosts.filter((post) => post.author._id === userId)
}

export function getMockUserStats(userId = "507f1f77bcf86cd799439011") {
  const userPosts = getMockUserPosts(userId)
  const totalLikes = userPosts.reduce((sum, post) => sum + post.likesCount, 0)
  const totalComments = userPosts.reduce((sum, post) => sum + post.commentsCount, 0)

  return {
    totalPosts: userPosts.length,
    totalLikes,
    totalComments,
  }
}
