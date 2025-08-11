import courtModel from '../models/courtModel.js';
import venueModel from '../models/venueModel.js';

// Create a new court (Owner only)
export const createCourt = async (req, res) => {
    try {
        const { venueId: venueIdBody, venue: venueBody, name, sportType, pricePerHour, operatingHours } = req.body;
        const venueId = venueIdBody || venueBody; // support both field names
        const ownerId = req.user._id;

        const venue = await venueModel.findById(venueId);
        if (!venue || venue.owner.toString() !== ownerId.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized to add a court to this venue' });
        }

        const newCourt = new courtModel({
            name,
            venue: venueId,
            sportType,
            pricePerHour,
            operatingHours,
        });

        await newCourt.save();
        res.status(201).json({ success: true, message: 'Court created successfully', court: newCourt });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create court', error: error.message });
    }
};

// Get all courts for a specific venue (Owner only)
export const getCourtsByVenue = async (req, res) => {
    try {
        const { venueId } = req.params;
        const courts = await courtModel.find({ venue: venueId });
        res.json({ success: true, data: courts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch courts', error: error.message });
    }
};

// Owner: list all courts across owner's venues
export const getOwnerCourts = async (req, res) => {
    try {
        const ownerId = req.user._id;
        const venues = await venueModel.find({ owner: ownerId });
        const venueIds = venues.map(v => v._id);
        const courts = await courtModel.find({ venue: { $in: venueIds } });
        res.json({ success: true, data: courts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch owner courts', error: error.message });
    }
};

// Update a court (Owner only)
export const updateCourt = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCourt = await courtModel.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ success: true, message: 'Court updated successfully', court: updatedCourt });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update court', error: error.message });
    }
};

// Delete a court (Owner only)
export const deleteCourt = async (req, res) => {
    try {
        const { id } = req.params;
        await courtModel.findByIdAndDelete(id);
        res.json({ success: true, message: 'Court deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete court', error: error.message });
    }
}; 
