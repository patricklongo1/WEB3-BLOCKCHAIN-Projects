import { NextResponse } from 'next/server'
import { mintAndTransfer } from '@/app/providers/Web3Provider'

interface MintProps {
  params: {
    wallet: string
  }
}

export async function POST(request: Request, { params }: MintProps) {
  const wallet = params.wallet
  try {
    const tx = await mintAndTransfer(wallet)
    return NextResponse.json(tx)
  } catch (error: any) {
    return NextResponse.json({ wallet, error }, { status: 500 })
  }
}
