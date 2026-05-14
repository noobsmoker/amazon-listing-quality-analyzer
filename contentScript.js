// contentScript.js
// This script runs on Amazon product pages to analyze listing quality

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeListing') {
    const analysis = analyzeAmazonListing();
    sendResponse(analysis);
  }
  return true; // Keep the message channel open for async response
});

function analyzeAmazonListing() {
  // Initialize scores and feedback
  let score = 0;
  const maxScore = 10;
  const strengths = [];
  const weaknesses = [];

  // Check if we're on a product page
  const isProductPage = window.location.href.includes('/dp/') || 
                       window.location.href.includes('/gp/product/') ||
                       document.querySelector('#productTitle');

  if (!isProductPage) {
    return {
      score: 0,
      strengths: ['Not on a product page'],
      weaknesses: ['Please navigate to an Amazon product detail page']
    };
  }

  // 1. Product Title Analysis (2 points)
  const titleElement = document.querySelector('#productTitle');
  if (titleElement) {
    const title = titleElement.textContent.trim();
    const titleLength = title.length;
    
    if (titleLength >= 50 && titleLength <= 200) {
      score += 2;
      strengths.push('Optimal title length (50-200 characters)');
    } else if (titleLength < 50) {
      weaknesses.push('Title too short (< 50 characters) - may lack important keywords');
    } else {
      weaknesses.push('Title too long (> 200 characters) - may be truncated in search results');
    }
  } else {
    weaknesses.push('Product title not found');
  }

  // 2. Bullet Points Analysis (2 points)
  const bulletPoints = document.querySelectorAll('#feature-bullets li span');
  const bulletCount = bulletPoints.length;
  
  if (bulletCount >= 5) {
    score += 2;
    strengths.push('Good number of bullet points (5+)');
  } else if (bulletCount > 0) {
    score += 1;
    strengths.push(`Some bullet points present (${bulletCount}/5)`);
    weaknesses.push('Fewer than 5 bullet points - missing opportunity to highlight key features');
  } else {
    weaknesses.push('No bullet points found');
  }

  // 3. Product Description Analysis (2 points)
  const descriptionElement = document.querySelector('#productDescription');
  if (descriptionElement) {
    const description = descriptionElement.textContent.trim();
    const descriptionLength = description.length;
    
    if (descriptionLength >= 300) {
      score += 2;
      strengths.push('Substantial product description (300+ characters)');
    } else if (descriptionLength > 0) {
      score += 1;
      strengths.push(`Some description present (${descriptionLength}/300+ characters)`);
      weaknesses.push('Description could be more detailed (< 300 characters)');
    } else {
      weaknesses.push('Product description empty');
    }
  } else {
    // Check for A+ content
    const apxContent = document.querySelector('.apx-module');
    if (apxContent) {
      score += 2;
      strengths.push('A+ Enhanced Content present');
    } else {
      weaknesses.push('Product description not found');
    }
  }

  // 4. Image Analysis (1 point)
  const images = document.querySelectorAll('#imgTagWrapperId img, .imgTagWrapper img, #landingImage');
  const imageCount = images.length;
  
  if (imageCount >= 5) {
    score += 1;
    strengths.push('Good number of product images (5+)');
  } else if (imageCount > 0) {
    strengths.push(`Some product images present (${imageCount}/5)`);
    weaknesses.push('Could benefit from more product images');
  } else {
    weaknesses.push('No product images found');
  }

  // 5. Price Information (1 point)
  const priceElements = document.querySelectorAll('.a-price .a-offscreen, #priceblock_dealprice, #priceblock_ourprice');
  let priceFound = false;
  
  priceElements.forEach(el => {
    const priceText = el.textContent.trim();
    if (priceText && priceText.includes('$')) {
      priceFound = true;
    }
  });
  
  if (priceFound) {
    score += 1;
    strengths.push('Clear price information displayed');
  } else {
    weaknesses.push('Price information not clearly displayed');
  }

  // 6. Review Analysis (1 point)
  const reviewCountElement = document.querySelector('#acrCustomerReviewText');
  const ratingElement = document.querySelector('#acrPopover span.a-icon-alt');
  
  let reviewCount = 0;
  let rating = 0;
  
  if (reviewCountElement) {
    const reviewText = reviewCountElement.textContent;
    const match = reviewText.match(/([\d,]+)/);
    if (match) {
      reviewCount = parseInt(match[1].replace(/,/g, ''));
    }
  }
  
  if (ratingElement) {
    const ratingText = ratingElement.textContent;
    const match = ratingText.match(/([\d.]+)/);
    if (match) {
      rating = parseFloat(match[1]);
    }
  }
  
  if (reviewCount >= 50 && rating >= 4.0) {
    score += 1;
    strengths.push('Strong social proof (50+ reviews, 4.0+ rating)');
  } else if (reviewCount > 0) {
    strengths.push(`Some social proof (${reviewCount} reviews, ${rating.toFixed(1)} rating)`);
    if (reviewCount < 50) {
      weaknesses.push('Limited review count (< 50) - consider encouraging more reviews');
    }
    if (rating < 4.0) {
      weaknesses.push('Rating below 4.0 - monitor customer feedback');
    }
  } else {
    weaknesses.push('No reviews or ratings found');
  }

  // 7. Availability & Shipping (1 point)
  const availabilityElement = document.querySelector('#availability span');
  if (availabilityElement) {
    const availabilityText = availabilityElement.textContent.trim();
    if (availabilityText.toLowerCase().includes('in stock')) {
      score += 1;
      strengths.push('Product shows as in stock');
    } else {
      weaknesses.push('Product availability may be limited');
    }
  } else {
    weaknesses.push('Availability information not found');
  }

  // Normalize score to 0-10 scale
  const finalScore = Math.min(score, maxScore);
  
  return {
    score: finalScore,
    strengths: strengths,
    weaknesses: weaknesses
  };
}