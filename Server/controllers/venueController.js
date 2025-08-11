import venueModel from '../models/venueModel.js';
// Import cloudinary and other services here for image uploads

// Get all approved venues for the public Venues page 
export const getAllVenues = async (req, res) => {
    try {
        const venues = await venueModel.find({ isApproved: true });
        res.json({ success: true, data: venues });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get single venue details 
export const getVenueDetails = async (req, res) => {
    try {
        const venue = await venueModel.findById(req.params.id);
        if (!venue || !venue.isApproved) {
            return res.status(404).json({ success: false, message: 'Venue not found' });
        }
        res.json({ success: true, data: venue });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Create a new venue (Owner only)
// ... existing imports

export const createVenue = async (req, res) => {
    try {
        const { name, description, address, sportTypes, amenities } = req.body;
        const ownerId = req.user._id;

        // Extract the Cloudinary URLs from the uploaded files
        const photos = req.files.map(file => file.path);

        const newVenue = new venueModel({
            name,
            description,
            address,
            sportTypes,
            amenities,
            photos, // Store the Cloudinary URLs in the database
            owner: ownerId,
        });

        await newVenue.save();
        res.status(201).json({ success: true, message: 'Venue created successfully', venue: newVenue });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create venue', error: error.message });
    }
};
// Update an existing venue (Owner only)
export const updateVenue = async (req, res) => {
    try {
        const { id } = req.params;
        const ownerId = req.user._id;
        const venue = await venueModel.findById(id);

        if (!venue || venue.owner.toString() !== ownerId.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized to update this venue' });
        }

        const updatedVenue = await venueModel.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ success: true, message: 'Venue updated successfully', venue: updatedVenue });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update venue', error: error.message });
    }
};

// Delete a venue (Owner only)
export const deleteVenue = async (req, res) => {
    try {
        const { id } = req.params;
        const ownerId = req.user._id;
        const venue = await venueModel.findById(id);

        if (!venue || venue.owner.toString() !== ownerId.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized to delete this venue' });
        }

        await venueModel.findByIdAndDelete(id);
        res.json({ success: true, message: 'Venue deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete venue', error: error.message });
    }
};
