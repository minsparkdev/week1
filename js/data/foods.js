/**
 * 음식 데이터 모듈
 * - 16개 음식 (이상형 월드컵용)
 * - 타로 해석 메시지 포함
 * - 밸런스 게임 질문 포함
 */

export const foods = [
    {
        id: 1,
        name: "김치찌개",
        category: "한식",
        keyword: "Kimchi stew korean food delicious",
        desc: "얼큰하고 칼칼한 국물이 땡기는 날",
        tarot: "따뜻한 위로가 필요한 당신, 오늘은 마음을 녹이는 한 끼가 기다립니다",
        emoji: "🍲"
    },
    {
        id: 2,
        name: "삼겹살",
        category: "한식",
        keyword: "Grilled Pork Belly korean bbq sizzling",
        desc: "지글지글 구워지는 고기 소리",
        tarot: "에너지 충전이 필요한 시기! 든든한 한 끼로 활력을 되찾으세요",
        emoji: "🥓"
    },
    {
        id: 3,
        name: "비빔밥",
        category: "한식",
        keyword: "Bibimbap colorful korean food bowl",
        desc: "신선한 야채와 고추장의 조화",
        tarot: "다양한 기회가 섞여드는 날, 조화롭게 어우러질 운명입니다",
        emoji: "🍚"
    },
    {
        id: 4,
        name: "초밥",
        category: "일식",
        keyword: "Sushi platter fresh japanese",
        desc: "깔끔하고 신선한 한 끼",
        tarot: "정갈한 마음가짐이 행운을 부릅니다. 깔끔한 선택이 정답!",
        emoji: "🍣"
    },
    {
        id: 5,
        name: "라멘",
        category: "일식",
        keyword: "Japanese Ramen noodles rich broth",
        desc: "진한 국물과 쫄깃한 면발",
        tarot: "깊은 생각이 좋은 결과를 가져오는 날, 진중하게 나아가세요",
        emoji: "🍜"
    },
    {
        id: 6,
        name: "돈까스",
        category: "일식",
        keyword: "Tonkatsu pork cutlet crispy golden",
        desc: "바삭바삭한 튀김의 유혹",
        tarot: "겉과 속이 다른 기회가 찾아옵니다. 바삭한 행운을 잡으세요!",
        emoji: "🍱"
    },
    {
        id: 7,
        name: "짜장면",
        category: "중식",
        keyword: "Jajangmyeon black bean noodles korean chinese",
        desc: "국민 배달 음식의 정석",
        tarot: "익숙함 속에서 편안함을 찾는 날, 믿을 수 있는 선택이 답입니다",
        emoji: "🍝"
    },
    {
        id: 8,
        name: "마라탕",
        category: "중식",
        keyword: "Malatang spicy hot pot chinese",
        desc: "스트레스 풀리는 매운 맛",
        tarot: "뜨거운 열정이 필요한 때! 과감한 도전이 성공을 부릅니다",
        emoji: "🌶️"
    },
    {
        id: 9,
        name: "탕수육",
        category: "중식",
        keyword: "Sweet and sour pork chinese crispy",
        desc: "부먹? 찍먹? 일단 먹자",
        tarot: "달콤하고 새콤한 하루가 예상됩니다. 즐거움이 찾아와요!",
        emoji: "🥡"
    },
    {
        id: 10,
        name: "피자",
        category: "양식",
        keyword: "Pepperoni Pizza cheesy melting",
        desc: "치즈가 쭉 늘어나는 행복",
        tarot: "나눔의 기쁨이 있는 날, 함께할 때 더 맛있는 행운입니다",
        emoji: "🍕"
    },
    {
        id: 11,
        name: "파스타",
        category: "양식",
        keyword: "Creamy Pasta italian plating",
        desc: "분위기 있게 즐기는 한 끼",
        tarot: "로맨틱한 에너지가 감도는 날, 특별한 만남이 기다립니다",
        emoji: "🍝"
    },
    {
        id: 12,
        name: "햄버거",
        category: "양식",
        keyword: "Juicy Burger with fries american",
        desc: "빠르고 든든하게 채우는 맛",
        tarot: "실용적인 선택이 빛나는 날, 효율을 추구하면 성공합니다",
        emoji: "🍔"
    },
    {
        id: 13,
        name: "치킨",
        category: "야식",
        keyword: "Fried Chicken crispy golden korean",
        desc: "오늘 밤은 치느님과 함께",
        tarot: "보상받을 자격이 있는 당신! 오늘은 자신을 위한 선물을",
        emoji: "🍗"
    },
    {
        id: 14,
        name: "떡볶이",
        category: "분식",
        keyword: "Tteokbokki spicy rice cake korean street food",
        desc: "매콤달콤 중독성 있는 맛",
        tarot: "달콤 매콤한 감정의 롤러코스터, 즐기면 행복해집니다",
        emoji: "🧆"
    },
    {
        id: 15,
        name: "샐러드",
        category: "다이어트",
        keyword: "Fresh Salad bowl healthy green",
        desc: "가볍고 건강하게",
        tarot: "새로운 시작을 위한 준비, 가벼운 마음이 좋은 결과를 부릅니다",
        emoji: "🥗"
    },
    {
        id: 16,
        name: "쌀국수",
        category: "아시안",
        keyword: "Vietnamese Pho noodle soup fresh herbs",
        desc: "담백하고 향긋한 국물의 매력",
        tarot: "이국적인 기회가 찾아옵니다. 새로운 경험을 두려워 마세요",
        emoji: "🍜"
    }
];

/**
 * 밸런스 게임 질문 데이터
 */
export const balanceQuestions = [
    {
        id: 1,
        question: "평생 하나만 먹어야 한다면?",
        optionA: { text: "짜장면", emoji: "🍜" },
        optionB: { text: "짬뽕", emoji: "🌶️" },
        statsA: 52,
        statsB: 48
    },
    {
        id: 2,
        question: "치킨을 먹는다면?",
        optionA: { text: "후라이드", emoji: "🍗" },
        optionB: { text: "양념", emoji: "🔥" },
        statsA: 45,
        statsB: 55
    },
    {
        id: 3,
        question: "탕수육 먹을 때?",
        optionA: { text: "부먹", emoji: "🫗" },
        optionB: { text: "찍먹", emoji: "👆" },
        statsA: 38,
        statsB: 62
    },
    {
        id: 4,
        question: "라면 먹을 때 밥은?",
        optionA: { text: "필수", emoji: "🍚" },
        optionB: { text: "없어도 됨", emoji: "🙅" },
        statsA: 67,
        statsB: 33
    },
    {
        id: 5,
        question: "야식으로 먹는다면?",
        optionA: { text: "치킨", emoji: "🍗" },
        optionB: { text: "피자", emoji: "🍕" },
        statsA: 58,
        statsB: 42
    },
    {
        id: 6,
        question: "매운 음식을 마주했을 때?",
        optionA: { text: "도전!", emoji: "🔥" },
        optionB: { text: "순한맛으로...", emoji: "😌" },
        statsA: 44,
        statsB: 56
    },
    {
        id: 7,
        question: "혼밥할 때 선호하는 건?",
        optionA: { text: "집밥", emoji: "🏠" },
        optionB: { text: "외식", emoji: "🍽️" },
        statsA: 61,
        statsB: 39
    },
    {
        id: 8,
        question: "디저트는?",
        optionA: { text: "꼭 먹어야 함", emoji: "🍰" },
        optionB: { text: "배부르면 패스", emoji: "✋" },
        statsA: 47,
        statsB: 53
    },
    {
        id: 9,
        question: "음식 사진 찍기?",
        optionA: { text: "필수 인증샷", emoji: "📸" },
        optionB: { text: "먹는 게 먼저", emoji: "😋" },
        statsA: 35,
        statsB: 65
    },
    {
        id: 10,
        question: "새로운 맛집 vs 단골집?",
        optionA: { text: "모험!", emoji: "🗺️" },
        optionB: { text: "안정!", emoji: "🏆" },
        statsA: 42,
        statsB: 58
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
 * 유틸리티 함수: AI 이미지 URL 생성
 */
export function generateImageUrl(food, width = 800, height = 600) {
    const seed = Math.floor(Math.random() * 10000);
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(food.keyword)}%20delicious%20food%20photography%204k?width=${width}&height=${height}&nologo=true&seed=${seed}`;
}
