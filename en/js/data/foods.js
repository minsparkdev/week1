/**
 * Food Data Module (English Version)
 * - 16 foods (for Food World Cup)
 * - Local image paths included
 * - Tarot interpretation messages included
 * - Taste traits for Balance Game included
 */

// Image base path (relative to en/ directory)
const IMAGE_BASE_PATH = '../assets/images/foods';

/**
 * Taste Traits Description:
 * - spicy: Spice preference (0: mild ~ 5: very spicy)
 * - hearty: Filling/substantial (0: light ~ 5: very filling)
 * - adventurous: Adventurous tendency (0: familiar ~ 5: new experiences)
 * - social: Good for group dining (0: solo dining ~ 5: group dining)
 * - quick: Fast meal (0: leisurely ~ 5: quick)
 */
export const foods = [
    {
        id: 1,
        name: "Kimchi Stew",
        category: "Korean",
        image: `${IMAGE_BASE_PATH}/food-1.png`,
        desc: "When you crave that spicy, savory broth",
        tarot: "You need some warmth today - a comforting meal awaits to soothe your soul",
        emoji: "🍲",
        traits: { spicy: 3, hearty: 4, adventurous: 1, social: 2, quick: 3 }
    },
    {
        id: 2,
        name: "Grilled Pork Belly",
        category: "Korean",
        image: `${IMAGE_BASE_PATH}/food-2.png`,
        desc: "The sizzling sound of meat on the grill",
        tarot: "Time to recharge! A hearty meal will restore your energy",
        emoji: "🥓",
        traits: { spicy: 1, hearty: 5, adventurous: 2, social: 5, quick: 1 }
    },
    {
        id: 3,
        name: "Bibimbap",
        category: "Korean",
        image: `${IMAGE_BASE_PATH}/food-3.png`,
        desc: "Fresh vegetables and gochujang in harmony",
        tarot: "Various opportunities are mixing together - harmony is your destiny today",
        emoji: "🍚",
        traits: { spicy: 2, hearty: 3, adventurous: 2, social: 1, quick: 4 }
    },
    {
        id: 4,
        name: "Sushi",
        category: "Japanese",
        image: `${IMAGE_BASE_PATH}/food-4.png`,
        desc: "Clean and fresh meal",
        tarot: "A neat mindset brings luck. A refined choice is the right answer!",
        emoji: "🍣",
        traits: { spicy: 0, hearty: 2, adventurous: 3, social: 3, quick: 3 }
    },
    {
        id: 5,
        name: "Ramen",
        category: "Japanese",
        image: `${IMAGE_BASE_PATH}/food-5.png`,
        desc: "Rich broth and chewy noodles",
        tarot: "Deep thinking brings good results today - proceed thoughtfully",
        emoji: "🍜",
        traits: { spicy: 2, hearty: 4, adventurous: 3, social: 1, quick: 3 }
    },
    {
        id: 6,
        name: "Tonkatsu",
        category: "Japanese",
        image: `${IMAGE_BASE_PATH}/food-6.png`,
        desc: "The temptation of crispy fried cutlet",
        tarot: "An opportunity that's different inside and out is coming. Grab that crispy luck!",
        emoji: "🍱",
        traits: { spicy: 0, hearty: 4, adventurous: 1, social: 1, quick: 4 }
    },
    {
        id: 7,
        name: "Jajangmyeon",
        category: "Chinese",
        image: `${IMAGE_BASE_PATH}/food-7.png`,
        desc: "The classic Korean-Chinese noodle dish",
        tarot: "Finding comfort in familiarity - a reliable choice is the answer today",
        emoji: "🍝",
        traits: { spicy: 0, hearty: 4, adventurous: 0, social: 2, quick: 5 }
    },
    {
        id: 8,
        name: "Mala Hotpot",
        category: "Chinese",
        image: `${IMAGE_BASE_PATH}/food-8.png`,
        desc: "Stress-relieving spicy flavor",
        tarot: "Time for burning passion! Bold challenges lead to success",
        emoji: "🌶️",
        traits: { spicy: 5, hearty: 4, adventurous: 4, social: 3, quick: 2 }
    },
    {
        id: 9,
        name: "Sweet & Sour Pork",
        category: "Chinese",
        image: `${IMAGE_BASE_PATH}/food-9.png`,
        desc: "Pour it or dip it? Just eat it!",
        tarot: "A sweet and tangy day awaits. Joy is coming your way!",
        emoji: "🥡",
        traits: { spicy: 0, hearty: 3, adventurous: 1, social: 4, quick: 3 }
    },
    {
        id: 10,
        name: "Pizza",
        category: "Western",
        image: `${IMAGE_BASE_PATH}/food-10.png`,
        desc: "The happiness of stretchy cheese",
        tarot: "A day of sharing joy - luck tastes better when shared",
        emoji: "🍕",
        traits: { spicy: 1, hearty: 4, adventurous: 2, social: 5, quick: 4 }
    },
    {
        id: 11,
        name: "Pasta",
        category: "Western",
        image: `${IMAGE_BASE_PATH}/food-11.png`,
        desc: "A meal with atmosphere",
        tarot: "Romantic energy surrounds you today - a special encounter awaits",
        emoji: "🍝",
        traits: { spicy: 1, hearty: 3, adventurous: 3, social: 3, quick: 2 }
    },
    {
        id: 12,
        name: "Hamburger",
        category: "Western",
        image: `${IMAGE_BASE_PATH}/food-12.png`,
        desc: "Fast and filling satisfaction",
        tarot: "Practical choices shine today - pursue efficiency for success",
        emoji: "🍔",
        traits: { spicy: 1, hearty: 4, adventurous: 1, social: 2, quick: 5 }
    },
    {
        id: 13,
        name: "Fried Chicken",
        category: "Late-night",
        image: `${IMAGE_BASE_PATH}/food-13.png`,
        desc: "Tonight, treat yourself to chicken",
        tarot: "You deserve a reward! Today, give yourself a gift",
        emoji: "🍗",
        traits: { spicy: 2, hearty: 4, adventurous: 1, social: 4, quick: 4 }
    },
    {
        id: 14,
        name: "Tteokbokki",
        category: "Street Food",
        image: `${IMAGE_BASE_PATH}/food-14.png`,
        desc: "Addictively spicy and sweet",
        tarot: "A rollercoaster of sweet and spicy emotions - enjoy it and find happiness",
        emoji: "🧆",
        traits: { spicy: 4, hearty: 3, adventurous: 1, social: 3, quick: 4 }
    },
    {
        id: 15,
        name: "Salad",
        category: "Diet",
        image: `${IMAGE_BASE_PATH}/food-15.png`,
        desc: "Light and healthy",
        tarot: "Preparing for a fresh start - a light heart brings good results",
        emoji: "🥗",
        traits: { spicy: 0, hearty: 1, adventurous: 2, social: 1, quick: 5 }
    },
    {
        id: 16,
        name: "Pho",
        category: "Asian",
        image: `${IMAGE_BASE_PATH}/food-16.png`,
        desc: "Light and aromatic broth",
        tarot: "An exotic opportunity is coming. Don't be afraid of new experiences",
        emoji: "🍜",
        traits: { spicy: 2, hearty: 2, adventurous: 4, social: 1, quick: 3 }
    }
];

/**
 * Balance Game Questions Data
 *
 * Each question has trait effects for choices:
 * - effectA/effectB: Weight applied to taste score when selected
 * - Positive: increases that taste, Negative: decreases that taste
 */
export const balanceQuestions = [
    {
        id: 1,
        question: "If you could only eat one forever?",
        optionA: { text: "Jajangmyeon", emoji: "🍜" },
        optionB: { text: "Jjamppong", emoji: "🌶️" },
        effectA: { spicy: -1, adventurous: -1, hearty: 1 },
        effectB: { spicy: 2, adventurous: 1, hearty: 1 },
        statsA: 52
    },
    {
        id: 2,
        question: "When eating chicken?",
        optionA: { text: "Original", emoji: "🍗" },
        optionB: { text: "Spicy", emoji: "🔥" },
        effectA: { spicy: -1, adventurous: -1 },
        effectB: { spicy: 1, adventurous: 1 },
        statsA: 45
    },
    {
        id: 3,
        question: "Sweet & Sour Pork - how do you eat it?",
        optionA: { text: "Pour sauce", emoji: "🫗" },
        optionB: { text: "Dip it", emoji: "👆" },
        effectA: { adventurous: 1, social: 1 },
        effectB: { adventurous: -1, social: -1 },
        statsA: 38
    },
    {
        id: 4,
        question: "Rice with ramen?",
        optionA: { text: "Must have", emoji: "🍚" },
        optionB: { text: "Not needed", emoji: "🙅" },
        effectA: { hearty: 2, quick: -1 },
        effectB: { hearty: -1, quick: 1 },
        statsA: 67
    },
    {
        id: 5,
        question: "For a late-night snack?",
        optionA: { text: "Chicken", emoji: "🍗" },
        optionB: { text: "Pizza", emoji: "🍕" },
        effectA: { social: 1, hearty: 1 },
        effectB: { social: 2, adventurous: 1 },
        statsA: 58
    },
    {
        id: 6,
        question: "When facing spicy food?",
        optionA: { text: "Challenge!", emoji: "🔥" },
        optionB: { text: "Mild please...", emoji: "😌" },
        effectA: { spicy: 3, adventurous: 2 },
        effectB: { spicy: -2, adventurous: -1 },
        statsA: 44
    },
    {
        id: 7,
        question: "When eating alone, you prefer?",
        optionA: { text: "Home cooking", emoji: "🏠" },
        optionB: { text: "Eating out", emoji: "🍽️" },
        effectA: { social: -2, quick: 1, adventurous: -1 },
        effectB: { social: 1, quick: -1, adventurous: 1 },
        statsA: 61
    },
    {
        id: 8,
        question: "Dessert?",
        optionA: { text: "Always yes", emoji: "🍰" },
        optionB: { text: "Pass if full", emoji: "✋" },
        effectA: { hearty: 1, quick: -1 },
        effectB: { hearty: -1, quick: 1 },
        statsA: 47
    },
    {
        id: 9,
        question: "Taking food photos?",
        optionA: { text: "Must post!", emoji: "📸" },
        optionB: { text: "Eat first", emoji: "😋" },
        effectA: { social: 2, quick: -1, adventurous: 1 },
        effectB: { social: -1, quick: 2 },
        statsA: 35
    },
    {
        id: 10,
        question: "New restaurant vs Regular spot?",
        optionA: { text: "Adventure!", emoji: "🗺️" },
        optionB: { text: "Comfort!", emoji: "🏆" },
        effectA: { adventurous: 3, social: 1 },
        effectB: { adventurous: -2, social: -1 },
        statsA: 42
    }
];

/**
 * Utility function: Shuffle array
 */
export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Utility function: Get random food
 */
export function getRandomFood() {
    return foods[Math.floor(Math.random() * foods.length)];
}

/**
 * Utility function: Find food by ID
 */
export function getFoodById(id) {
    return foods.find(food => food.id === id);
}

/**
 * Utility function: Get image path
 * @param {Object} food - Food object
 * @returns {string} Image path
 */
export function getImagePath(food) {
    return food.image;
}
