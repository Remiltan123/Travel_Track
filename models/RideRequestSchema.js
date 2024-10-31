

// const mongoose = require('mongoose');

// const RideRequestSchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     driverId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Driver',
//         default: null
//     },
//     pickup: {
//         address: {
//             type: String,
//             required: true
//         },
//         coordinates: {
//             type: {
//                 type: String,
//                 enum: ['Point'],
//                 default: 'Point'
//             },
//             coordinates: {
//                 type: [Number], // [longitude, latitude]
//                 required: true
//             }
//         }
//     },
//     dropoff: {
//         address: {
//             type: String,
//             required: true
//         },
//         coordinates: {
//             type: {
//                 type: String,
//                 enum: ['Point'],
//                 default: 'Point'
//             },
//             coordinates: {
//                 type: [Number], // [longitude, latitude]
//                 required: true
//             }
//         }
//     },
//     vehicleType: {
//         type: String,
//         required: true,
//         enum: ['car', 'van', 'motorbike', 'auto'],
//         lowercase: true
//     },
//     numPassengers: {
//         type: Number,
//         required: true,
//         min: 1
//     },
//     status: {
//         type: String,
//         enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'],
//         default: 'pending'
//     },
//     fare: {
//         type: Number,
//         default: null
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     acceptedAt: {
//         type: Date,
//         default: null
//     },
//     completedAt: {
//         type: Date,
//         default: null
//     }
// });

// // Create geospatial indexes
// RideRequestSchema.index({ 'pickup.coordinates': '2dsphere' });
// RideRequestSchema.index({ 'dropoff.coordinates': '2dsphere' });

// module.exports = mongoose.model('RideRequest', RideRequestSchema);



const mongoose = require('mongoose');

const RideRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pickup: {
        address: { type: String, required: true },
        coordinates: { type: [Number], index: '2dsphere' }, 
    },
    dropoff: {
        address: { type: String, required: true },
        coordinates: { type: [Number], index: '2dsphere' }, 
    },
    vehicleType: { type: String, required: true },
    numPassengers: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'completed'], default: 'pending' },
    fare: { type: Number, default: null },
    acceptedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('RideRequest', RideRequestSchema);
