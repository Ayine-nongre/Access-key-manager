import express from 'express'
import { generateKey } from '../controller/KeyController/GenerateKeyController.js'
import { verifyToken } from '../middleware/tokenizer.js'
import { allKeys, keyDetails } from '../controller/KeyController/FetchKeysController.js'
import { revokeKey } from '../controller/KeyController/RevokeKeyController.js'
import { verifyKey } from '../controller/KeyController/VerifyKeyController.js'

export const KeyRouter = express.Router()

KeyRouter.get('/new-key', verifyToken, generateKey)
KeyRouter.get('/all-keys', verifyToken, allKeys)
KeyRouter.patch('/revoke-key', verifyToken, revokeKey)
KeyRouter.post('/active-key', verifyKey)
KeyRouter.get('/key/:access_key', verifyToken, keyDetails)