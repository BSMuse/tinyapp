const generateRandomString = length => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}; 

const getEmailById = (id, database) => {
  return database[id] ? database[id].email : null;
};

const userExistsByEmail = (email, database) => {
  for (const userId in database) {
    if (database.hasOwnProperty(userId) && getEmailById(userId, database) === email) {
      return database[userId]; 
    }
  }
  return false; 
};

const validateId = (id, database) => {
  return database.hasOwnProperty(id);
};

module.exports = { generateRandomString, getEmailById, userExistsByEmail, validateId }