const { assert } = require('chai');
const { generateRandomString, getEmailById, validateId, userExistsByEmail } = require('../helper'); 

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

describe('generateRandomString', function() {
  it('should generate a string of the specified length', function() {
    const length = 10;
    const randomString = generateRandomString(length);
    assert.equal(randomString.length, length, 'Generated string length matches the specified length');
  });
});

describe('getEmailById', function() {
  it('should return a valid email from an id', function() {
    const userEmail = getEmailById("userRandomID", testUsers);
    const expectedUserEmail = "user@example.com";
    assert.equal(userEmail, expectedUserEmail, 'Email was successfully retrieved');
  });

  it('should return null for an invalid id', function() {
    const userEmail = getEmailById("nonexistentID", testUsers);
    assert.isNull(userEmail, 'Email should be null for an invalid id');
  });
});

describe('validateId', function() {
  it('should return true for a valid id', function() {
    const isValid = validateId("userRandomID", testUsers);
    assert.isTrue(isValid, 'Should return true for a valid id');
  });

  it('should return false for an invalid id', function() {
    const isValid = validateId("nonexistentID", testUsers);
    assert.isFalse(isValid, 'Should return false for an invalid id');
  });
});

describe('userExistsByEmail', function() {
  it('should return the user object for an existing email', function() {
    const email = "user@example.com";
    const user = userExistsByEmail(email, testUsers);
    assert.deepEqual(user, testUsers["userRandomID"], 'User object should match for an existing email');
  });

  it('should return false for a non-existing email', function() {
    const email = "nonexistent@example.com";
    const result = userExistsByEmail(email, testUsers);
    assert.isFalse(result, 'Should return false for a non-existing email');
  });
});
