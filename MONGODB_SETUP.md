# MongoDB Atlas Setup Guide

This guide will help you set up MongoDB Atlas for your Youth Talks survey application.

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Sign up for a free account or log in if you already have one

## Step 2: Create a New Cluster

1. Click "Create a New Cluster"
2. Choose the **FREE** tier (M0 Sandbox)
3. Select a cloud provider and region (closest to you)
4. Give your cluster a name (e.g., "youth-talks-cluster")
5. Click "Create Cluster" (this takes 1-3 minutes)

## Step 3: Create Database User

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and password (remember these!)
5. Set database user privileges to "Atlas Admin" for simplicity
6. Click "Add User"

## Step 4: Configure Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development, click "Allow Access from Anywhere" (0.0.0.0/0)
   - **Note**: In production, restrict this to your server's IP
4. Click "Confirm"

## Step 5: Get Connection String

1. Go back to "Clusters"
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and latest version
5. Copy the connection string

It will look like:

```
mongodb+srv://<username>:<password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

## Step 6: Update Environment File

1. Open `Brand/.env` file
2. Replace the `MONGO_URI` value with your connection string
3. Replace `<username>` and `<password>` with your actual credentials
4. Add `/youth_talks` before the `?` to specify the database name

**Example:**

```env
MONGO_URI=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/youth_talks?retryWrites=true&w=majority
```

## Step 7: Test Connection

1. Save the `.env` file
2. Restart your development server
3. You should see "✅ MongoDB Connected" in the console

## Database Collections

The application will automatically create these collections:

- **users** - User accounts and authentication
- **forms** - Survey forms and questions
- **surveyresponses** - User responses to surveys
- **categories** - Survey categories

## Sample Data

The application includes a seeding system that will populate your database with sample data on first run:

- Sample categories (Food & Beverages, Entertainment, etc.)
- Demo users (admin and regular user)
- Sample survey forms with questions
- You can log in with:
  - Email: `sudhansu@youthtalks.com`
  - Password: `password123`

## Troubleshooting

### Connection Issues

- **ENOTFOUND error**: Check your connection string
- **Authentication failed**: Verify username/password
- **IP not whitelisted**: Check Network Access settings

### Environment Variables

- Make sure `.env` file is in the `Brand/` directory
- Restart the server after changing `.env`
- Check for typos in the connection string

## Security Notes

- Change the JWT_SECRET in production
- Use IP whitelisting instead of allowing all IPs
- Create database users with minimal required permissions
- Enable MongoDB Atlas security features like encryption

## Need Help?

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Connection String Format](https://docs.mongodb.com/manual/reference/connection-string/)
- Check the server console for detailed error messages
