/**
 * Taste Analysis Utility Module
 *
 * Analyzes Balance Game answers to create a user taste profile,
 * and recommends the most suitable food.
 *
 * @module tasteAnalyzer
 */

import { foods } from '../data/foods.js';

/**
 * Create initial taste profile
 * Initialize all traits to middle value (2.5)
 * @returns {Object} Initial taste profile
 */
export function createInitialProfile() {
    return {
        spicy: 2.5,      // Spice preference
        hearty: 2.5,     // Filling preference
        adventurous: 2.5, // Adventurous tendency
        social: 2.5,     // Group dining preference
        quick: 2.5       // Fast meal preference
    };
}

/**
 * Update taste profile based on answer
 * @param {Object} profile - Current taste profile
 * @param {Object} answer - User answer { question, choice }
 * @returns {Object} Updated taste profile
 */
export function updateProfile(profile, answer) {
    const { question, choice } = answer;
    const effect = choice === 'A' ? question.effectA : question.effectB;

    if (!effect) return profile;

    const updated = { ...profile };

    for (const [trait, value] of Object.entries(effect)) {
        if (updated.hasOwnProperty(trait)) {
            updated[trait] = Math.max(0, Math.min(5, updated[trait] + value * 0.5));
        }
    }

    return updated;
}

/**
 * Calculate final taste profile from all answers
 * @param {Array} answers - User answers array
 * @returns {Object} Final taste profile
 */
export function calculateProfile(answers) {
    let profile = createInitialProfile();

    for (const answer of answers) {
        profile = updateProfile(profile, answer);
    }

    return profile;
}

/**
 * Calculate compatibility score between food and user taste
 * Euclidean distance-based similarity (0~100)
 * @param {Object} profile - User taste profile
 * @param {Object} food - Food data
 * @returns {number} Compatibility score (0~100, higher = more suitable)
 */
export function calculateFoodScore(profile, food) {
    if (!food.traits) return 50; // Middle score if no traits

    const traits = ['spicy', 'hearty', 'adventurous', 'social', 'quick'];
    let totalDistance = 0;

    for (const trait of traits) {
        const userValue = profile[trait] || 2.5;
        const foodValue = food.traits[trait] || 2.5;
        totalDistance += Math.pow(userValue - foodValue, 2);
    }

    // Convert Euclidean distance to 0~100 score
    // Max distance: sqrt(5 * 5^2) = sqrt(125) ≈ 11.18
    const distance = Math.sqrt(totalDistance);
    const maxDistance = Math.sqrt(5 * 25);
    const score = Math.round((1 - distance / maxDistance) * 100);

    return Math.max(0, Math.min(100, score));
}

/**
 * Recommend foods based on user taste
 * @param {Object} profile - User taste profile
 * @param {number} count - Number of foods to recommend (default: 1)
 * @returns {Array} Recommended foods list (sorted by score)
 */
export function recommendFoods(profile, count = 1) {
    const scoredFoods = foods.map(food => ({
        food,
        score: calculateFoodScore(profile, food)
    }));

    // Sort by highest score
    scoredFoods.sort((a, b) => b.score - a.score);

    // Return top foods (add randomness for ties)
    const topScore = scoredFoods[0].score;
    const topFoods = scoredFoods.filter(sf => sf.score >= topScore - 5);

    // Random selection from top group (adds variation)
    if (topFoods.length > 1 && count === 1) {
        const randomIndex = Math.floor(Math.random() * Math.min(3, topFoods.length));
        return [topFoods[randomIndex]];
    }

    return scoredFoods.slice(0, count);
}

/**
 * Analyze main characteristics of taste profile
 * @param {Object} profile - User taste profile
 * @returns {Object} Analysis result { dominant, description }
 */
export function analyzeProfile(profile) {
    const traitLabels = {
        spicy: { name: 'Spicy', highDesc: 'You love spicy food!', lowDesc: 'You prefer mild flavors.' },
        hearty: { name: 'Filling', highDesc: 'You like hearty meals!', lowDesc: 'You prefer light meals.' },
        adventurous: { name: 'Adventurous', highDesc: 'You love trying new foods!', lowDesc: 'You prefer familiar foods.' },
        social: { name: 'Social', highDesc: 'You enjoy eating with others!', lowDesc: 'You prefer dining alone.' },
        quick: { name: 'Quick', highDesc: 'You eat quickly!', lowDesc: 'You enjoy leisurely meals.' }
    };

    // Find highest/lowest traits
    let highestTrait = null;
    let highestValue = -1;
    let lowestTrait = null;
    let lowestValue = 6;

    for (const [trait, value] of Object.entries(profile)) {
        if (value > highestValue) {
            highestValue = value;
            highestTrait = trait;
        }
        if (value < lowestValue) {
            lowestValue = value;
            lowestTrait = trait;
        }
    }

    // Generate main trait descriptions
    const descriptions = [];
    if (highestValue >= 3.5 && traitLabels[highestTrait]) {
        descriptions.push(traitLabels[highestTrait].highDesc);
    }
    if (lowestValue <= 1.5 && traitLabels[lowestTrait]) {
        descriptions.push(traitLabels[lowestTrait].lowDesc);
    }

    // Determine taste type
    const type = determineType(profile);

    return {
        profile,
        dominant: highestTrait,
        dominantValue: highestValue,
        descriptions,
        type
    };
}

/**
 * Determine type based on taste profile
 * @param {Object} profile - User taste profile
 * @returns {Object} Type info { name, emoji, description }
 */
function determineType(profile) {
    const { spicy, hearty, adventurous, social, quick } = profile;

    // Type determination logic
    if (spicy >= 4 && adventurous >= 3.5) {
        return { name: 'Spice Challenger', emoji: '🌶️', description: "You never back down from spicy food!" };
    }
    if (hearty >= 4 && social >= 3.5) {
        return { name: 'Social Feaster', emoji: '🍖', description: 'You love hearty meals with good company.' };
    }
    if (adventurous >= 4) {
        return { name: 'Food Explorer', emoji: '🗺️', description: 'You enjoy trying new foods!' };
    }
    if (quick >= 4 && hearty <= 2) {
        return { name: 'Efficiency Expert', emoji: '⚡', description: 'Quick and light! You value efficient meals.' };
    }
    if (social <= 1.5) {
        return { name: 'Solo Diner', emoji: '🧘', description: 'You enjoy meals in your own time.' };
    }
    if (spicy <= 1 && hearty >= 3) {
        return { name: 'Comfort Food Lover', emoji: '😊', description: 'You prefer mild, comforting food.' };
    }
    if (hearty <= 2 && adventurous >= 3) {
        return { name: 'Light Gourmet', emoji: '🥗', description: "You're looking for healthy, light options!" };
    }

    // Default type
    return { name: 'Balanced Foodie', emoji: '🍽️', description: 'You enjoy a variety of foods!' };
}

/**
 * Generate recommendation reason for food
 * @param {Object} profile - User taste profile
 * @param {Object} food - Recommended food
 * @param {number} score - Compatibility score
 * @returns {string} Recommendation reason
 */
export function generateRecommendationReason(profile, food, score) {
    if (!food.traits) return "Today's recommended menu just for you!";

    const matches = [];
    const traits = ['spicy', 'hearty', 'adventurous', 'social', 'quick'];

    for (const trait of traits) {
        const userValue = profile[trait] || 2.5;
        const foodValue = food.traits[trait] || 2.5;
        const diff = Math.abs(userValue - foodValue);

        if (diff <= 1) {
            matches.push(trait);
        }
    }

    const reasons = {
        spicy: 'matches your spice preference',
        hearty: 'is perfect for a filling meal',
        adventurous: 'suits your adventurous spirit',
        social: 'is great for sharing',
        quick: 'fits your meal timing'
    };

    if (matches.length >= 2) {
        const reasonTexts = matches.slice(0, 2).map(m => reasons[m]).filter(Boolean);
        return `This ${reasonTexts.join(' and ')}!`;
    }

    if (score >= 80) {
        return 'This matches your taste perfectly!';
    } else if (score >= 60) {
        return "This fits today's mood!";
    }

    return 'Try something new with this recommendation!';
}
