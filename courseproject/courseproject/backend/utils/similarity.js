/**
 * Similarity Utility
 * Detects duplicate places using Jaccard similarity
 */

/**
 * Calculate Jaccard similarity between two strings
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Similarity score between 0 and 1
 */
function jaccardSimilarity(str1, str2) {
  // Convert to lowercase and split into words
  const words1 = new Set(str1.toLowerCase().split(/\s+/));
  const words2 = new Set(str2.toLowerCase().split(/\s+/));

  // Calculate intersection
  const intersection = new Set([...words1].filter(x => words2.has(x)));

  // Calculate union
  const union = new Set([...words1, ...words2]);

  // Jaccard similarity = intersection / union
  return intersection.size / union.size;
}

/**
 * Check if a new place is a duplicate of existing places
 * @param {string} newPlaceName - Name of the new place
 * @param {string} newPlaceDescription - Description of the new place
 * @param {Array} existingPlaces - Array of existing place objects
 * @returns {Object} { isDuplicate: boolean, duplicateOf: ObjectId | null, similarity: number }
 */
function checkDuplicate(newPlaceName, newPlaceDescription, existingPlaces) {
  const newPlaceText = `${newPlaceName} ${newPlaceDescription}`;
  let maxSimilarity = 0;
  let duplicatePlace = null;

  for (const existingPlace of existingPlaces) {
    const existingPlaceText = `${existingPlace.name} ${existingPlace.description}`;
    const similarity = jaccardSimilarity(newPlaceText, existingPlaceText);

    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
      duplicatePlace = existingPlace;
    }
  }

  // Threshold: 0.8 (80% similarity)
  const threshold = 0.8;
  const isDuplicate = maxSimilarity >= threshold;

  return {
    isDuplicate,
    duplicateOf: isDuplicate ? duplicatePlace._id : null,
    similarity: maxSimilarity,
  };
}

module.exports = {
  jaccardSimilarity,
  checkDuplicate,
};

