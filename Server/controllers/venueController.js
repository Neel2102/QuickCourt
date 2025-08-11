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
        console.log('=== CREATE VENUE DEBUG ===');
        console.log('Request body:', req.body);
        console.log('Request files:', req.files);
        console.log('User:', req.user);

        let { name, description, address, sportTypes, amenities } = req.body;
        const ownerId = req.user._id;

        console.log('Raw data:', { name, description, address, sportTypes, amenities });

        // Parse JSON-encoded fields when multipart/form-data is used
        try {
            if (typeof address === 'string') address = JSON.parse(address);
        } catch (e) {
            console.log('Error parsing address:', e.message);
        }
        try {
            if (typeof sportTypes === 'string') sportTypes = JSON.parse(sportTypes);
        } catch (e) {
            console.log('Error parsing sportTypes:', e.message);
        }
        try {
            if (typeof amenities === 'string') amenities = JSON.parse(amenities);
        } catch (e) {
            console.log('Error parsing amenities:', e.message);
        }

        // Normalize arrays
        if (!Array.isArray(sportTypes)) sportTypes = sportTypes ? [sportTypes] : [];
        if (!Array.isArray(amenities)) amenities = amenities ? [amenities] : [];

        console.log('Parsed data:', { name, description, address, sportTypes, amenities });

        // Extract uploaded file URLs/paths (Cloudinary middleware sets .path)
        const photos = (req.files || []).map(file => file.path);
        console.log('Photos:', photos);

        const venueData = {
            name,
            description,
            address,
            sportTypes,
            amenities,
            photos, // Store the Cloudinary URLs in the database
            owner: ownerId,
        };

        console.log('Final venue data:', venueData);

        const newVenue = new venueModel(venueData);
        await newVenue.save();

        console.log('Venue saved successfully:', newVenue._id);
        res.status(201).json({ success: true, message: 'Venue created successfully', venue: newVenue });
    } catch (error) {
        console.error('Error creating venue:', error);
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

// Get venues owned by the current user (Owner only)
export const getOwnerVenues = async (req, res) => {
    try {
        const ownerId = req.user._id;
        const venues = await venueModel.find({ owner: ownerId });
        res.json({ success: true, data: venues });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch owner venues', error: error.message });
    }
};
