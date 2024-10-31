const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const DriverSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'Username is required']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
        match: [/.+\@.+\..+/, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    licenseNumber: {
        type: String,
        required: [true, 'License number is required']
    },
    vehicleType: {
        type: String,
        required: [true, 'Vehicle type is required'],
        enum: ['car', 'van', 'motorbike', 'auto'],
        lowercase: true
    },
    licenseImage: {
        type: String,
        required: [true, 'License image is required']
    },
    vehicleRegistration: {
        type: String,
        required: [true, 'Vehicle registration is required']
    },
    insuranceDocument: {
        type: String,
        required: [true, 'Insurance document is required']
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'driver'
    },
    isAvailable: {
        type: Boolean,
        default: false
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
            default: [0, 0]
        }
    },
    socketId: {
        type: String,
        default: null
    },
    lastLocationUpdate: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create geospatial index for location
DriverSchema.index({ location: '2dsphere' });

// Password hashing middleware
DriverSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('Driver', DriverSchema);
