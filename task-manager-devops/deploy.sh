#!/bin/bash

# ** YOU WILL CHANGE THESE VARIABLES TO MATCH YOUR AWS SETUP **
S3_BUCKET="your-bucket-name-here"   # Replace with your actual S3 bucket name
AWS_PROFILE="default"               # Or the name of your AWS CLI profile
BUILD_DIR="./react-app/build"       # Location of the React build files
CLOUDFRONT_DIST_ID=""               # Optional: If you use CloudFront

echo "Starting build and deployment to S3 ($S3_BUCKET)"

# Step 1: Navigate to the React app and build it
echo "1. Building React app..."
cd react-app
npm run build

# Check if the build was successful
if [ $? -ne 0 ]; then
    echo "❌ React build failed. Please check for errors."
    exit 1
fi

echo "✅ Build successful!"

# Step 2: Sync the build files to your S3 bucket
echo "2. Syncing files to S3 bucket..."
aws s3 sync $BUILD_DIR s3://$S3_BUCKET/ --delete --profile $AWS_PROFILE

# Check if the sync was successful
if [ $? -ne 0 ]; then
    echo "❌ S3 sync failed. Check your AWS credentials and bucket name."
    exit 1
fi

echo "✅ Sync to S3 successful!"

if [ -n "$CLOUDFRONT_DIST_ID" ]; then
    echo "3. Invalidating CloudFront cache..."
    aws cloudfront create-invalidation \
        --distribution-id $CLOUDFRONT_DIST_ID \
        --paths "/*" \
        --profile $AWS_PROFILE
    echo "✅ CloudFront invalidation initiated!"
else
    echo "3. Skipping CloudFront invalidation (no Distribution ID configured)."
fi

echo "🎉 Deployment complete! Visit your site: http://$S3_BUCKET.s3-website.-region-.amazonaws.com"