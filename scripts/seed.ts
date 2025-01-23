const seedDatabase = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/seed', {
      method: 'POST',
    });
    const data = await response.json();
    console.log('Database seeded successfully:', data);
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

seedDatabase(); 