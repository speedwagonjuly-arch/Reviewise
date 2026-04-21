# Reviewise - Multi-User AI Quiz Platform

A full-stack web application for creating and managing AI-generated quizzes with multi-user support, leaderboards, and admin controls.

## Architecture

- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Frontend**: Vanilla JavaScript + HTML/CSS
- **Deployment**: Vercel

## Features

- User authentication with JWT
- Admin dashboard for managing quiz items
- AI-powered quiz generation from PDF handouts using OpenAI API
- Real-time leaderboards
- Quiz result tracking
- Per-item quiz generation and management

## Project Structure

```
reviewise/
├── api/
│   ├── models/           # MongoDB schemas
│   │   ├── User.js
│   │   ├── DashboardItem.js
│   │   ├── QuizResult.js
│   │   └── AISettings.js
│   ├── routes/           # API endpoints
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── quiz.js
│   │   └── ai-settings.js
│   └── middleware/       # Middleware
│       └── auth.js
├── public/               # Frontend files (HTML, CSS, JS)
├── server.js            # Express server entry point
├── package.json
├── vercel.json          # Vercel configuration
└── .env.example         # Environment variables template
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up MongoDB

Choose one of the following:

**Option A: MongoDB Atlas (Cloud - Recommended for Vercel)**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/reviewise`

**Option B: Local MongoDB**
```bash
# Make sure MongoDB is running
mongod

# Connection string: mongodb://localhost:27017/reviewise
```

### 3. Create Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/reviewise
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
PORT=5000
```

### 4. Run Locally

```bash
npm start
```

Server will run on `http://localhost:5000`

## Deployment to Vercel

### Step 1: Prepare for Deployment

1. Ensure all files are in the correct structure
2. Update `vercel.json` with your preferred configuration
3. Push your code to GitHub

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project" and import your GitHub repository
3. Select "Other" for the framework

### Step 3: Set Environment Variables

In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add the following variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string (change from example)
   - `NODE_ENV`: `production`

### Step 4: Deploy

Click "Deploy" - Vercel will automatically deploy your application

Your app will be live at `https://your-project-name.vercel.app`

If Vercel shows its own sign-in gate before the app loads, open the project in the Vercel dashboard and set **Deployment Protection** to **None** for the production deployment. That Vercel login prompt is separate from the app's JWT login.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Dashboard Items
- `GET /api/dashboard` - Get all items
- `GET /api/dashboard/:id` - Get specific item
- `POST /api/dashboard` - Create new item (admin only)
- `PUT /api/dashboard/:id` - Update item (admin only)
- `DELETE /api/dashboard/:id` - Delete item (admin only)
- `POST /api/dashboard/:id/generate-quiz` - Generate AI quiz (admin only)

### Quiz
- `POST /api/quiz/submit` - Submit quiz result
- `GET /api/quiz/user/results` - Get user's quiz results
- `GET /api/quiz/leaderboard` - Get global leaderboard
- `GET /api/quiz/item/:itemId/leaderboard` - Get item-specific leaderboard
- `POST /api/quiz/admin/reset-leaderboard` - Reset leaderboard (admin only)

### AI Settings
- `GET /api/ai-settings` - Get AI settings (admin only)
- `PUT /api/ai-settings` - Update AI settings (admin only)
- `POST /api/ai-settings/clear-key` - Clear API key (admin only)

## Frontend Setup

### Copy Files to `public/` Folder

1. Copy all HTML files from root to `public/`:
   - `start.html` → `public/start.html`
   - `dashboard.html` → `public/dashboard.html`
   - `quiz.html` → `public/quiz.html`
   - `admin-login.html` → `public/admin-login.html`

2. Copy static files:
   - `ui-theme.css` → `public/ui-theme.css`
   - `logo.png` → `public/logo.png`
   - Any PDF files or other assets → `public/`

3. Create `public/index.html`:
   ```html
   <!DOCTYPE html>
   <html>
   <head>
       <meta http-equiv="refresh" content="0; url=/login.html" />
   </head>
   </html>
   ```

### Update Frontend Files

Update all HTML files to:
1. Include `<script src="api-client.js"></script>` in the `<head>`
2. Replace all `localStorage` calls with `api` client calls
3. Replace direct data operations with API calls

Example transformation:

**Before (localStorage):**
```javascript
const users = JSON.parse(localStorage.getItem('users') || '[]');
users.push(newUser);
localStorage.setItem('users', JSON.stringify(users));
```

**After (API):**
```javascript
await api.register(username, email, password);
```

## Admin Credentials (Initial Setup)

First admin user needs to be created via:
1. Register a new account at `/register.html`
2. Manually update database to set `isAdmin: true`

OR

Add initial admin in `server.js` before starting:
```javascript
// Add this after MongoDB connects
const User = require('./api/models/User');
const existingAdmin = await User.findOne({ username: 'admin' });
if (!existingAdmin) {
  const adminUser = new User({
    username: 'admin',
    email: 'admin@reviewise.com',
    password: 'change-me-in-production',
    isAdmin: true
  });
  await adminUser.save();
}
```

## AI Integration

### Setting Up OpenAI

1. Get API key from [openai.com/api/](https://openai.com/platform/api-keys)
2. Login to admin panel
3. Go to AI Settings
4. Enter your API key
5. Choose model (default: gpt-4o-mini)
6. Enter endpoint (default: https://api.openai.com/v1/chat/completions)

### Supported Models
- `gpt-4o-mini` (default, cheapest)
- `gpt-4`
- `gpt-4-turbo`
- `gpt-3.5-turbo`

## Troubleshooting

### MongoDB Connection Error
- Verify connection string in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure Node.js version is 18.x or higher

### JWT Token Errors
- Token may be expired (valid for 7 days)
- Clear browser localStorage and login again
- Check `JWT_SECRET` matches on server

### API Not Found (404)
- Ensure API routes are correctly registered in `server.js`
- Check file paths in `api/routes/`
- Verify `server.js` is the entry point in `vercel.json`

### Vercel Deployment Fails
- Check logs in Vercel dashboard
- Ensure `package.json` and `vercel.json` are in root
- Verify environment variables are set in Vercel
- If users are forced to sign in to Vercel before seeing the app, disable **Deployment Protection** in the project settings or deploy the public production domain instead of a protected preview URL.

## Development Tips

### Testing Locally
```bash
npm start
# Open http://localhost:5000
```

### Database Inspection
Use MongoDB Compass or Atlas UI to view data

### API Testing
Use Postman or cURL:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass"}'
```

## Security Notes

⚠️ **Important for Production:**
1. Change `JWT_SECRET` to a secure random string
2. Use environment variables for all sensitive data
3. Enable HTTPS (automatic on Vercel)
4. Set up CORS properly for your domain
5. Validate all user inputs on both client and server
6. Use MongoDB IP whitelist to restrict access
7. Keep dependencies updated: `npm update`

## License

MIT

## Support

For issues, check:
1. Browser console for errors
2. Server logs
3. MongoDB connection
4. Vercel deployment logs
5. Environment variables configuration
