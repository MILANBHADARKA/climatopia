import { ethers } from 'ethers';
import abi from './abi';
import dotenv from 'dotenv';

dotenv.config()

const CONTRACT_ABI = abi

const { RPC_URL, PRIVATE_KEY, CONTRACT_ADDRESS } = process.env;
if (!RPC_URL || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
  throw new Error("Missing environment variables for web3 setup");
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

export { contract, provider, signer };
