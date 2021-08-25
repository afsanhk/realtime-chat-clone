// Helper functions to manage users
// This will be an array of objects
const users = [];

// Add a user - id is socket id
const addUser = ({ id, name, room }) => {
  // Trim and clean name and room
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Check if there is already an existing user with this name in this room
  const existingUser = users.find(
    (name) => user.room === room && user.name === name
  );

  if (existingUser) {
    return { error: "Username is taken!" };
  }

  // If no existing user, then set user and push to array then return the user
  const user = { id, name, room };
  users.push(user);

  return { user };
};

// Remove a user
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0]; // This removes the user from the users away
  }
};

// Get a user
const getUser = (id) => users.find((user) => user.id === id);

// Get users in a room
const getUsersInRoom = (room) => {
  users.filter((user) => user.room === room);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
