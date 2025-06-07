const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  try {
    // Parse request body
    const { email } = JSON.parse(event.body);
    
    if (!email || !email.includes('@')) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Valid email address required' }),
      };
    }

    // Check environment variables
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    console.log('Environment check:', {
      sheetId: sheetId ? 'SET' : 'MISSING',
      serviceEmail: serviceEmail ? 'SET' : 'MISSING',
      privateKey: privateKey ? 'SET' : 'MISSING'
    });

    if (!sheetId || !serviceEmail || !privateKey) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Server configuration error. Please contact admin.',
          debug: {
            sheetId: sheetId ? 'SET' : 'MISSING',
            serviceEmail: serviceEmail ? 'SET' : 'MISSING',
            privateKey: privateKey ? 'SET' : 'MISSING'
          }
        }),
      };
    }

    // Initialize Google Sheets API with service account
    const serviceAccountAuth = new JWT({
      email: serviceEmail,
      key: privateKey.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
    await doc.loadInfo();

    // Get or create the subscribers sheet
    let sheet;
    try {
      sheet = doc.sheetsByTitle['Subscribers'];
    } catch (error) {
      sheet = await doc.addSheet({ title: 'Subscribers' });
      await sheet.setHeaderRow(['Email', 'Subscribed At', 'IP Address']);
    }

    // Check if email already exists
    const rows = await sheet.getRows();
    const existingSubscriber = rows.find(row => row.get('Email') === email);
    
    if (existingSubscriber) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: 'Already subscribed',
          status: 'existing'
        }),
      };
    }

    // Add new subscriber
    await sheet.addRow({
      Email: email,
      'Subscribed At': new Date().toISOString(),
      'IP Address': event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'unknown'
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message: 'Successfully subscribed!',
        status: 'success'
      }),
    };

  } catch (error) {
    console.error('Subscription error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to subscribe. Please try again.',
        details: error.message
      }),
    };
  }
};