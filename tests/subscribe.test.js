const subscribe = require('../netlify/functions/subscribe');

// Mock google-spreadsheet and google-auth-library
const mockSheet = {
  setHeaderRow: jest.fn(),
  getRows: jest.fn().mockResolvedValue([]),
  addRow: jest.fn()
};

jest.mock('google-spreadsheet', () => {
  return {
    GoogleSpreadsheet: jest.fn().mockImplementation(() => ({
      sheetsByTitle: { 'Subscribers': mockSheet },
      loadInfo: jest.fn(),
      addSheet: jest.fn(async ({ title }) => {
        return mockSheet;
      })
    }))
  };
});

jest.mock('google-auth-library', () => {
  return { JWT: jest.fn() };
});

describe('subscribe function', () => {
  test('successful subscription with valid email', async () => {
    const event = {
      httpMethod: 'POST',
      body: JSON.stringify({ email: 'test@example.com' }),
      headers: {}
    };

    const res = await subscribe.handler(event, {});
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).status).toBe('success');
  });

  test('rejection of invalid email', async () => {
    const event = {
      httpMethod: 'POST',
      body: JSON.stringify({ email: 'invalid' }),
      headers: {}
    };

    const res = await subscribe.handler(event, {});
    expect(res.statusCode).toBe(400);
  });

  test('OPTIONS preflight handling', async () => {
    const event = {
      httpMethod: 'OPTIONS',
      headers: {}
    };

    const res = await subscribe.handler(event, {});
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe('');
  });
});
