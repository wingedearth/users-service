// MongoDB initialization script
print('Starting MongoDB initialization...');

// Switch to the users-service database
db = db.getSiblingDB('users-service');

// Create a user for the application
db.createUser({
  user: 'app-user',
  pwd: 'app-password',
  roles: [
    {
      role: 'readWrite',
      db: 'users-service'
    }
  ]
});

// Create a collection with a simple index
db.users.createIndex({ "email": 1 }, { unique: true });

print('MongoDB initialization completed successfully!');
