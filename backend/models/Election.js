const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true 
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    // 🛡️ NEW: Voter Eligibility Fields
    requiredDistrict: {
        type: String,
        default: "All" // "All" means any district can vote
    },
    minAge: {
        type: Number,
        default: 18
    }
}, { timestamps: true });

electionSchema.index({ startDate: 1, endDate: 1, isActive: 1 });

module.exports = mongoose.model('Election', electionSchema);