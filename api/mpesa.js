import crypto from 'crypto';

export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }
  const { phone, amount } = body || {};

  if (!phone || !amount) {
    return res.status(400).json({ error: 'Phone and amount are required' });
  }

  // Clean phone number: remove any non-digit chars and ensure it starts with 258
  let msisdn = phone.replace(/[^0-9]/g, '');
  if (!msisdn.startsWith('258')) {
    msisdn = '258' + msisdn;
  }

  // Read M-Pesa credentials from Environment variables
  const apiKey = process.env.MPESA_API_KEY;
  let publicKeyPEM = process.env.MPESA_PUBLIC_KEY; // Public key formatted in PEM (with header/footer)
  const serviceProviderCode = process.env.MPESA_SERVICE_PROVIDER_CODE || '171717'; // default test code

  // Normalize PEM public key format (replace literal \n or \\n and wrap in headers if missing)
  if (publicKeyPEM && typeof publicKeyPEM === 'string') {
    publicKeyPEM = publicKeyPEM.replace(/\\n/g, '\n').replace(/\r/g, '');
    if (!publicKeyPEM.includes('-----BEGIN PUBLIC KEY-----')) {
      publicKeyPEM = `-----BEGIN PUBLIC KEY-----\n${publicKeyPEM}\n-----END PUBLIC KEY-----`;
    }
  }

  // If credentials are not set, return simulated success
  if (!apiKey || !publicKeyPEM) {
    console.warn('M-Pesa API credentials not configured. Returning simulated STK Push response.');
    
    // Simulate transaction delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    return res.status(200).json({
      status: 'simulated',
      message: 'Simulação: Pedido de pagamento M-Pesa enviado! (Nota: Configure MPESA_API_KEY e MPESA_PUBLIC_KEY no Vercel para acionar pushes reais no telemóvel)',
      transactionId: 'SIM_' + Math.random().toString(36).substring(2, 11).toUpperCase()
    });
  }

  try {
    // 1. Encrypt API Key with the Public Key using RSA OAEP padding
    const buffer = Buffer.from(apiKey);
    const encrypted = crypto.publicEncrypt(
      {
        key: publicKeyPEM,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      buffer
    );
    const encryptedApiKey = encrypted.toString('base64');

    // 2. Fetch Session ID from M-Pesa API
    const authResponse = await fetch('https://api.sandbox.vm.co.mz/ipg/v1x/auth/start/session/', {
      method: 'GET',
      headers: {
        'Origin': 'developer.mpesa.vm.co.mz',
        'Authorization': `Bearer ${encryptedApiKey}`
      }
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      return res.status(authResponse.status).json({
        error: 'Failed to generate M-Pesa Session Token',
        details: errorText
      });
    }

    const authData = await authResponse.json();
    const sessionId = authData.output_SessionID;

    // 3. Initiate C2B Payment (STK Push)
    const transactionReference = 'REF_' + Date.now();
    const thirdPartyReference = '3RD_' + Math.floor(100000 + Math.random() * 900000);

    const paymentResponse = await fetch('https://api.sandbox.vm.co.mz/ipg/v1x/c2bPayment/singleStage/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'developer.mpesa.vm.co.mz',
        'Authorization': `Bearer ${sessionId}`
      },
      body: JSON.stringify({
        input_TransactionReference: transactionReference,
        input_CustomerMSISDN: msisdn,
        input_Amount: parseFloat(amount).toFixed(2),
        input_ThirdPartyReference: thirdPartyReference,
        input_ServiceProviderCode: serviceProviderCode
      })
    });

    if (!paymentResponse.ok) {
      const errorText = await paymentResponse.text();
      return res.status(paymentResponse.status).json({
        error: 'M-Pesa payment initiation failed',
        details: errorText
      });
    }

    const paymentData = await paymentResponse.json();

    return res.status(200).json({
      status: 'success',
      data: paymentData,
      transactionId: paymentData.output_TransactionID || transactionReference
    });
  } catch (error) {
    console.error('M-Pesa API error:', error);
    return res.status(500).json({
      error: 'Internal Server Error during M-Pesa transaction',
      details: error.message
    });
  }
}
