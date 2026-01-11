/**
 * 음식 데이터 모듈
 * - 16개 음식 (이상형 월드컵용)
 * - 로컬 이미지 경로 포함
 * - 타로 해석 메시지 포함
 * - 밸런스 게임용 취향 특성(traits) 포함
 */

// 이미지 기본 경로
const IMAGE_BASE_PATH = './assets/images/foods';

/**
 * 취향 특성(Traits) 설명:
 * - spicy: 매운맛 선호도 (0: 순한맛 ~ 5: 아주 매움)
 * - hearty: 든든함/푸짐함 (0: 가벼움 ~ 5: 매우 푸짐)
 * - adventurous: 모험적 성향 (0: 익숙한 것 ~ 5: 새로운 것)
 * - social: 함께 먹기 적합도 (0: 혼밥용 ~ 5: 단체용)
 * - quick: 빠른 식사 (0: 여유롭게 ~ 5: 빠르게)
 */
export const foods = [
    {
        id: 1,
        name: "김치찌개",
        category: "한식",
        image: `${IMAGE_BASE_PATH}/food-1.png`,
        desc: "얼큰하고 칼칼한 국물이 땡기는 날",
        tarot: "따뜻한 위로가 필요한 당신, 오늘은 마음을 녹이는 한 끼가 기다립니다",
        emoji: "🍲",
        traits: { spicy: 3, hearty: 4, adventurous: 1, social: 2, quick: 3 }
    },
    {
        id: 2,
        name: "삼겹살",
        category: "한식",
        image: `${IMAGE_BASE_PATH}/food-2.png`,
        desc: "지글지글 구워지는 고기 소리",
        tarot: "에너지 충전이 필요한 시기! 든든한 한 끼로 활력을 되찾으세요",
        emoji: "🥓",
        traits: { spicy: 1, hearty: 5, adventurous: 2, social: 5, quick: 1 }
    },
    {
        id: 3,
        name: "비빔밥",
        category: "한식",
        image: `${IMAGE_BASE_PATH}/food-3.png`,
        desc: "신선한 야채와 고추장의 조화",
        tarot: "다양한 기회가 섞여드는 날, 조화롭게 어우러질 운명입니다",
        emoji: "🍚",
        traits: { spicy: 2, hearty: 3, adventurous: 2, social: 1, quick: 4 }
    },
    {
        id: 4,
        name: "초밥",
        category: "일식",
        image: `${IMAGE_BASE_PATH}/food-4.png`,
        desc: "깔끔하고 신선한 한 끼",
        tarot: "정갈한 마음가짐이 행운을 부릅니다. 깔끔한 선택이 정답!",
        emoji: "🍣",
        traits: { spicy: 0, hearty: 2, adventurous: 3, social: 3, quick: 3 }
    },
    {
        id: 5,
        name: "라멘",
        category: "일식",
        image: `${IMAGE_BASE_PATH}/food-5.png`,
        desc: "진한 국물과 쫄깃한 면발",
        tarot: "깊은 생각이 좋은 결과를 가져오는 날, 진중하게 나아가세요",
        emoji: "🍜",
        traits: { spicy: 2, hearty: 4, adventurous: 3, social: 1, quick: 3 }
    },
    {
        id: 6,
        name: "돈까스",
        category: "일식",
        image: `${IMAGE_BASE_PATH}/food-6.png`,
        desc: "바삭바삭한 튀김의 유혹",
        tarot: "겉과 속이 다른 기회가 찾아옵니다. 바삭한 행운을 잡으세요!",
        emoji: "🍱",
        traits: { spicy: 0, hearty: 4, adventurous: 1, social: 1, quick: 4 }
    },
    {
        id: 7,
        name: "짜장면",
        category: "중식",
        image: `${IMAGE_BASE_PATH}/food-7.png`,
        desc: "국민 배달 음식의 정석",
        tarot: "익숙함 속에서 편안함을 찾는 날, 믿을 수 있는 선택이 답입니다",
        emoji: "🍝",
        traits: { spicy: 0, hearty: 4, adventurous: 0, social: 2, quick: 5 }
    },
    {
        id: 8,
        name: "마라탕",
        category: "중식",
        image: `${IMAGE_BASE_PATH}/food-8.png`,
        desc: "스트레스 풀리는 매운 맛",
        tarot: "뜨거운 열정이 필요한 때! 과감한 도전이 성공을 부릅니다",
        emoji: "🌶️",
        traits: { spicy: 5, hearty: 4, adventurous: 4, social: 3, quick: 2 }
    },
    {
        id: 9,
        name: "탕수육",
        category: "중식",
        image: `${IMAGE_BASE_PATH}/food-9.png`,
        desc: "부먹? 찍먹? 일단 먹자",
        tarot: "달콤하고 새콤한 하루가 예상됩니다. 즐거움이 찾아와요!",
        emoji: "🥡",
        traits: { spicy: 0, hearty: 3, adventurous: 1, social: 4, quick: 3 }
    },
    {
        id: 10,
        name: "피자",
        category: "양식",
        image: `${IMAGE_BASE_PATH}/food-10.png`,
        desc: "치즈가 쭉 늘어나는 행복",
        tarot: "나눔의 기쁨이 있는 날, 함께할 때 더 맛있는 행운입니다",
        emoji: "🍕",
        traits: { spicy: 1, hearty: 4, adventurous: 2, social: 5, quick: 4 }
    },
    {
        id: 11,
        name: "파스타",
        category: "양식",
        image: `${IMAGE_BASE_PATH}/food-11.png`,
        desc: "분위기 있게 즐기는 한 끼",
        tarot: "로맨틱한 에너지가 감도는 날, 특별한 만남이 기다립니다",
        emoji: "🍝",
        traits: { spicy: 1, hearty: 3, adventurous: 3, social: 3, quick: 2 }
    },
    {
        id: 12,
        name: "햄버거",
        category: "양식",
        image: `${IMAGE_BASE_PATH}/food-12.png`,
        desc: "빠르고 든든하게 채우는 맛",
        tarot: "실용적인 선택이 빛나는 날, 효율을 추구하면 성공합니다",
        emoji: "🍔",
        traits: { spicy: 1, hearty: 4, adventurous: 1, social: 2, quick: 5 }
    },
    {
        id: 13,
        name: "치킨",
        category: "야식",
        image: `${IMAGE_BASE_PATH}/food-13.png`,
        desc: "오늘 밤은 치느님과 함께",
        tarot: "보상받을 자격이 있는 당신! 오늘은 자신을 위한 선물을",
        emoji: "🍗",
        traits: { spicy: 2, hearty: 4, adventurous: 1, social: 4, quick: 4 }
    },
    {
        id: 14,
        name: "떡볶이",
        category: "분식",
        image: `${IMAGE_BASE_PATH}/food-14.png`,
        desc: "매콤달콤 중독성 있는 맛",
        tarot: "달콤 매콤한 감정의 롤러코스터, 즐기면 행복해집니다",
        emoji: "🧆",
        traits: { spicy: 4, hearty: 3, adventurous: 1, social: 3, quick: 4 }
    },
    {
        id: 15,
        name: "샐러드",
        category: "다이어트",
        image: `${IMAGE_BASE_PATH}/food-15.png`,
        desc: "가볍고 건강하게",
        tarot: "새로운 시작을 위한 준비, 가벼운 마음이 좋은 결과를 부릅니다",
        emoji: "🥗",
        traits: { spicy: 0, hearty: 1, adventurous: 2, social: 1, quick: 5 }
    },
    {
        id: 16,
        name: "쌀국수",
        category: "아시안",
        image: `${IMAGE_BASE_PATH}/food-16.png`,
        desc: "담백하고 향긋한 국물의 매력",
        tarot: "이국적인 기회가 찾아옵니다. 새로운 경험을 두려워 마세요",
        emoji: "🍜",
        traits: { spicy: 2, hearty: 2, adventurous: 4, social: 1, quick: 3 }
    }
];

/**
 * 밸런스 게임 질문 데이터
 *
 * 각 질문의 선택지에 traits 효과 추가:
 * - effectA/effectB: 해당 선택 시 취향 점수에 적용되는 가중치
 * - 양수: 해당 취향 증가, 음수: 해당 취향 감소
 */
export const balanceQuestions = [
    {
        id: 1,
        question: "평생 하나만 먹어야 한다면?",
        optionA: { text: "짜장면", emoji: "🍜" },
        optionB: { text: "짬뽕", emoji: "🌶️" },
        effectA: { spicy: -1, adventurous: -1, hearty: 1 },
        effectB: { spicy: 2, adventurous: 1, hearty: 1 },
        statsA: 52
    },
    {
        id: 2,
        question: "치킨을 먹는다면?",
        optionA: { text: "후라이드", emoji: "🍗" },
        optionB: { text: "양념", emoji: "🔥" },
        effectA: { spicy: -1, adventurous: -1 },
        effectB: { spicy: 1, adventurous: 1 },
        statsA: 45
    },
    {
        id: 3,
        question: "탕수육 먹을 때?",
        optionA: { text: "부먹", emoji: "🫗" },
        optionB: { text: "찍먹", emoji: "👆" },
        effectA: { adventurous: 1, social: 1 },
        effectB: { adventurous: -1, social: -1 },
        statsA: 38
    },
    {
        id: 4,
        question: "라면 먹을 때 밥은?",
        optionA: { text: "필수", emoji: "🍚" },
        optionB: { text: "없어도 됨", emoji: "🙅" },
        effectA: { hearty: 2, quick: -1 },
        effectB: { hearty: -1, quick: 1 },
        statsA: 67
    },
    {
        id: 5,
        question: "야식으로 먹는다면?",
        optionA: { text: "치킨", emoji: "🍗" },
        optionB: { text: "피자", emoji: "🍕" },
        effectA: { social: 1, hearty: 1 },
        effectB: { social: 2, adventurous: 1 },
        statsA: 58
    },
    {
        id: 6,
        question: "매운 음식을 마주했을 때?",
        optionA: { text: "도전!", emoji: "🔥" },
        optionB: { text: "순한맛으로...", emoji: "😌" },
        effectA: { spicy: 3, adventurous: 2 },
        effectB: { spicy: -2, adventurous: -1 },
        statsA: 44
    },
    {
        id: 7,
        question: "혼밥할 때 선호하는 건?",
        optionA: { text: "집밥", emoji: "🏠" },
        optionB: { text: "외식", emoji: "🍽️" },
        effectA: { social: -2, quick: 1, adventurous: -1 },
        effectB: { social: 1, quick: -1, adventurous: 1 },
        statsA: 61
    },
    {
        id: 8,
        question: "디저트는?",
        optionA: { text: "꼭 먹어야 함", emoji: "🍰" },
        optionB: { text: "배부르면 패스", emoji: "✋" },
        effectA: { hearty: 1, quick: -1 },
        effectB: { hearty: -1, quick: 1 },
        statsA: 47
    },
    {
        id: 9,
        question: "음식 사진 찍기?",
        optionA: { text: "필수 인증샷", emoji: "📸" },
        optionB: { text: "먹는 게 먼저", emoji: "😋" },
        effectA: { social: 2, quick: -1, adventurous: 1 },
        effectB: { social: -1, quick: 2 },
        statsA: 35
    },
    {
        id: 10,
        question: "새로운 맛집 vs 단골집?",
        optionA: { text: "모험!", emoji: "🗺️" },
        optionB: { text: "안정!", emoji: "🏆" },
        effectA: { adventurous: 3, social: 1 },
        effectB: { adventurous: -2, social: -1 },
        statsA: 42
    }
];

/**
 * 유틸리티 함수: 배열 셔플
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
 * 유틸리티 함수: 랜덤 음식 선택
 */
export function getRandomFood() {
    return foods[Math.floor(Math.random() * foods.length)];
}

/**
 * 유틸리티 함수: ID로 음식 찾기
 */
export function getFoodById(id) {
    return foods.find(food => food.id === id);
}

/**
 * 유틸리티 함수: 이미지 경로 가져오기
 * @param {Object} food - 음식 객체
 * @returns {string} 이미지 경로
 */
export function getImagePath(food) {
    return food.image;
}
