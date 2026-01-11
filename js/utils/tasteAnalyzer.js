/**
 * 취향 분석 유틸리티 모듈
 *
 * 밸런스 게임 답변을 분석하여 사용자 취향 프로파일을 생성하고,
 * 가장 적합한 음식을 추천합니다.
 *
 * @module tasteAnalyzer
 */

import { foods } from '../data/foods.js';

/**
 * 기본 취향 프로파일 생성
 * 모든 특성을 중간값(2.5)으로 초기화
 * @returns {Object} 초기 취향 프로파일
 */
export function createInitialProfile() {
    return {
        spicy: 2.5,      // 매운맛 선호도
        hearty: 2.5,     // 든든함 선호도
        adventurous: 2.5, // 모험적 성향
        social: 2.5,     // 함께 먹기 선호도
        quick: 2.5       // 빠른 식사 선호도
    };
}

/**
 * 답변 기반으로 취향 프로파일 업데이트
 * @param {Object} profile - 현재 취향 프로파일
 * @param {Object} answer - 사용자 답변 { question, choice }
 * @returns {Object} 업데이트된 취향 프로파일
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
 * 모든 답변으로부터 최종 취향 프로파일 계산
 * @param {Array} answers - 사용자 답변 배열
 * @returns {Object} 최종 취향 프로파일
 */
export function calculateProfile(answers) {
    let profile = createInitialProfile();

    for (const answer of answers) {
        profile = updateProfile(profile, answer);
    }

    return profile;
}

/**
 * 음식과 사용자 취향 간의 적합도 점수 계산
 * 유클리드 거리 기반 유사도 (0~100)
 * @param {Object} profile - 사용자 취향 프로파일
 * @param {Object} food - 음식 데이터
 * @returns {number} 적합도 점수 (0~100, 높을수록 적합)
 */
export function calculateFoodScore(profile, food) {
    if (!food.traits) return 50; // traits가 없으면 중간 점수

    const traits = ['spicy', 'hearty', 'adventurous', 'social', 'quick'];
    let totalDistance = 0;

    for (const trait of traits) {
        const userValue = profile[trait] || 2.5;
        const foodValue = food.traits[trait] || 2.5;
        totalDistance += Math.pow(userValue - foodValue, 2);
    }

    // 유클리드 거리를 0~100 점수로 변환
    // 최대 거리: sqrt(5 * 5^2) = sqrt(125) ≈ 11.18
    const distance = Math.sqrt(totalDistance);
    const maxDistance = Math.sqrt(5 * 25);
    const score = Math.round((1 - distance / maxDistance) * 100);

    return Math.max(0, Math.min(100, score));
}

/**
 * 사용자 취향에 맞는 음식 추천
 * @param {Object} profile - 사용자 취향 프로파일
 * @param {number} count - 추천할 음식 개수 (기본: 1)
 * @returns {Array} 추천 음식 목록 (점수순 정렬)
 */
export function recommendFoods(profile, count = 1) {
    const scoredFoods = foods.map(food => ({
        food,
        score: calculateFoodScore(profile, food)
    }));

    // 점수 높은 순으로 정렬
    scoredFoods.sort((a, b) => b.score - a.score);

    // 상위 음식 반환 (동점일 경우 랜덤성 추가)
    const topScore = scoredFoods[0].score;
    const topFoods = scoredFoods.filter(sf => sf.score >= topScore - 5);

    // 상위 그룹에서 랜덤 선택 (약간의 변화 부여)
    if (topFoods.length > 1 && count === 1) {
        const randomIndex = Math.floor(Math.random() * Math.min(3, topFoods.length));
        return [topFoods[randomIndex]];
    }

    return scoredFoods.slice(0, count);
}

/**
 * 취향 프로파일의 주요 특성 분석
 * @param {Object} profile - 사용자 취향 프로파일
 * @returns {Object} 분석 결과 { dominant, description }
 */
export function analyzeProfile(profile) {
    const traitLabels = {
        spicy: { name: '매운맛', highDesc: '매운 음식을 좋아하시네요!', lowDesc: '순한 맛을 선호하시네요.' },
        hearty: { name: '든든함', highDesc: '푸짐하게 드시는 편이네요!', lowDesc: '가벼운 식사를 선호하시네요.' },
        adventurous: { name: '도전정신', highDesc: '새로운 음식에 도전하는 걸 좋아하시네요!', lowDesc: '익숙한 음식을 좋아하시네요.' },
        social: { name: '함께하기', highDesc: '여럿이 함께 먹는 걸 좋아하시네요!', lowDesc: '혼자 여유롭게 드시는 편이네요.' },
        quick: { name: '속도', highDesc: '빠르게 식사하는 편이네요!', lowDesc: '여유롭게 식사를 즐기시네요.' }
    };

    // 가장 높은/낮은 특성 찾기
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

    // 주요 특성 설명 생성
    const descriptions = [];
    if (highestValue >= 3.5 && traitLabels[highestTrait]) {
        descriptions.push(traitLabels[highestTrait].highDesc);
    }
    if (lowestValue <= 1.5 && traitLabels[lowestTrait]) {
        descriptions.push(traitLabels[lowestTrait].lowDesc);
    }

    // 취향 타입 결정
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
 * 취향 프로파일 기반 타입 결정
 * @param {Object} profile - 사용자 취향 프로파일
 * @returns {Object} 타입 정보 { name, emoji, description }
 */
function determineType(profile) {
    const { spicy, hearty, adventurous, social, quick } = profile;

    // 타입 결정 로직
    if (spicy >= 4 && adventurous >= 3.5) {
        return { name: '맵부심 도전가', emoji: '🌶️', description: '매운맛 앞에서 물러서지 않는 당신!' };
    }
    if (hearty >= 4 && social >= 3.5) {
        return { name: '든든한 모임왕', emoji: '🍖', description: '푸짐한 음식과 함께하는 자리를 좋아해요.' };
    }
    if (adventurous >= 4) {
        return { name: '맛집 탐험가', emoji: '🗺️', description: '새로운 음식에 도전하는 걸 즐기시네요!' };
    }
    if (quick >= 4 && hearty <= 2) {
        return { name: '효율 중시파', emoji: '⚡', description: '빠르고 가볍게! 효율적인 식사를 선호해요.' };
    }
    if (social <= 1.5) {
        return { name: '혼밥 마스터', emoji: '🧘', description: '나만의 시간을 즐기며 식사하는 타입이에요.' };
    }
    if (spicy <= 1 && hearty >= 3) {
        return { name: '순한맛 애호가', emoji: '😊', description: '자극적이지 않은 편안한 음식을 좋아해요.' };
    }
    if (hearty <= 2 && adventurous >= 3) {
        return { name: '가벼운 미식가', emoji: '🥗', description: '건강하고 가벼운 음식을 찾으시네요!' };
    }

    // 기본 타입
    return { name: '균형잡힌 미식가', emoji: '🍽️', description: '다양한 음식을 두루 즐기시는 타입이에요!' };
}

/**
 * 추천 음식에 대한 설명 생성
 * @param {Object} profile - 사용자 취향 프로파일
 * @param {Object} food - 추천 음식
 * @param {number} score - 적합도 점수
 * @returns {string} 추천 이유 설명
 */
export function generateRecommendationReason(profile, food, score) {
    if (!food.traits) return '당신을 위한 오늘의 추천 메뉴입니다!';

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
        spicy: '매운맛 취향에 딱 맞고',
        hearty: '든든한 한 끼로 적합하며',
        adventurous: '당신의 도전정신에 어울리고',
        social: '함께하기 좋은 음식이며',
        quick: '식사 시간에 잘 맞아서'
    };

    if (matches.length >= 2) {
        const reasonTexts = matches.slice(0, 2).map(m => reasons[m]).filter(Boolean);
        return `${reasonTexts.join(' ')} 추천드려요!`;
    }

    if (score >= 80) {
        return '당신의 취향과 아주 잘 맞는 메뉴예요!';
    } else if (score >= 60) {
        return '오늘 기분에 어울리는 메뉴예요!';
    }

    return '새로운 시도로 추천드리는 메뉴예요!';
}
