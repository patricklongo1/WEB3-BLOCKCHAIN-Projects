import { NextResponse } from 'next/server'
import { mintAndTransfer } from '@/app/providers/Ethers3Provider'
import connectMongo from '../../../services/mongodb'
import Timeout from '../../../schemas/timeout'

interface MintProps {
  params: {
    wallet: string
  }
}

interface TimeoutDTO {
  _id: string
  wallet: string
  timeout: string
}

export async function POST(request: Request, { params }: MintProps) {
  await connectMongo()
  /* const { authorization } = request.headers

  if (authorization !== `Bearer ${process.env.API_SECRET_KEY}`) {
    return NextResponse.json(
      { success: false, message: 'unauthorized' },
      { status: 401 },
    )
  } */

  const wallet = params.wallet

  const timeout = (await Timeout.findOne({ wallet })) as TimeoutDTO

  if (timeout) {
    if (Date.now() <= Number(timeout.timeout)) {
      return NextResponse.json(
        { message: "You can't receive tokens twice in 24h." },
        { status: 500 },
      )
    } else {
      const newTimeout = {
        wallet,
        timeout: Date.now() + 1000 * 60 * 60 * 24,
      }
      await Timeout.findByIdAndUpdate(timeout._id, newTimeout)
    }
  } else {
    const newTimeout = {
      wallet,
      timeout: Date.now() + 1000 * 60 * 60 * 24,
    }
    await Timeout.create(newTimeout)
  }

  try {
    const environment = `${process.env.ENVIRONMENT}`
    if (environment === 'DEV') {
      const tx = await mintAndTransfer(wallet)
      return NextResponse.json(tx)
    }
    await mintAndTransfer(wallet)
    return NextResponse.json('Your tokens were sent.')
  } catch (error: any) {
    return NextResponse.json({ wallet, error }, { status: 500 })
  }
}
