# Email Subscription Setup

This guide explains how to set up the email subscription system using Google Sheets as the backend.

## 1. Create Google Sheets API Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

4. Create a service account:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Fill in the details and create
   - Download the JSON key file

## 2. Create Google Sheet

1. Create a new Google Sheet
2. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)
3. Share the sheet with your service account email (found in the JSON file)
   - Give "Editor" permissions

## 3. Set Netlify Environment Variables

In your Netlify dashboard, go to Site Settings > Environment Variables and add:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----"
GOOGLE_SHEET_ID=your_google_sheet_id_here
```

**Important:** For the private key, copy the entire key including the BEGIN/END lines, and make sure newlines are properly escaped as `\n`.

## 4. Test the Setup

1. Deploy to Netlify
2. Visit your site and try subscribing with an email
3. Check your Google Sheet - a new row should appear with the email

## Sheet Structure

The function will automatically create a "Subscribers" sheet with columns:
- Email
- Subscribed At (timestamp)
- IP Address (for basic analytics)

## Security Notes

- Never commit the service account JSON file to your repository
- Use environment variables for all sensitive data
- The Google Sheet should only be shared with the service account
- Consider adding rate limiting for production use

## Troubleshooting

- If you get authentication errors, double-check the service account email and private key
- Make sure the Google Sheet is shared with the correct service account email
- Verify the Sheet ID is correct (from the URL)
- Check Netlify function logs for detailed error messages