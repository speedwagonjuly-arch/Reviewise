# Quick Start Guide: From Local to Vercel Deployment

## Phase 1: Prepare Your Frontend Files (5 minutes)

### 1. Copy all HTML files to `public/` folder
1. Move `start.html` → `public/start.html`
2. Move `dashboard.html` → `public/dashboard.html`
3. Move `quiz.html` → `public/quiz.html`
4. Move `admin-login.html` → `public/admin-login.html`
5. Move `login.html` → `public/login.html` (we created this)
6. Move `register.html` → `public/register.html` (we created this)

### 2. Copy static assets to `public/`
1. Move `ui-theme.css` → `public/ui-theme.css`
2. Move `logo.png` → `public/logo.png`
3. Move `sda.pdf`, `STS.pdf` → `public/` (PDFs in public folder)

### 3. The server will automatically serve these files

Your folder structure should look like:
```
reviewise/
├── api/                          (API backend)
├── public/                       (Frontend - served by Express)
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── start.html
│   ├── dashboard.html
│   ├── quiz.html
│   ├── admin-login.html
│   ├── ui-theme.css
│   ├── logo.png
│   ├── api-client.js
│   ├── sda.pdf
│   └── STS.pdf
├── server.js
├── package.json
└── .env
```

## Phase 2: Update Your HTML Files (15 minutes)

For each HTML file in `public/`, add this to the `<head>`:
```html
<script src="api-client.js"></script>
```

### Example: Update `dashboard.html`

Replace all localStorage calls:

**OLD:**
```javascript
const dashboardItems = JSON.parse(localStorage.getItem('dashboardItems') || '[]');
```

**NEW:**
```javascript
const dashboardItems = await api.getDashboardItems();
```

**OLD:**
```javascript
localStorage.setItem('dashboardItems', JSON.stringify(items));
```

**NEW:**
```javascript
await api.updateDashboardItem(itemId, itemData);
```

### Key API replacements:

| Old (localStorage) | New (API) |
|---|---|
| `JSON.parse(localStorage.getItem('users'))` | `await api.getCurrentUser()` |
| `localStorage.getItem('dashboardItems')` | `await api.getDashboardItems()` |
| `localStorage.setItem('dashboardItems', ...)` | `await api.updateDashboardItem(id, data)` |
| `localStorage.getItem('aiSettings')` | `await api.getAISettings()` |
| `localStorage.getItem('leaderboard')` | `await api.getLeaderboard()` |

### Authentication: On login/register success
```javascript
// Already handled by api-client.js
// Token is automatically stored and sent with future requests
```

### Full list of API methods available:
```javascript
// Auth
api.register(username, email, password)
api.login(username, password)
api.getCurrentUser()

// Dashboard
api.getDashboardItems()
api.getDashboardItem(id)
api.createDashboardItem(data)
api.updateDashboardItem(id, data)
api.deleteDashboardItem(id)
api.addHandout(itemId, filename, url)
api.generateQuiz(itemId, generatedQuiz)

// Quiz
api.submitQuizResult(itemId, answers, score, totalQuestions, timeSpent)
api.getUserResults()
api.getLeaderboard()
api.getItemLeaderboard(itemId)
api.resetLeaderboard()

// AI Settings
api.getAISettings()
api.updateAISettings(apiKey, model, endpoint)
api.clearAPIKey()
```

## Phase 3: Test Locally (10 minutes)

### 1. Install dependencies
```bash
npm install
```

### 2. Create `.env` file
```env
MONGODB_URI=mongodb://localhost:27017/reviewise
JWT_SECRET=test-secret-key
NODE_ENV=development
PORT=5000
```

### 3. Make sure MongoDB is running
```bash
# If you have MongoDB installed locally
mongod
```

### 4. Start the server
```bash
npm start
```

### 5. Open in browser
```
http://localhost:5000
```

### 6. Test the workflow
- Create an account at `/register.html`
- Login at `/login.html`
- Navigate to dashboard
- Everything should work!

## Phase 4: Deploy to Vercel (5 minutes)

### Option A: Via GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: full-stack Reviewise"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/reviewise.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Click "Deploy"

   If Vercel asks visitors to log in before they can see the app, open the project in Vercel and set **Deployment Protection** to **None** for the production deployment. That gate is managed in Vercel, not by the app.

3. **Add Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add:
     ```
     MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/reviewise
     JWT_SECRET = generate-random-string-for-production
     NODE_ENV = production
     ```
   - Click "Deploy" again (or wait for auto-deploy to pick up variables)

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts and add environment variables when asked
```

## Phase 5: Set Up MongoDB Atlas (5 minutes)

If you don't have a MongoDB database yet:

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new project and cluster
4. Go to Database → Connect
5. Copy the connection string: `mongodb+srv://username:password@cluster.mongodb.net/mydb`
6. Replace `mydb` with `reviewise`
7. Get API credentials from "Database Access"
8. Use this in your `.env` and Vercel environment variables

## Phase 6: Set Up Initial Admin User

After deploying, you need an admin user. Two options:

### Option A: Use MongoDB Atlas UI
1. Go to Collections in your database
2. Create a document in `users` collection:
   ```json
   {
     "username": "admin",
     "email": "admin@reviewise.com",  
     "password": "hashed-password-here",
     "isAdmin": true
   }
   ```

### Option B: Register, then manually promote
1. Register a regular account on your Vercel app
2. Go to MongoDB Collections → users → find your user
3. Set `isAdmin: true`

## Done! 🎉

Your app is now running on Vercel with:
- ✅ Multi-user support
- ✅ Persistent MongoDB storage
- ✅ Global leaderboard
- ✅ Admin controls
- ✅ AI quiz generation
- ✅ Automatic scaling

## Troubleshooting

### "Cannot connect to MongoDB"
- Check `MONGODB_URI` is correct
- Check MongoDB Atlas firewall (add 0.0.0.0/0 for testing)
- Check credentials are correct

### "JWT authentication failed"
- Try clearing browser localStorage
- Make sure JWT_SECRET is set in Vercel
- Try logging in again

### "API not found (404)"
- Check all HTML files are in `public/` folder
- Check file is being served: `vercel logs`
- Check `server.js` routes are correct

### "Still seeing localStorage errors"
- Search your HTML for `localStorage` and replace with API calls
- Check `api-client.js` is loaded in `<head>`
- Check browser console for JavaScript errors

## Next Steps

1. ✅ Set up admin user
2. Create some dashboard items
3. Configure AI settings with OpenAI API key
4. Upload PDF handouts
5. Generate quizzes
6. Share the app with users!
