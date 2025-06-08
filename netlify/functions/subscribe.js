const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

exports.handler = async (event, context) => {
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

    // Initialize Google Sheets API with service account
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();

    // Get or create the subscribers sheet
    let sheet = doc.sheetsByTitle['Subscribers'];
    
    if (!sheet) {
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
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to subscribe. Please try again.'
      }),
    };
  }
};