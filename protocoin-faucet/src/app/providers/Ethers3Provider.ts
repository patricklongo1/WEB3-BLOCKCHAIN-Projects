import { ethers } from 'ethers'
import ABI from '../abi.json'

const privateKey = `${process.env.PRIVATE_KEY}`
const nodeUrl = `${process.env.BLOCKCHAIN_NODE_URL}`
const contractAddress = `${process.env.CONTRACT_ADDRESS}`

// Crie uma instância do provedor usando a URL do nó
const provider = new ethers.providers.JsonRpcProvider(nodeUrl)

// Crie uma instância da carteira usando a chave privada
const wallet = new ethers.Wallet(privateKey, provider)

// Conecte a carteira ao contrato usando o ABI e o endereço do contrato
const contract = new ethers.Contract(contractAddress, ABI, wallet)

export async function mintAndTransfer(to: string) {
  try {
    // Chame o método "mint" do contrato e envie a transação
    const tx = await contract.mint(to)

    // Aguarde a confirmação da transação
    await tx.wait()

    return tx.hash
  } catch (error) {
    console.error('Erro ao executar a transação:', error)
    throw error
  }
}
