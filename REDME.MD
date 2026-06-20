# Ghewari Typing Institute Website - Complete Setup Guide

## 📦 Project Files Overview

Your project includes:
1. **index.html** - Main website frontend (fully responsive)
2. **admin-panel.html** - Admin dashboard for content management
3. **server.js** - Node.js/Express backend server
4. **database.sql** - MySQL database schema and sample data
5. **package.json** - Project dependencies
6. **.env.example** - Environment configuration template
7. **README.md** - Complete documentation
8. **SETUP_GUIDE.md** - This setup guide

---

## 🚀 Step-by-Step Setup Instructions

### Prerequisites Check
Before starting, ensure you have:
- [ ] Node.js (v14+) installed
- [ ] MySQL (v5.7+) installed and running
- [ ] npm (v6+) installed
- [ ] Text editor (VS Code recommended)
- [ ] Command line/Terminal access

Check installed versions:
```bash
node --version    # Should show v14+
npm --version     # Should show v6+
mysql --version   # Should show v5.7+
```

---

## 📋 PHASE 1: Database Setup (15 minutes)

### Step 1: Create MySQL User
```bash
# Open MySQL command line
mysql -u root -p

# When prompted, enter your MySQL root password

# Create application user and grant permissions
CREATE USER 'ghewari_app'@'localhost' IDENTIFIED BY 'Secure@Pass123';

# Grant all permissions to the database (will be created next)
GRANT ALL PRIVILEGES ON ghewari_typing.* TO 'ghewari_app'@'localhost';

# Refresh permissions
FLUSH PRIVILEGES;

# Exit MySQL
EXIT;
```

### Step 2: Create Database and Tables
```bash
# Navigate to your project folder
cd /path/to/ghewari-typing-institute

# Import the database schema
mysql -u ghewari_app -p < database.sql

# When prompted, enter the password: Secure@Pass123

# Verify database creation
mysql -u ashirwad -p
USE ghewari_typing;
SHOW TABLES;  # Should show 9 tables
EXIT;
```

### Step 3: Verify Database Tables
```bash
mysql -u ghewari_app -p ghewari_typing -e "SHOW TABLES;"
```

Expected output:
```
Tables_in_ghewari_typing
courses
gallery
inquiries
institute_info
logs
notices
students
testimonials
users
```

---

## 🔧 PHASE 2: Backend Setup (10 minutes)

### Step 1: Install Node.js Dependencies
```bash
# Navigate to project directory
cd /path/to/ghewari-typing-institute

# Install all dependencies
npm install

# Wait for installation to complete (2-3 minutes)
```

### Step 2: Configure Environment Variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your details
# On Windows:
notepad .env

# On Mac/Linux:
nano .env
```

### Step 3: Update .env File
Edit .env and update these values:
```
# Database Configuration
DB_HOST=localhost
DB_USER=ghewari_app
DB_PASSWORD=Secure@Pass123    # Use the password you created
DB_NAME=ghewari_typing
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=development

# Email Configuration (optional for now)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=no-reply@ghewaritypinginstitute.com

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRY=7d

# Institute Information
INSTITUTE_NAME=Ghewari Typing Institute
INSTITUTE_PHONE1=+91 98765 43210
INSTITUTE_EMAIL=info@ghewaritypinginstitute.com
```

### Step 4: Test Backend Connection
```bash
# Start the server
npm start

# Expected output:
# Server running on http://localhost:5000
# API endpoints available at http://localhost:5000/api/
```

If you see errors:
- Check that MySQL is running
- Verify database credentials in .env
- Check that port 5000 is not in use

### Step 5: Stop the Server
Press `Ctrl + C` to stop the server

---

## 🌐 PHASE 3: Frontend Setup (5 minutes)

### Step 1: Customize Website
Edit **index.html** and update:

1. **Contact Information** (search for these sections):
```html
<!-- Find and update in Contact Section -->
Phone: +91 98765 43210
Address: 123, Main Street, Mumbai, Maharashtra 400001

<!-- Find and update in Footer -->
Email: info@ghewaritypinginstitute.com
```

2. **Institute Details** (search for these):
```html
<!-- Hero section message -->
Master Typing Skills in Marathi & English

<!-- About section -->
Ghewari Typing Institute is a leading professional...
```

3. **Social Media Links** (Footer section):
```html
<a href="https://facebook.com/yourpage" title="Facebook">
<a href="https://instagram.com/yourprofile" title="Instagram">
```

### Step 2: Customize Admin Panel
Edit **admin-panel.html** to match your branding:
- Change colors if needed
- Update company name
- Customize welcome message

---

## ▶️ PHASE 4: Running the Application (5 minutes)

### Terminal 1: Start Backend Server
```bash
# Navigate to project folder
cd /path/to/ghewari-typing-institute

# Start the server (development mode with auto-reload)
npm run dev

# Or for production
npm start

# You should see:
# Server running on http://localhost:5000
```

### Open in Browser
1. **Main Website**: http://localhost:5000
2. **Admin Panel**: http://localhost:5000/admin-panel.html
3. **API Documentation**: http://localhost:5000/api/

### Test the Website
- [ ] Navigate through all sections (Home, About, Courses, etc.)
- [ ] Test the inquiry form (fill it out)
- [ ] Check responsive design (resize browser)
- [ ] Open admin panel and verify data loads
- [ ] Test API endpoints using Postman (optional)

---

## 🧪 API Testing (Optional but Recommended)

### Using cURL in Terminal

**1. Get all courses:**
```bash
curl http://localhost:5000/api/courses
```

**2. Submit an inquiry:**
```bash
curl -X POST http://localhost:5000/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "mobile": "9876543210",
    "email": "test@example.com",
    "course": "english-beginner",
    "timing": "morning"
  }'
```

**3. Get all inquiries (admin):**
```bash
curl http://localhost:5000/api/admin/inquiries
```

### Using Postman (GUI Alternative)
1. Download Postman from https://postman.com
2. Create new requests for each endpoint
3. Test with different data
4. Save requests in collections

---

## 📱 File Structure for Production

Create this folder structure:
```
ghewari-typing-institute/
├── public/
│   ├── images/
│   ├── css/
│   └── js/
├── src/
│   ├── routes/
│   ├── controllers/
│   └── models/
├── index.html
├── admin-panel.html
├── server.js
├── database.sql
├── package.json
├── .env
├── .gitignore
├── README.md
└── SETUP_GUIDE.md
```

---

## 🚀 DEPLOYMENT OPTIONS

### Option 1: Local Network Access (LAN)
```bash
# Find your local IP
ipconfig (Windows) or ifconfig (Mac/Linux)

# Access from other computers
http://YOUR_LOCAL_IP:5000
```

### Option 2: Deploy to Heroku (Free/Paid)
```bash
# Install Heroku CLI
# Then run:
heroku login
heroku create ghewari-typing
git push heroku main
```

### Option 3: Deploy to AWS
1. Create EC2 instance
2. SSH into instance
3. Install Node.js and MySQL
4. Clone repository
5. Run application with PM2

### Option 4: Deploy to DigitalOcean
1. Create Droplet (Ubuntu 20.04)
2. Install Node.js and MySQL
3. Configure Nginx as reverse proxy
4. Use Certbot for SSL
5. Deploy application

### Option 5: Docker Deployment
```bash
# Create Dockerfile (provided in README)
docker build -t ghewari-typing .
docker run -p 5000:5000 --env-file .env ghewari-typing
```

---

## 🔒 Security Configuration

### Before Going Live:
1. **Change Passwords**
   - MySQL root password
   - Database user password
   - JWT secret in .env

2. **Update .env Production Values**
   ```
   NODE_ENV=production
   PORT=80 (or 443 for HTTPS)
   JWT_SECRET=generate-a-strong-random-secret
   ```

3. **Enable HTTPS**
   - Get SSL certificate (Let's Encrypt - free)
   - Configure Nginx or Apache as reverse proxy

4. **Set Firewall Rules**
   - Allow only HTTP (80) and HTTPS (443)
   - Restrict MySQL access to localhost only

5. **Regular Backups**
   ```bash
   # Backup MySQL database
   mysqldump -u ghewari_app -p ghewari_typing > backup.sql
   ```

---

## ⚙️ Maintenance Tasks

### Weekly
- [ ] Check error logs
- [ ] Review student inquiries
- [ ] Update notices if needed

### Monthly
- [ ] Backup database
- [ ] Review statistics
- [ ] Update testimonials

### Quarterly
- [ ] Update Node.js packages
- [ ] Review security logs
- [ ] Test disaster recovery

---

## 🐛 Common Issues & Solutions

### Issue 1: "Port 5000 already in use"
**Solution:**
```bash
# Find what's using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use different port in .env
PORT=8000
```

### Issue 2: "Cannot connect to MySQL"
**Solution:**
```bash
# Check MySQL is running
mysql -u root -p

# Check credentials in .env file
# Verify database exists
mysql -u ghewari_app -p -e "SHOW DATABASES;"
```

### Issue 3: "Node modules not found"
**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: "Form not submitting"
**Solution:**
- Check browser console for errors (F12)
- Verify backend is running
- Check CORS settings in server.js
- Test API directly with curl

### Issue 5: "Database tables not created"
**Solution:**
```bash
# Verify database
mysql -u ghewari_app -p ghewari_typing

# Reimport schema
mysql -u ghewari_app -p ghewari_typing < database.sql
```

---

## 📊 Next Steps

After successful setup:

1. **Customize Content**
   - Update course details
   - Add institute photos to gallery
   - Write about section
   - Add testimonials

2. **Configure Email** (Optional)
   - Set up Gmail SMTP
   - Create email templates
   - Send inquiry notifications

3. **Analytics Setup**
   - Add Google Analytics
   - Track form submissions
   - Monitor user behavior

4. **Payment Integration** (Optional)
   - Integrate Razorpay
   - Add online registration fees
   - Set up invoice generation

5. **Mobile App** (Optional)
   - React Native app
   - Flutter app

---

## 📞 Support Resources

- **Express.js Docs**: https://expressjs.com
- **MySQL Documentation**: https://dev.mysql.com
- **Node.js Docs**: https://nodejs.org
- **Bootstrap 5**: https://getbootstrap.com/docs/5.3
- **Font Awesome Icons**: https://fontawesome.com/icons

---

## ✅ Setup Checklist

- [ ] Node.js installed
- [ ] MySQL installed and running
- [ ] Database created and tables imported
- [ ] Environment variables configured
- [ ] Backend server running
- [ ] Website accessible at localhost:5000
- [ ] Admin panel accessible
- [ ] Form submissions working
- [ ] API endpoints responding
- [ ] Website customized with your details

---

## 🎉 Congratulations!

Your Ashirwad Typing Institute website is now ready to use!

**Next time you want to start it:**
```bash
# Terminal 1: Start backend
npm run dev

# Then open browser
http://localhost:5000
```

**To access admin panel:**
```
http://localhost:5000/admin-panel.html
```

---

**Last Updated:** June 2024  
**Version:** 1.0.0  
**Support:** info@ghewaritypinginstitute.com



<!-- Keep these commands handy. You will only need them if you manually turn off your script or need to check its status after turning on your comp/uter.-->

<!--

 1.pm2 list
2.cd OneDrive\Desktop\commecial2
3.pm2 start server.js --name my-fetcher

-->