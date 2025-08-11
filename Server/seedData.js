import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { connection } from './database/dbconnection.js';
import userModel from './models/userModel.js';
import venueModel from './models/venueModel.js';
import courtModel from './models/courtModel.js';
import reviewModel from './models/reviewModel.js';
import timeSlotModel from './models/timeSlotModel.js';
import bookingModel from './models/bookingModel.js';

dotenv.config();

// Sample data arrays
const users = [
    {
        name: 'Admin User',
        email: 'admin@quickcourt.com',
        password: 'admin123',
        isAccountVerified: true,
        isAdmin: true,
        isFacilityOwner: false,
        bio: 'System Administrator'
    },
    {
        name: 'John Smith',
        email: 'john@example.com',
        password: 'password123',
        isAccountVerified: true,
        isAdmin: false,
        isFacilityOwner: false,
        bio: 'Tennis enthusiast'
    },
    {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        password: 'password123',
        isAccountVerified: true,
        isAdmin: false,
        isFacilityOwner: false,
        bio: 'Badminton player'
    },
    {
        name: 'Mike Wilson',
        email: 'mike@example.com',
        password: 'password123',
        isAccountVerified: true,
        isAdmin: false,
        isFacilityOwner: true,
        bio: 'Sports facility owner'
    },
    {
        name: 'Lisa Brown',
        email: 'lisa@example.com',
        password: 'password123',
        isAccountVerified: true,
        isAdmin: false,
        isFacilityOwner: true,
        bio: 'Multi-sport facility manager'
    },
    {
        name: 'David Lee',
        email: 'david@example.com',
        password: 'password123',
        isAccountVerified: true,
        isAdmin: false,
        isFacilityOwner: false,
        bio: 'Football player'
    },
    {
        name: 'Emma Davis',
        email: 'emma@example.com',
        password: 'password123',
        isAccountVerified: true,
        isAdmin: false,
        isFacilityOwner: false,
        bio: 'Cricket enthusiast'
    }
];

const venues = [
    {
        name: 'Elite Sports Complex',
        description: 'Premium multi-sport facility with state-of-the-art equipment and professional coaching staff.',
        address: {
            street: '123 Sports Avenue',
            city: 'New York',
            state: 'NY',
            postalCode: '10001'
        },
        sportTypes: ['Tennis', 'Badminton', 'Football'],
        amenities: ['Parking', 'Shower Facilities', 'Equipment Rental', 'Pro Shop', 'Café'],
        photos: ['https://example.com/elite-sports-1.jpg', 'https://example.com/elite-sports-2.jpg'],
        isApproved: true,
        rating: 4.8,
        numberOfReviews: 45
    },
    {
        name: 'Tennis Paradise',
        description: 'Exclusive tennis facility with clay and hard courts, perfect for both beginners and professionals.',
        address: {
            street: '456 Tennis Court Road',
            city: 'Los Angeles',
            state: 'CA',
            postalCode: '90210'
        },
        sportTypes: ['Tennis'],
        amenities: ['Clay Courts', 'Hard Courts', 'Ball Machine', 'Pro Shop', 'Tennis Academy'],
        photos: ['https://example.com/tennis-paradise-1.jpg'],
        isApproved: true,
        rating: 4.9,
        numberOfReviews: 32
    },
    {
        name: 'Badminton Center',
        description: 'Dedicated badminton facility with multiple courts and professional coaching.',
        address: {
            street: '789 Badminton Lane',
            city: 'Chicago',
            state: 'IL',
            postalCode: '60601'
        },
        sportTypes: ['Badminton'],
        amenities: ['Multiple Courts', 'Professional Coaching', 'Tournament Facilities', 'Equipment Rental'],
        photos: ['https://example.com/badminton-center-1.jpg'],
        isApproved: true,
        rating: 4.7,
        numberOfReviews: 28
    },
    {
        name: 'Football Fields Complex',
        description: 'Large football complex with multiple fields, perfect for training and matches.',
        address: {
            street: '321 Football Street',
            city: 'Miami',
            state: 'FL',
            postalCode: '33101'
        },
        sportTypes: ['Football'],
        amenities: ['Multiple Fields', 'Floodlights', 'Parking', 'Refreshment Stand', 'Equipment Storage'],
        photos: ['https://example.com/football-complex-1.jpg'],
        isApproved: true,
        rating: 4.6,
        numberOfReviews: 38
    },
    {
        name: 'Cricket Ground',
        description: 'Professional cricket ground with proper pitch and facilities for tournaments.',
        address: {
            street: '654 Cricket Avenue',
            city: 'Houston',
            state: 'TX',
            postalCode: '77001'
        },
        sportTypes: ['Cricket'],
        amenities: ['Professional Pitch', 'Pavilion', 'Scoreboard', 'Practice Nets', 'Parking'],
        photos: ['https://example.com/cricket-ground-1.jpg'],
        isApproved: true,
        rating: 4.5,
        numberOfReviews: 25
    }
];

const courts = [
    // Elite Sports Complex courts
    {
        name: 'Tennis Court 1',
        sportType: 'Tennis',
        pricePerHour: 45,
        operatingHours: {
            start: '06:00',
            end: '22:00'
        }
    },
    {
        name: 'Tennis Court 2',
        sportType: 'Tennis',
        pricePerHour: 45,
        operatingHours: {
            start: '06:00',
            end: '22:00'
        }
    },
    {
        name: 'Badminton Court 1',
        sportType: 'Badminton',
        pricePerHour: 25,
        operatingHours: {
            start: '08:00',
            end: '23:00'
        }
    },
    {
        name: 'Badminton Court 2',
        sportType: 'Badminton',
        pricePerHour: 25,
        operatingHours: {
            start: '08:00',
            end: '23:00'
        }
    },
    {
        name: 'Football Field 1',
        sportType: 'Football',
        pricePerHour: 80,
        operatingHours: {
            start: '06:00',
            end: '22:00'
        }
    },
    // Tennis Paradise courts
    {
        name: 'Clay Court 1',
        sportType: 'Tennis',
        pricePerHour: 60,
        operatingHours: {
            start: '07:00',
            end: '21:00'
        }
    },
    {
        name: 'Hard Court 1',
        sportType: 'Tennis',
        pricePerHour: 55,
        operatingHours: {
            start: '07:00',
            end: '21:00'
        }
    },
    // Badminton Center courts
    {
        name: 'Badminton Court A',
        sportType: 'Badminton',
        pricePerHour: 30,
        operatingHours: {
            start: '08:00',
            end: '23:00'
        }
    },
    {
        name: 'Badminton Court B',
        sportType: 'Badminton',
        pricePerHour: 30,
        operatingHours: {
            start: '08:00',
            end: '23:00'
        }
    },
    // Football Fields Complex
    {
        name: 'Main Football Field',
        sportType: 'Football',
        pricePerHour: 100,
        operatingHours: {
            start: '06:00',
            end: '22:00'
        }
    },
    // Cricket Ground
    {
        name: 'Main Cricket Pitch',
        sportType: 'Cricket',
        pricePerHour: 120,
        operatingHours: {
            start: '08:00',
            end: '18:00'
        }
    }
];

const reviews = [
    {
        rating: 5,
        comment: 'Excellent facilities and very professional staff. Highly recommended!'
    },
    {
        rating: 4,
        comment: 'Great courts and good value for money. Will definitely come back.'
    },
    {
        rating: 5,
        comment: 'Perfect for both beginners and advanced players. Love the atmosphere.'
    },
    {
        rating: 4,
        comment: 'Well-maintained courts and friendly staff. Good experience overall.'
    },
    {
        rating: 5,
        comment: 'Best sports facility in the area. Clean and professional.'
    }
];

// Function to hash passwords
async function hashPasswords() {
    for (let user of users) {
        user.password = await bcrypt.hash(user.password, 10);
    }
}

// Function to seed users
async function seedUsers() {
    try {
        // Clear existing users
        await userModel.deleteMany({});
        
        // Hash passwords and create users
        await hashPasswords();
        const createdUsers = await userModel.insertMany(users);
        
        console.log('✅ Users seeded successfully');
        return createdUsers;
    } catch (error) {
        console.error('❌ Error seeding users:', error);
        throw error;
    }
}

// Function to seed venues
async function seedVenues(users) {
    try {
        // Clear existing venues
        await venueModel.deleteMany({});
        
        // Assign owners to venues
        const facilityOwners = users.filter(user => user.isFacilityOwner);
        const venuesWithOwners = venues.map((venue, index) => ({
            ...venue,
            owner: facilityOwners[index % facilityOwners.length]._id
        }));
        
        const createdVenues = await venueModel.insertMany(venuesWithOwners);
        
        console.log('✅ Venues seeded successfully');
        return createdVenues;
    } catch (error) {
        console.error('❌ Error seeding venues:', error);
        throw error;
    }
}

// Function to seed courts
async function seedCourts(venues) {
    try {
        // Clear existing courts
        await courtModel.deleteMany({});
        
        // Assign venues to courts
        const courtsWithVenues = [];
        let courtIndex = 0;
        
        for (let venue of venues) {
            const venueCourts = courts.filter(court => {
                if (venue.sportTypes.includes(court.sportType)) {
                    return true;
                }
                return false;
            });
            
            for (let court of venueCourts) {
                courtsWithVenues.push({
                    ...court,
                    venue: venue._id
                });
                courtIndex++;
            }
        }
        
        const createdCourts = await courtModel.insertMany(courtsWithVenues);
        
        console.log('✅ Courts seeded successfully');
        return createdCourts;
    } catch (error) {
        console.error('❌ Error seeding courts:', error);
        throw error;
    }
}

// Function to seed reviews
async function seedReviews(users, venues) {
    try {
        // Clear existing reviews
        await reviewModel.deleteMany({});
        
        const reviewsWithUsers = [];
        const regularUsers = users.filter(user => !user.isAdmin && !user.isFacilityOwner);
        
        for (let venue of venues) {
            const numReviews = Math.floor(Math.random() * 3) + 2; // 2-4 reviews per venue
            
            for (let i = 0; i < numReviews; i++) {
                const randomUser = regularUsers[Math.floor(Math.random() * regularUsers.length)];
                const randomReview = reviews[Math.floor(Math.random() * reviews.length)];
                
                reviewsWithUsers.push({
                    ...randomReview,
                    user: randomUser._id,
                    venue: venue._id
                });
            }
        }
        
        const createdReviews = await reviewModel.insertMany(reviewsWithUsers);
        
        console.log('✅ Reviews seeded successfully');
        return createdReviews;
    } catch (error) {
        console.error('❌ Error seeding reviews:', error);
        throw error;
    }
}

// Function to seed time slots
async function seedTimeSlots(courts) {
    try {
        // Clear existing time slots
        await timeSlotModel.deleteMany({});
        
        const timeSlots = [];
        const today = new Date();
        
        // Create time slots for the next 30 days
        for (let day = 0; day < 30; day++) {
            const date = new Date(today);
            date.setDate(today.getDate() + day);
            
            for (let court of courts) {
                const slots = [];
                const startHour = parseInt(court.operatingHours.start.split(':')[0]);
                const endHour = parseInt(court.operatingHours.end.split(':')[0]);
                
                for (let hour = startHour; hour < endHour; hour++) {
                    slots.push({
                        startTime: `${hour.toString().padStart(2, '0')}:00`,
                        endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
                        isBooked: Math.random() < 0.3, // 30% chance of being booked
                        bookingId: null
                    });
                }
                
                timeSlots.push({
                    court: court._id,
                    date: date,
                    slots: slots
                });
            }
        }
        
        const createdTimeSlots = await timeSlotModel.insertMany(timeSlots);
        
        console.log('✅ Time slots seeded successfully');
        return createdTimeSlots;
    } catch (error) {
        console.error('❌ Error seeding time slots:', error);
        throw error;
    }
}

// Function to seed sample bookings
async function seedBookings(users, venues, courts) {
    try {
        // Clear existing bookings
        await bookingModel.deleteMany({});
        
        const regularUsers = users.filter(user => !user.isAdmin && !user.isFacilityOwner);
        const bookings = [];
        
        // Create some sample bookings
        for (let i = 0; i < 20; i++) {
            const randomUser = regularUsers[Math.floor(Math.random() * regularUsers.length)];
            const randomVenue = venues[Math.floor(Math.random() * venues.length)];
            const venueCourts = courts.filter(court => court.venue.toString() === randomVenue._id.toString());
            
            if (venueCourts.length > 0) {
                const randomCourt = venueCourts[Math.floor(Math.random() * venueCourts.length)];
                const randomDate = new Date();
                randomDate.setDate(randomDate.getDate() + Math.floor(Math.random() * 30));
                
                const startHour = Math.floor(Math.random() * 8) + 8; // 8 AM to 4 PM
                const startTime = `${startHour.toString().padStart(2, '0')}:00`;
                const endTime = `${(startHour + 1).toString().padStart(2, '0')}:00`;
                
                const statuses = ['Confirmed', 'Completed', 'Cancelled'];
                const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
                
                bookings.push({
                    user: randomUser._id,
                    venue: randomVenue._id,
                    court: randomCourt._id,
                    date: randomDate,
                    startTime: startTime,
                    endTime: endTime,
                    totalPrice: randomCourt.pricePerHour,
                    status: randomStatus
                });
            }
        }
        
        const createdBookings = await bookingModel.insertMany(bookings);
        
        console.log('✅ Bookings seeded successfully');
        return createdBookings;
    } catch (error) {
        console.error('❌ Error seeding bookings:', error);
        throw error;
    }
}

// Main seeding function
async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...');
        
        // Connect to database
        await connection();
        
        // Wait a bit for connection to establish
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Seed data in order
        const createdUsers = await seedUsers();
        const createdVenues = await seedVenues(createdUsers);
        const createdCourts = await seedCourts(createdVenues);
        const createdReviews = await seedReviews(createdUsers, createdVenues);
        const createdTimeSlots = await seedTimeSlots(createdCourts);
        const createdBookings = await seedBookings(createdUsers, createdVenues, createdCourts);
        
        console.log('\n🎉 Database seeding completed successfully!');
        console.log(`📊 Seeded ${createdUsers.length} users`);
        console.log(`📊 Seeded ${createdVenues.length} venues`);
        console.log(`📊 Seeded ${createdCourts.length} courts`);
        console.log(`📊 Seeded ${createdReviews.length} reviews`);
        console.log(`📊 Seeded ${createdTimeSlots.length} time slot records`);
        console.log(`📊 Seeded ${createdBookings.length} bookings`);
        
        console.log('\n🔑 Default login credentials:');
        console.log('Admin: admin@quickcourt.com / admin123');
        console.log('Regular User: john@example.com / password123');
        console.log('Facility Owner: mike@example.com / password123');
        
        process.exit(0);
    } catch (error) {
        console.error('💥 Database seeding failed:', error);
        process.exit(1);
    }
}

// Run the seeding
seedDatabase();
