# Vercel Deployment Guide

This portfolio is configured for deployment on Vercel with the following structure:
- **Frontend**: Static site served from `portfolio-frontend/`
- **Backend**: Serverless API functions in `api/` folder

## Prerequisites

1. **GitHub/GitLab/Bitbucket Account** - Your code must be version controlled
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Gmail App Password** - For the contact form feature

## Setup Instructions

### Step 1: Prepare Environment Variables

1. Go to your [Gmail Account Settings](https://myaccount.google.com/apppasswords)
2. Enable 2-Factor Authentication if not already enabled
3. Generate an App Password (16 characters) for "Mail" and "Windows"
4. Copy the generated password

### Step 2: Push Code to Git

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Select your Git repository
4. Configure project settings:
   - **Framework Preset**: Static (or leave as "Other")
   - **Root Directory**: Leave empty (default)
   - **Build Command**: Leave empty
   - **Output Directory**: `portfolio-frontend`

### Step 4: Add Environment Variables

1. Before deploying, go to project settings
2. Navigate to "Environment Variables"
3. Add the following variables:
   - **MAIL_USER**: your-email@gmail.com
   - **MAIL_PASS**: your-app-password (16 chars)

4. Click "Deploy"

## Project Structure

```
.
├── api/                          # Serverless API functions
│   └── contact.js               # GET/POST /api/contact endpoint
├── portfolio-frontend/           # Static frontend files
│   ├── index.html
│   ├── main.js
│   ├── style.css
│   └── assets/
├── portfolio-backend/            # (Deprecated - keeping for reference)
├── vercel.json                   # Vercel configuration
├── .env.example                  # Environment variables template
└── .vercelignore                 # Files to ignore during build
```

## API Endpoints

### POST /api/contact

Sends a contact form email.

**Request Body:**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "message": "Your message here"
}
```

**Response (Success):**
```json
{
  "message": "Message sent successfully! I will get back to you soon."
}
```

**Response (Error):**
```json
{
  "message": "Error description"
}
```

## Updating the Frontend API Endpoint

Make sure your contact form in `portfolio-frontend/main.js` uses the correct API endpoint:

```javascript
const response = await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    full_name: fullNameInput.value,
    email: emailInput.value,
    message: messageInput.value
  })
});
```

## Troubleshooting

### Contact Form Not Working
- Check that environment variables are set in Vercel project settings
- Verify Gmail App Password is correct (not your regular password)
- Check browser console and Vercel logs for errors

### Static Files Not Loading
- Ensure `public` path in vercel.json points to `portfolio-frontend`
- Check that asset paths in HTML are relative (e.g., `./assets/img/`)

### Deploy Fails
- Check Vercel build logs
- Ensure all required files are committed to Git
- Verify no sensitive data in repository (use environment variables)

## Automatic Deployments

Once connected to Git, Vercel will automatically deploy when you:
- Push to your main branch
- Create a pull request (preview deployment)
- Merge a pull request to main branch

## Custom Domain Setup

1. Go to Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions provided by Vercel

## Next Steps

- Add SSL certificate (automatic with Vercel)
- Set up analytics in Vercel dashboard
- Monitor API usage and performance
- Configure additional environment-specific variables if needed

For more help, visit [Vercel Documentation](https://vercel.com/docs)
