#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"

echo -e "${BLUE}Testing Authentication API${NC}"
echo "============================="

# Test health endpoint
echo -e "\n${BLUE}1. Testing Health Check${NC}"
curl -s -X GET "$BASE_URL/health" | jq .

# Test user registration
echo -e "\n${BLUE}2. Testing User Registration${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "password": "password123"
  }')
echo $REGISTER_RESPONSE | jq .

# Extract token from registration
TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.data.token')
echo -e "\n${GREEN}Registration Token: $TOKEN${NC}"

# Test login with same credentials
echo -e "\n${BLUE}3. Testing User Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')
echo $LOGIN_RESPONSE | jq .

# Extract token from login
LOGIN_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.token')
echo -e "\n${GREEN}Login Token: $LOGIN_TOKEN${NC}"

# Test getting current user profile (protected route)
echo -e "\n${BLUE}4. Testing Get Current User Profile (Protected)${NC}"
curl -s -X GET "$BASE_URL/api/auth/me" \
  -H "Authorization: Bearer $LOGIN_TOKEN" | jq .

# Test accessing protected route without token
echo -e "\n${BLUE}5. Testing Protected Route Without Token${NC}"
curl -s -X GET "$BASE_URL/api/auth/me" | jq .

# Test accessing protected route with invalid token
echo -e "\n${BLUE}6. Testing Protected Route With Invalid Token${NC}"
curl -s -X GET "$BASE_URL/api/auth/me" \
  -H "Authorization: Bearer invalid-token" | jq .

# Test user update (protected)
echo -e "\n${BLUE}7. Testing User Update (Protected Route)${NC}"
USER_ID=$(echo $LOGIN_RESPONSE | jq -r '.data.user.id')
echo -e "Updating user ID: ${YELLOW}$USER_ID${NC}"

curl -s -X PUT "$BASE_URL/api/users/$USER_ID" \
  -H "Authorization: Bearer $LOGIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "updated@example.com",
    "firstName": "Updated",
    "lastName": "User"
  }' | jq .

# Test duplicate email registration
echo -e "\n${BLUE}8. Testing Duplicate Email Registration${NC}"
curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "Another",
    "lastName": "User",
    "password": "password123"
  }' | jq .

# Test login with wrong password
echo -e "\n${BLUE}9. Testing Login With Wrong Password${NC}"
curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "wrongpassword"
  }' | jq .

# Test login with non-existent user
echo -e "\n${BLUE}10. Testing Login With Non-existent User${NC}"
curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com",
    "password": "password123"
  }' | jq .

# Test registration with missing fields
echo -e "\n${BLUE}11. Testing Registration With Missing Fields${NC}"
curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "incomplete@example.com",
    "firstName": "Incomplete"
  }' | jq .

# Test registration with short password
echo -e "\n${BLUE}12. Testing Registration With Short Password${NC}"
curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "short@example.com",
    "firstName": "Short",
    "lastName": "Password",
    "password": "123"
  }' | jq .

echo -e "\n${GREEN}Authentication API testing completed!${NC}"
