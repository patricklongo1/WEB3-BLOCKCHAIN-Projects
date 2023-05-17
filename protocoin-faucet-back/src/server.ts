import dotenv from 'dotenv'
import express, { Request, Response } from 'express';
import mongoose from 'mongoose'

dotenv.config()

import Timeout from './schemas/timeout'
import { mintAndTransfer } from './providers/Ethers3Provider'

const app = express();
const appUrl = `${process.env.APP_URL}`
const port = `${process.env.PORT}`;

app.use(express.json());

const connectMongo = async () => mongoose.connect(`${process.env.MONGO_URI}`)
connectMongo()

interface TimeoutDTO {
  _id: string
  wallet: string
  timeout: string
}

app.post('/api/mint/:wallet', async (req: Request, res: Response) => {
  /* if (authorization !== `Bearer ${process.env.API_SECRET_KEY}`) {
    return NextResponse.json(
      { success: false, message: 'unauthorized' },
      { status: 401 },
    )
  } */

  const wallet = req.params.wallet

  const timeout = (await Timeout.findOne({ wallet })) as TimeoutDTO

  if (timeout) {
    if (Date.now() <= Number(timeout.timeout)) {
      return res.status(500).json(
        { message: "You can't receive tokens twice in 24h." },
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
    const tx = await mintAndTransfer(wallet)
    return res.json(tx)
  } catch (error: any) {
    return res.status(500).json({ wallet, error })
  }
});
app.listen(port, () => {
  console.log(`🚀 Servidor rodando em ${appUrl}:${port}`);
});
