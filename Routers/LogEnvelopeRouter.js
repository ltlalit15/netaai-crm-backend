import express from 'express';
import LogEnvelopeController from '../Controllers/LogEnvelopeController.js';

const router = express.Router();


router.post('/LogEnvelope', LogEnvelopeController.LogEnvelope);


export default router;


