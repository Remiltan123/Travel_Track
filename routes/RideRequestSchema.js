// const express = require('express');
// const router = express.Router();
// const RideRequest = require('../models/RideRequestSchema');  
// const Driver = require('../models/driver');  
// const authMiddleware = require('../middleware/authMiddleware'); 
// const { io } = require('../server');  

// // Haversine formula to calculate distance between two coordinates
// const haversineDistance = (coords1, coords2) => {
//   const toRad = (x) => (x * Math.PI) / 180;

//   const R = 6371; // Radius of the Earth in km
//   const lat1 = coords1[1];
//   const lon1 = coords1[0];
//   const lat2 = coords2[1];
//   const lon2 = coords2[0];

//   const dLat = toRad(lat2 - lat1);
//   const dLon = toRad(lon2 - lon1);
//   const a = 
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
//     Math.sin(dLon / 2) * Math.sin(dLon / 2);

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c; // Distance in km
// };


// // Validation middleware
// const validateRideRequest = (req, res, next) => {
//   const { pickup, dropoff, vehicleType, numPassengers } = req.body;

//   if (!pickup?.address || !pickup?.coordinates || 
//       !dropoff?.address || !dropoff?.coordinates ||
//       !vehicleType || !numPassengers) {
//     return res.status(400).json({
//       message: 'Missing required fields',
//       required: {
//         pickup: { address: 'string', coordinates: '[longitude, latitude]' },
//         dropoff: { address: 'string', coordinates: '[longitude, latitude]' },
//         vehicleType: 'string',
//         numPassengers: 'number'
//       }
//     });
//   }

//   if (!Array.isArray(pickup.coordinates) || pickup.coordinates.length !== 2 ||
//       !Array.isArray(dropoff.coordinates) || dropoff.coordinates.length !== 2) {
//     return res.status(400).json({ message: 'Invalid coordinates format' });
//   }

//   next();
// };


// // Create ride request endpoint
// router.post('/create', authMiddleware, validateRideRequest, async (req, res) => {
//   try {
//     const { pickup, dropoff, vehicleType, numPassengers } = req.body;

//     // Create and save ride request
//     const newRideRequest = new RideRequest({
//       pickup,
//       dropoff,
//       vehicleType,
//       numPassengers,
//       userId: req.user._id,
//       status: 'pending'
//     });

//     await newRideRequest.save();


//     // Find nearby drivers (within 10km radius)
//     const drivers = await Driver.find({ vehicleType });
//     const nearbyDrivers = drivers.filter((driver) => {
//       const distance = haversineDistance(pickup.coordinates, driver.location.coordinates);
//       return distance <= 10; // Define radius in km
//     });

//     // Notify drivers via socket
//     nearbyDrivers.forEach((driver) => {
//       io.to(driver.socketId).emit('newRideRequest', newRideRequest);
//     });

//     // Return both ride request and nearby drivers info
//     res.status(200).json({ 
//       message: nearbyDrivers.length > 0 ? 'Ride request created and drivers notified.' : 'No nearby drivers found.',
//       rideRequest: newRideRequest,
//       nearbyDriversCount: nearbyDrivers.length,
//       nearbyDrivers: nearbyDrivers.map(driver => ({
//         id: driver._id,
//         location: driver.location,
//         vehicleType: driver.vehicleType
//       }))
//     });

//   } catch (error) {
//     console.error('Error creating ride request:', error);
//     res.status(500).json({ message: 'Server error. Please try again later.' });
//   }
// });


// // Route to get the total number of rides
// router.get('/count', async (req, res) => {
//   try {
//     const rideCount = await RideRequest.countDocuments();
//     res.json({ count: rideCount });
//   } catch (error) {
//     console.error('Error fetching ride count:', error);
//     res.status(500).json({ error: 'Failed to fetch ride count' });
//   }
// });

// module.exports = router;



 // Find and notify nearby drivers
//  const nearbyDrivers = await Driver.find({
//   vehicleType: vehicleType,
//   isAvailable: true,
//   'liveLocation.coordinates': {
//     $near: {
//       $geometry: {
//         type: 'Point',
//         coordinates: pickup.coordinates
//       },
//       $maxDistance: 10000 // 10km in meters
//     }
//   }
// });

// // Notify drivers through Socket.io
// nearbyDrivers.forEach(driver => {
//   io.to(`driver_${driver._id}`).emit('newRideRequest', {
//     rideRequestId: newRideRequest._id,
//     pickup: newRideRequest.pickup,
//     dropoff: newRideRequest.dropoff,
//     vehicleType: newRideRequest.vehicleType,
//     numPassengers: newRideRequest.numPassengers
//   });
// });

// res.status(201).json({
//   message: nearbyDrivers.length > 0 
//     ? `Ride request created and ${nearbyDrivers.length} drivers notified` 
//     : 'Ride request created but no available drivers nearby',
//   rideRequest: newRideRequest,
//   nearbyDriversCount: nearbyDrivers.length
// });

// } catch (error) {
// console.error('Error creating ride request:', error);
// res.status(500).json({ message: error.message || 'Error creating ride request' });
// }
// });

// Create Ride Request and notify drivers in real-time
// router.post('/', authMiddleware, async (req, res) => {
//   try {

//     console.log('Received request body:', JSON.stringify(req.body, null, 2));

//     const { pickup, dropoff, vehicleType, numPassengers } = req.body;

//     // Ensure the user is authenticated
//     if (!req.user || !req.user._id) {
//       return res.status(401).json({ message: 'User not authenticated' });
//     }
//     if (!pickup?.address || !pickup?.coordinates || 
//       !dropoff?.address || !dropoff?.coordinates ||
//       !vehicleType || !numPassengers) {
//     return res.status(400).json({ 
//       message: 'Missing required fields',
//       required: {
//         pickup: { address: 'string', coordinates: '[longitude, latitude]' },
//         dropoff: { address: 'string', coordinates: '[longitude, latitude]' },
//         vehicleType: 'string',
//         numPassengers: 'number'
//       }
//     });
//   }

//     // Validate coordinates
//     if (!Array.isArray(pickup.coordinates) || pickup.coordinates.length !== 2 ||
//     !Array.isArray(dropoff.coordinates) || dropoff.coordinates.length !== 2) {
//   return res.status(400).json({ message: 'Invalid coordinates format' });
// }

    // Create a new ride request document
    // const newRideRequest = new RideRequest({
    //   pickup: {
    //     address: pickup.address,
    //     coordinates: pickup.coordinates,
    //   },
    //   dropoff: {
    //     address: dropoff.address,
    //     coordinates: dropoff.coordinates,
    //   },
    //   vehicleType,
    //   numPassengers,
    //   userId: req.user._id,
    // });
    // const newRideRequest = new RideRequest({
    //   pickup,
    //   dropoff,
    //   vehicleType,
    //   numPassengers,
    //   userId: req.user._id,
    //   status: 'pending'
    // });

    // await newRideRequest.save();

//     // Fetch drivers that match vehicle type and are available
//     const drivers = await Driver.find({
//       vehicleType: vehicleType, 
//       isAvailable: true,  
//     });

//     // Filter nearby drivers using the Haversine formula (e.g., 10km radius)
//     const maxDistance = 10; // in kilometers
//     const nearbyDrivers = drivers.filter(driver => {
//       const distance = haversineDistance(pickup.coordinates, driver.liveLocation.coordinates);
//       return distance <= maxDistance;
//     });

//     console.log('Nearby drivers found:', nearbyDrivers.length);

//     // Notify drivers via Socket.io
//     if (nearbyDrivers.length > 0) {
//       nearbyDrivers.forEach(driver => {
//         io.to(`driver_${driver.userId}`).emit('newRideRequest', {
//           rideRequestId: newRideRequest._id,
//           pickup: newRideRequest.pickup,
//           dropoff: newRideRequest.dropoff,
//           vehicleType: newRideRequest.vehicleType,
//           numPassengers: newRideRequest.numPassengers
//         });
//       });
//       console.log('Drivers notified');
//     }

//     // Respond with success message
//     res.status(201).json({ 
//       message: nearbyDrivers.length > 0 ? 'Ride request created and drivers notified' : 'Ride request created but no available drivers nearby', 
//       rideRequest: newRideRequest 
//     });

//   } catch (error) {
//     console.error('Error creating ride request:', error);
//     res.status(500).json({ message: 'Error creating ride request' });
//   }
// });


    // Find nearby available drivers
//     const drivers = await Driver.find({
//       vehicleType: vehicleType,
//       isAvailable: true,
//       'liveLocation.coordinates': {
//         $near: {
//           $geometry: {
//             type: 'Point',
//             coordinates: pickup.coordinates
//           },
//           $maxDistance: 10000 // 10km in meters
//         }
//       }
//     });

//     console.log('Nearby drivers found:', drivers.length);

//     // Notify drivers via Socket.io
//     drivers.forEach(driver => {
//       io.to(`driver_${driver._id}`).emit('newRideRequest', {
//         rideRequestId: newRideRequest._id,
//         pickup: newRideRequest.pickup,
//         dropoff: newRideRequest.dropoff,
//         vehicleType: newRideRequest.vehicleType,
//         numPassengers: newRideRequest.numPassengers
//       });
//     });

//     res.status(201).json({
//       message: drivers.length > 0 ? 'Ride request created and drivers notified' : 'Ride request created but no available drivers nearby',
//       rideRequest: newRideRequest
//     });

//   } catch (error) {
//     console.error('Error creating ride request:', error);
//     res.status(500).json({ message: error.message || 'Error creating ride request' });
//   }
// });

// const express = require('express');
// const router = express.Router();
// const RideRequest = require('../models/RideRequestSchema');  
// const Driver = require('../models/driver');  
// const authMiddleware = require('../middleware/authMiddleware'); 
// const { io } = require('../server');  

// // Haversine formula to calculate distance between two coordinates
// const haversineDistance = (coords1, coords2) => {
//   const toRad = (x) => (x * Math.PI) / 180;

//   const R = 6371; // Radius of the Earth in km
//   const lat1 = coords1[1];
//   const lon1 = coords1[0];
//   const lat2 = coords2[1];
//   const lon2 = coords2[0];

//   const dLat = toRad(lat2 - lat1);
//   const dLon = toRad(lon2 - lon1);
//   const a = 
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
//     Math.sin(dLon / 2) * Math.sin(dLon / 2);

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c; // Distance in km
// };

// // Validation middleware
// const validateRideRequest = (req, res, next) => {
//   const { pickup, dropoff, vehicleType, numPassengers } = req.body;

//   if (!pickup?.address || !pickup?.coordinates || 
//       !dropoff?.address || !dropoff?.coordinates ||
//       !vehicleType || !numPassengers) {
//     return res.status(400).json({
//       message: 'Missing required fields',
//       required: {
//         pickup: { address: 'string', coordinates: '[longitude, latitude]' },
//         dropoff: { address: 'string', coordinates: '[longitude, latitude]' },
//         vehicleType: 'string',
//         numPassengers: 'number'
//       }
//     });
//   }

//   if (!Array.isArray(pickup.coordinates) || pickup.coordinates.length !== 2 ||
//       !Array.isArray(dropoff.coordinates) || dropoff.coordinates.length !== 2) {
//     return res.status(400).json({ message: 'Invalid coordinates format' });
//   }

//   next();
// };

// // Create ride request endpoint
// router.post('/create', authMiddleware, validateRideRequest, async (req, res) => {
//   try {
//     const { pickup, dropoff, vehicleType, numPassengers } = req.body;

//     // Create and save ride request
//     const newRideRequest = new RideRequest({
//       pickup,
//       dropoff,
//       vehicleType,
//       numPassengers,
//       userId: req.user._id,
//       status: 'pending'
//     });

//     await newRideRequest.save();

//     // Find nearby drivers (within 10km radius)
//     const drivers = await Driver.find({ vehicleType });
//     const nearbyDrivers = drivers.filter((driver) => {
//       const distance = haversineDistance(pickup.coordinates, driver.location.coordinates);
//       return distance <= 10; // Define radius in km
//     });

//     if (nearbyDrivers.length > 0) {
//       // Notify the nearby drivers via socket
//       nearbyDrivers.forEach((driver) => {
//         io.to(driver.socketId).emit('newRideRequest', newRideRequest);
//       });

//       res.status(200).json({ message: 'Ride request created and drivers notified.', newRideRequest });
//     } else {
//       res.status(200).json({ message: 'Ride request created, but no nearby drivers found.', newRideRequest });
//     }
//   } catch (error) {
//     console.error('Error creating ride request:', error);
//     res.status(500).json({ message: 'Server error. Please try again later.' });
//   }
// });

// // Route to get the total number of rides
// router.get('/count', async (req, res) => {
//   try {
//     const rideCount = await RideRequest.countDocuments();
//     res.json({ count: rideCount });
//   } catch (error) {
//     console.error('Error fetching ride count:', error);
//     res.status(500).json({ error: 'Failed to fetch ride count' });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const RideRequest = require('../models/RideRequestSchema');
const Driver = require('../models/driver');
const authMiddleware = require('../middleware/authMiddleware');
const { io } = require('../server');

// Haversine formula to calculate distance
const calculateDistance = (coords1, coords2) => {
    const toRad = x => (x * Math.PI) / 180;
    const R = 6371; // Earth's radius in km

    const lat1 = coords1[1];
    const lon1 = coords1[0];
    const lat2 = coords2[1];
    const lon2 = coords2[0];

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// Validation middleware
const validateRideRequest = (req, res, next) => {
    const { pickup, dropoff, vehicleType, numPassengers } = req.body;

    if (!pickup?.address || !pickup?.coordinates ||
        !dropoff?.address || !dropoff?.coordinates ||
        !vehicleType || !numPassengers) {
        return res.status(400).json({
            message: 'Missing required fields',
            required: {
                pickup: { address: 'string', coordinates: '[longitude, latitude]' },
                dropoff: { address: 'string', coordinates: '[longitude, latitude]' },
                vehicleType: 'string',
                numPassengers: 'number'
            }
        });
    }

    if (!Array.isArray(pickup.coordinates) || pickup.coordinates.length !== 2 ||
        !Array.isArray(dropoff.coordinates) || dropoff.coordinates.length !== 2) {
        return res.status(400).json({ message: 'Invalid coordinates format' });
    }

    next();
};

// Create ride request endpoint
router.post('/create', authMiddleware, validateRideRequest, async (req, res) => {
    try {
        const { pickup, dropoff, vehicleType, numPassengers } = req.body;
        console.log('Creating ride request:', { pickup, dropoff, vehicleType, numPassengers });

        // Create ride request
        const newRideRequest = new RideRequest({
            userId: req.user._id,
            pickup: {
                address: pickup.address,
                coordinates: {
                    type: 'Point',
                    coordinates: pickup.coordinates
                }
            },
            dropoff: {
                address: dropoff.address,
                coordinates: {
                    type: 'Point',
                    coordinates: dropoff.coordinates
                }
            },
            vehicleType: vehicleType.toLowerCase(),
            numPassengers,
            status: 'pending'
        });

        await newRideRequest.save();
        console.log('Ride request saved:', newRideRequest._id);

        // Find nearby available drivers
        const nearbyDrivers = await Driver.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: pickup.coordinates
                    },
                    $maxDistance: 10000 // 10km in meters
                }
            },
            vehicleType: vehicleType.toLowerCase(),
            isAvailable: true,
            isApproved: true
        }).limit(10);

        console.log(`Found ${nearbyDrivers.length} nearby drivers`);

        if (nearbyDrivers.length > 0) {
            // Notify each nearby driver
            const notificationPromises = nearbyDrivers.map(driver => {
                if (driver.socketId) {
                    const distance = calculateDistance(pickup.coordinates, driver.location.coordinates);
                    return new Promise((resolve) => {
                        io.to(driver.socketId).emit('newRideRequest', {
                            rideRequest: {
                                id: newRideRequest._id,
                                pickup: newRideRequest.pickup,
                                dropoff: newRideRequest.dropoff,
                                numPassengers: newRideRequest.numPassengers,
                                distance: distance.toFixed(2)
                            }
                        });
                        resolve();
                    });
                }
                return Promise.resolve();
            });

            await Promise.all(notificationPromises);

            res.status(200).json({
                success: true,
                message: 'Ride request created and drivers notified.',
                rideRequest: newRideRequest,
                nearbyDriversCount: nearbyDrivers.length
            });
        } else {
            res.status(200).json({
                success: true,
                message: 'No nearby drivers found. Your request has been saved.',
                rideRequest: newRideRequest,
                nearbyDriversCount: 0
            });
        }
    } catch (error) {
        console.error('Error creating ride request:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while processing ride request.',
            error: error.message
        });
    }
});

// Update driver location endpoint
router.post('/driver/location', authMiddleware, async (req, res) => {
    try {
        const { coordinates } = req.body;

        if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
            return res.status(400).json({
                success: false,
                message: 'Invalid coordinates format'
            });
        }

        const driver = await Driver.findByIdAndUpdate(
            req.user._id,
            {
                location: {
                    type: 'Point',
                    coordinates: coordinates
                },
                lastLocationUpdate: Date.now()
            },
            { new: true }
        );

        if (!driver) {
            return res.status(404).json({
                success: false,
                message: 'Driver not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Location updated successfully',
            location: driver.location
        });
    } catch (error) {
        console.error('Error updating driver location:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating location',
            error: error.message
        });
    }
});

// Get ride count endpoint
router.get('/count', async (req, res) => {
    try {
        const rideCount = await RideRequest.countDocuments();
        res.json({ count: rideCount });
    } catch (error) {
        console.error('Error fetching ride count:', error);
        res.status(500).json({ error: 'Failed to fetch ride count' });
    }
});

module.exports = router;