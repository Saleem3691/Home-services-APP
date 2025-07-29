export const generateFakeBookings = (userId, count = 5) => {
  const services = ['AC Repair', 'Plumbing', 'Electrical', 'Cleaning'];
  const statuses = ['pending', 'confirmed', 'completed', 'rejected'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `booking_${userId}_${Date.now()}_${i}`,
    userId,
    serviceName: services[i % services.length],
    providerId: `provider_${Math.floor(Math.random() * 10) + 1}`,
    date: new Date(Date.now() + (i * 24 * 60 * 60 * 1000)).toISOString(),
    time: ['08:00-10:00', '10:00-12:00', '12:00-14:00'][i % 3],
    address: `${Math.floor(Math.random() * 1000) + 1} Main St, City`,
    status: statuses[i % statuses.length],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
};

export const generateFakeProviders = (count = 5) => {
  const services = {
    'AC Repair': ['AC Installation', 'Maintenance', 'Repair'],
    'Plumbing': ['Leak Repair', 'Pipe Installation', 'Drain Cleaning'],
    'Electrical': ['Wiring', 'Panel Upgrade', 'Light Installation'],
    'Cleaning': ['Deep Cleaning', 'Regular Cleaning', 'Move-out Cleaning']
  };
  
  return Array.from({ length: count }, (_, i) => ({
    id: `provider_${i + 1}`,
    name: `Provider ${i + 1}`,
    businessName: `Professional ${['AC', 'Plumbing', 'Electrical', 'Cleaning'][i % 4]} Services`,
    rating: (Math.random() * 2 + 3).toFixed(1),
    reviews: Math.floor(Math.random() * 50) + 10,
    services: services[Object.keys(services)[i % Object.keys(services).length]],
    experience: Math.floor(Math.random() * 10) + 2,
    isVerified: Math.random() > 0.3
  }));
};