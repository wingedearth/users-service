#!/bin/bash

echo "Testing Auth Rate Limiting (5 requests per 15 minutes)"
echo "Making 6 rapid registration requests..."
echo

for i in {1..6}; do
    echo "Request $i:"
    response=$(curl -s -w "HTTP_STATUS:%{http_code}" -X POST http://localhost:3000/api/auth/register \
        -H "Content-Type: application/json" \
        -d "{
            \"firstName\": \"Test\",
            \"lastName\": \"User$i\",
            \"email\": \"testuser$i@example.com\",
            \"password\": \"password123\"
        }")
    
    # Extract HTTP status code and response body
    http_status=$(echo "$response" | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
    response_body=$(echo "$response" | sed 's/HTTP_STATUS:[0-9]*$//')
    
    echo "Status: $http_status"
    echo "Response: $response_body"
    echo "---"
    
    # Small delay to see the progression
    sleep 0.5
done

echo "Test completed. The 6th request should have been rate limited (429 status)."
