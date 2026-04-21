# 🚀 Quick Start: Run Reviewise Locally & Deploy

## ⚡ 5-Minute Local Setup

### Step 1: Install Dependencies
```bash
cd "c:\WEBSITES PROJECTS\Reviewise"
npm install
```

### Step 2: Get MongoDB Connection String

**Option A: MongoDB Atlas (Cloud - Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up free
3. Create a cluster
4. Click "Connect" → "Drivers" → Copy connection string
5. Look like this: `mongodb+srv://username:password@cluster0.xxxx.mongodb.net/reviewise?retryWrites=true&w=majority`

**Option B: Local MongoDB**
1. Install MongoDB locally
2. Run: `mongod`
3. Use: `mongodb://localhost:27017/reviewise`

### Step 3: Create `.env` File
Create a file named `.env` in root folder `c:\WEBSITES PROJECTS\Reviewise\.env`:

```env
MONGODB_URI=your-connection-string-here
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
PORT=5000
```

### Step 4: Start Server
```bash
npm start
```

Open browser: **http://localhost:5000**

### Step 5: Test It Out
1. **Register**: Create a test account at `/register.html`
2. **Login**: Go to `/login.html` 
3. **Dashboard**: Should see empty items (no items in MongoDB yet)
4. **Admin Panel**: Click 👤 icon → admin-login required
   - First, you need to make your account admin in MongoDB
   - Or create initial admin (see below)

---

## 👨‍💼 Make Your First Account Admin

### Option 1: Via MongoDB Atlas UI (Easiest)
1. Go to MongoDB Atlas Dashboard
2. Click Clusters → Collections → your database → `users`
3. Find your registered user document
4. Edit it → set `isAdmin: true`
5. Click Update
6. Now you can access admin panel!

### Option 2: Via MongoDB Compass (If you have MongoDB locally)
1. Open MongoDB Compass
2. Connect to your database
3. Navigate to: user collection
4. Find your user
5. Change `isAdmin` to `true`

---

## 🔑 Admin Features (Once You're Admin)

After logging in with admin account, click admin icon (👤) to access:

1. **AI Quiz Generator Setup**
   - Add OpenAI API key
   - Optionally change model/endpoint
   - Click "Save AI Settings"

2. **Add Dashboard Item**
   - Enter title, description
   - Upload PDF file (handout)
   - Click "Add Item"

3. **Generate AI Quiz**
   - Click "Generate" on an item
   - AI extracts PDF text + calls OpenAI
   - Generated questions save to that item

4. **Reset Leaderboard**
   - Clears all user scores
   - Warning: Can't undo!

---

## 📊 Database Schema (What Gets Created)

When you login, MongoDB creates these collections:

**users** - User accounts
```json
{
  "_id": "...",
  "username": "testuser",
  "email": "test@example.com",
  "password": "hashed",
  "isAdmin": false,
  "score": 0,
  "quizzesCompleted": 0,
  "averageScore": 0,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**dashboarditems** - Quiz modules
```json
{
  "_id": "...",
  "title": "STS & SDA",
  "description": "Science & Statistics",
  "handouts": [{url: "...", uploadedAt: "..."}],
  "generatedQuiz": [{question: "...", options: [...], ...}],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

## 🌐 Deploy to Vercel (5 Minutes)

### Step 1: Push to GitHub
```bash
cd "c:\WEBSITES PROJECTS\Reviewise"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/reviewise.git
git push -u origin main
```

### Step 2: Connect to Vercel
1. Go to https://vercel.com
2. Sign up (use GitHub account)
3. Click "New Project"
4. Select your `reviewise` GitHub repo
5. Framework: Select "Other"
6. Click "Deploy"

### Step 3: Add Environment Variables
1. After deploy, go to Settings → Environment Variables
2. Add these variables:
   
   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | Your MongoDB connection string |
   | `JWT_SECRET` | Any random strong string |
   | `NODE_ENV` | `production` |

3. Click "Save"
4. Vercel auto-redeploys with new variables

### Step 4: Done! 🎉
Your app is live at: `https://your-project-name.vercel.app`

---

## 🔗 API Endpoints (For Reference)

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Dashboard
- `GET /api/dashboard` - Get all items
- `POST /api/dashboard` - Create item (admin only)
- `DELETE /api/dashboard/:id` - Delete item (admin only)

### Quiz
- `POST /api/quiz/submit` - Submit quiz results
- `GET /api/quiz/leaderboard` - Get top scores
- `POST /api/quiz/admin/reset-leaderboard` - Reset scores (admin only)

### AI Settings
- `GET /api/ai-settings` - Get settings (admin only)
- `PUT /api/ai-settings` - Update settings (admin only)

---

## ❓ Troubleshooting

### "Cannot connect to MongoDB"
- Double-check `MONGODB_URI` in `.env`
- Make sure MongoDB Atlas cluster is created
- Check firewall: Add `0.0.0.0/0` to IP whitelist in Atlas
- For local MongoDB: Make sure `mongod` is running

### "Invalid token" Error
- Clear browser localStorage: `localStorage.clear()`
- Log out and log back in
- Check `JWT_SECRET` is set in `.env`

### "API not found (404)"
- Make sure you're running `npm start`
- Check port 5000 is listening
- Verify `server.js` is the entry point

### "Admin login not working"
- Make sure user has `isAdmin: true` in MongoDB
- Clear sessionStorage: `sessionStorage.clear()`
- Refresh page and try again

---

## 📝 Next Steps

1. ✅ Test locally (`npm start`)
2. ✅ Create admin account
3. ✅ Add first dashboard item
4. ✅ Get OpenAI API key (optional, for AI generation)
5. ✅ Push to GitHub
6. ✅ Deploy to Vercel
7. ✅ Share link with users!

---

## 🎓 Example Workflow

### As Admin:
1. Login to http://localhost:5000/login.html
2. Click admin icon (👤) → admin-login.html
3. Add AI API key in setup
4. Click "Add Dashboard Item" → upload PDF
5. Click "Generate" → AI creates 30 questions
6. Download quiz JSON if needed

### As Regular User:
1. Register account
2. See dashboard with all items
3. Click "📖 Handouts" → view PDF
4. Click "🎯 Quiz" → take generated quiz
5. See score + points
6. Retry or go back

---

## 💡 Pro Tips

- **Default admin**: Create first account, manually set `isAdmin: true` in DB
- **Bulk items**: Use admin form to add multiple items
- **Cost**: MongoDB Atlas free tier = ∞ storage, Vercel free = ∞ deployments
- **OpenAI API**: ~$0.50/month per 100 quizzes generated (very cheap!)
- **Offline quiz**: Disable internet after downloading quiz JSON

Enjoy! 🚀
