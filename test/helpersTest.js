const { assert } = require('chai');
const { generateRandomString, getEmailById, validateId } = require('../helper'); 

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getEmailById ', function() {
  it('should return a valid email from an id', function() {
    const userEmail = getEmailById ("userRandomID", testUsers)
    const expectedUserEmail = "user@example.com";
    assert.equal(userEmail, expectedUserEmail, 'Email was successfully retrieved')
  });
});