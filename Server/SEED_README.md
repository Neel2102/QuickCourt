# Quickcourt Database Seeding Guide

This guide will help you set up and seed your Quickcourt database with sample data.

## Prerequisites

1. **MongoDB**: Make sure MongoDB is running on your system
2. **Node.js**: Ensure Node.js is installed (version 14 or higher)
3. **Dependencies**: Install server dependencies

## Setup Instructions

### 1. Install Dependencies

Navigate to the Server directory and install dependencies:

```bash
cd Server
npm install
```

### 2. Environment Configuration

Create a `.env` file in the Server directory with the following variables:

```env
# Database Configuration
MONGODB_URL=mongodb://localhost:27017/quickcourt

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Email Configuration (for nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Twilio Configuration (for SMS)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Server Configuration
PORT=5000
NODE_ENV=development
```

**Note**: For basic seeding, you only need the `MONGODB_URL` variable. Other variables are optional and can be added later.

### 3. Start MongoDB

Make sure MongoDB is running. If you're using MongoDB locally:

```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
```

### 4. Run the Seed Script

Execute the seed script to populate your database:

```bash
npm run seed
```

Or run it directly:

```bash
node seedData.js
```

## What Gets Seeded

The seed script will create:

### Users (7 total)
- **Admin User**: `admin@quickcourt.com` / `admin123`
- **Regular Users**: `john@example.com`, `sarah@example.com`, `david@example.com`, `emma@example.com` / `password123`
- **Facility Owners**: `mike@example.com`, `lisa@example.com` / `password123`

### Venues (5 total)
- Elite Sports Complex (Multi-sport)
- Tennis Paradise (Tennis only)
- Badminton Center (Badminton only)
- Football Fields Complex (Football only)
- Cricket Ground (Cricket only)

### Courts (11 total)
- Multiple courts per venue with different pricing
- Various operating hours
- Different sport types

### Reviews
- Sample reviews for each venue
- Random ratings and comments

### Time Slots
- 30 days of time slots for each court
- Some slots marked as booked (30% chance)

### Bookings
- 20 sample bookings
- Various statuses (Confirmed, Completed, Cancelled)

## Database Schema

The seed script creates data according to these models:

- **User**: Basic user information with roles (admin, facility owner, regular user)
- **Venue**: Sports facilities with addresses, amenities, and ratings
- **Court**: Individual playing areas within venues
- **Review**: User feedback for venues
- **TimeSlot**: Available time slots for each court
- **Booking**: Court reservations by users

## Troubleshooting

### Common Issues

1. **Connection Error**: Ensure MongoDB is running and accessible
2. **Permission Error**: Check if you have write access to the database
3. **Duplicate Key Error**: The script clears existing data, so this shouldn't occur

### Reset Database

To completely reset and reseed:

```bash
# Stop the server if running
# Then run the seed script again
npm run seed
```

## Next Steps

After seeding:

1. Start your server: `npm run dev`
2. Test the API endpoints
3. Use the provided credentials to log in and test different user roles
4. Customize the seed data as needed for your development

## Customization

You can modify the `seedData.js` file to:
- Add more users, venues, or courts
- Change pricing structures
- Modify operating hours
- Add different sport types
- Customize sample data

## Support

If you encounter issues:
1. Check MongoDB connection
2. Verify environment variables
3. Check console output for specific error messages
4. Ensure all dependencies are installed
