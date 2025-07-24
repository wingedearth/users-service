#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"

echo -e "${BLUE}Testing Users Service API with MongoDB${NC}"
echo "=============================================="

# Test health endpoint
echo -e "\n${BLUE}1. Testing Health Check${NC}"
curl -s -X GET "$BASE_URL/health" | jq .

# Test getting all users (should be empty initially)
echo -e "\n${BLUE}2. Getting all users (initial)${NC}"
curl -s -X GET "$BASE_URL/api/users" | jq .

# Test creating a user
echo -e "\n${BLUE}3. Creating a new user${NC}"
USER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }')
echo $USER_RESPONSE | jq .

# Extract user ID for subsequent tests
USER_ID=$(echo $USER_RESPONSE | jq -r '.data.id')
echo -e "\nCreated user with ID: ${GREEN}$USER_ID${NC}"

# Test getting all users (should have one user now)
echo -e "\n${BLUE}4. Getting all users (after creation)${NC}"
curl -s -X GET "$BASE_URL/api/users" | jq .

# Test getting specific user
echo -e "\n${BLUE}5. Getting user by ID${NC}"
curl -s -X GET "$BASE_URL/api/users/$USER_ID" | jq .

# Test updating the user
echo -e "\n${BLUE}6. Updating user${NC}"
curl -s -X PUT "$BASE_URL/api/users/$USER_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.updated@example.com",
    "firstName": "John",
    "lastName": "Updated"
  }' | jq .

# Test creating another user
echo -e "\n${BLUE}7. Creating second user${NC}"
USER2_RESPONSE=$(curl -s -X POST "$BASE_URL/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.smith@example.com",
    "firstName": "Jane",
    "lastName": "Smith"
  }')
echo $USER2_RESPONSE | jq .

# Test getting all users (should have two users now)
echo -e "\n${BLUE}8. Getting all users (final)${NC}"
curl -s -X GET "$BASE_URL/api/users" | jq .

# Test error case - duplicate email
echo -e "\n${BLUE}9. Testing duplicate email error${NC}"
curl -s -X POST "$BASE_URL/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.updated@example.com",
    "firstName": "Duplicate",
    "lastName": "User"
  }' | jq .

# Test error case - invalid ID format
echo -e "\n${BLUE}10. Testing invalid ID format${NC}"
curl -s -X GET "$BASE_URL/api/users/invalid-id" | jq .

echo -e "\n${GREEN}API testing completed!${NC}"
