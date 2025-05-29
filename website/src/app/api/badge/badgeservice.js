import {contract} from './webthreesetup'
const BADGE_METADATA = {
  "Climate Modeler": "ipfs//bafkreiadnktt4bxjezdhgyoqnr3nra7n62ek3bov3bvpuabbere4qtszze",
  "GeoEconomist": "ipfs//bafkreic2ctjpgiaudcnsqxvj3aq563zo6k7mqpwznqkzcnkay6s22vgene", 
  "First Sim Run": "ipfs//bafkreiaftb7dvnz45g63xmvcrfovvg4ml3bqsjv4yo2v522dtpeohd7a7y",
  "Power User": "ipfs//bafkreifrmx4xl6hdnevuy3ihq4btldqc2badskd4oxse7oxu6bpgvwiumu",
  "Simulation Marathoner": "ipfs//bafkreiakmptdpmzjxervj5bbvwvsh3czjcddwjnj4o323wsjl7uth2s4f4",
  "Community Contributor": "ipfs//bafkreia2xi5lufwgnawb3rzaflkwijsthnoat6jfvykwsgbpoy5jkkmqhe",
  "Insightful Modeler": "ipfs//bafkreiblzd5mucfqun3rtudypnqiswnivtiwkjmyuh2lrjpesm4k6bjpku",
  "Bug Hunter": "ipfs//bafybeidcqxp3xkph2alq4f6refexa746lzkedyje3o66tfiwefnw77yv5u"
};

const GET_BADGE_URL = {
  "Climate Modeler": "https://aquamarine-urban-firefly-16.mypinata.cloud/ipfs/bafkreia2xi5lufwgnawb3rzaflkwijsthnoat6jfvykwsgbpoy5jkkmqhe",
  "GeoEconomist": "https://aquamarine-urban-firefly-16.mypinata.cloud/ipfs/bafkreic2ctjpgiaudcnsqxvj3aq563zo6k7mqpwznqkzcnkay6s22vgene", 
  "First Sim Run": "https://aquamarine-urban-firefly-16.mypinata.cloud/ipfs/bafkreiaftb7dvnz45g63xmvcrfovvg4ml3bqsjv4yo2v522dtpeohd7a7y",
  "Power User": "https://aquamarine-urban-firefly-16.mypinata.cloud/ipfs/bafkreifrmx4xl6hdnevuy3ihq4btldqc2badskd4oxse7oxu6bpgvwiumu",
  "Simulation Marathoner": "https://aquamarine-urban-firefly-16.mypinata.cloud/ipfs/bafkreiakmptdpmzjxervj5bbvwvsh3czjcddwjnj4o323wsjl7uth2s4f4",
  "Community Contributor": "https://aquamarine-urban-firefly-16.mypinata.cloud/ipfs/bafkreiadnktt4bxjezdhgyoqnr3nra7n62ek3bov3bvpuabbere4qtszze",
  "Insightful Modeler": "https://aquamarine-urban-firefly-16.mypinata.cloud/ipfs/bafkreiblzd5mucfqun3rtudypnqiswnivtiwkjmyuh2lrjpesm4k6bjpku",
  "Bug Hunter": "https://aquamarine-urban-firefly-16.mypinata.cloud/ipfs/bafkreiarfhskqkvhfsxqi4nk6lebr5gxdgsujyeiqoa3adoxthk7i5rgvu"
}

function getURLfromBadgeName(badgeName){
    return GET_BADGE_URL[badgeName]
}

async function mintBadgeToUser(walletAddress, badgeName) {
  try {
    const metadataURI = BADGE_METADATA[badgeName];
    
    if (!metadataURI) {
      throw new Error(`Badge "${badgeName}" not found`);
    }

    console.log(`Minting ${badgeName} to ${walletAddress}...`);
    
    // Call smart contract function
    const tx = await contract.awardBadge(walletAddress, badgeName, metadataURI);
    
    console.log(`Transaction sent: ${tx.hash}`);
    
    // Wait for confirmation
    const receipt = await tx.wait();
    
    console.log(`✅ Badge minted! Gas used: ${receipt.gasUsed}`);
    
    return {
      success: true,
      transactionHash: tx.hash,
      tokenId: parseInt(receipt.logs[0]?.topics[3], 16) // Extract token ID from event
    };
    
  } catch (error) {
    console.error(`Failed to mint badge:`, error);
    throw error;
  }
}

async function checkUserHasBadge(walletAddress, badgeName) {
  try {
    return await contract.hasBadge(walletAddress, badgeName);
  } catch (error) {
    console.error('Error checking badge:', error);
    return false;
  }
}

async function getUserBadgeCount(walletAddress) {
  try {
    const badgeTokenIds = await contract.getUserBadges(walletAddress);
    return badgeTokenIds.length;
  } catch (error) {
    console.error('Error getting badge count:', error);
    return 0;
  }
}
async function getAllBadgesForUser(walletAddress) {
  const tokenIds = await contract.getUserBadges(walletAddress);
  const badges = await Promise.all(tokenIds.map(id => contract.getBadgeDetails(id)));
  return badges.map(b => ({ 
    name: b.name, 
    timestamp: b.timestamp.toString(), 
    url: getURLfromBadgeName(b.name)}));
}


export {
  mintBadgeToUser,
  checkUserHasBadge,
  getUserBadgeCount,
  getAllBadgesForUser
};