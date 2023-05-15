import { Schema, model, models } from 'mongoose'

const timeoutSchema = new Schema({
  wallet: String,
  timeout: String,
})

const Timeout = models.Timeout || model('Timeout', timeoutSchema)

export default Timeout
