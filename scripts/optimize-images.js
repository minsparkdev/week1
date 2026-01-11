/**
 * 이미지 최적화 스크립트
 *
 * 분석 결과:
 * - 최대 표시 크기: 640px (추천 카드)
 * - 2x DPI 대응: 800px 권장
 * - Canvas 공유: 460px × 300px
 *
 * 최적화 전략:
 * 1. 최대 너비 800px로 리사이즈 (2x DPI 대응)
 * 2. PNG 압축 최적화
 * 3. 비율 유지
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, '../assets/images/foods');
const BACKUP_DIR = path.join(__dirname, '../assets/images/foods_original');
const MAX_WIDTH = 800; // 2x DPI for 400px display

async function getImageInfo(filePath) {
    const stats = fs.statSync(filePath);
    const metadata = await sharp(filePath).metadata();
    return {
        width: metadata.width,
        height: metadata.height,
        size: stats.size,
        sizeMB: (stats.size / (1024 * 1024)).toFixed(2)
    };
}

async function optimizeImage(inputPath, outputPath) {
    const metadata = await sharp(inputPath).metadata();

    // 비율 계산
    let width = metadata.width;
    let height = metadata.height;

    if (width > MAX_WIDTH) {
        const ratio = MAX_WIDTH / width;
        width = MAX_WIDTH;
        height = Math.round(metadata.height * ratio);
    }

    await sharp(inputPath)
        .resize(width, height, {
            fit: 'inside',
            withoutEnlargement: true
        })
        .png({
            compressionLevel: 9,
            palette: true,
            quality: 80,
            effort: 10
        })
        .toFile(outputPath);

    return { width, height };
}

async function main() {
    console.log('🖼️  이미지 최적화 시작\n');
    console.log(`📁 소스: ${SOURCE_DIR}`);
    console.log(`📁 백업: ${BACKUP_DIR}`);
    console.log(`📐 최대 너비: ${MAX_WIDTH}px\n`);

    // 백업 폴더 생성
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
        console.log('✅ 백업 폴더 생성됨\n');
    }

    const files = fs.readdirSync(SOURCE_DIR)
        .filter(f => f.endsWith('.png'))
        .sort();

    let totalOriginal = 0;
    let totalOptimized = 0;

    console.log('━'.repeat(70));
    console.log('파일명'.padEnd(20) + '원본 크기'.padEnd(15) + '원본 용량'.padEnd(12) + '→ 최적화 크기'.padEnd(15) + '최적화 용량');
    console.log('━'.repeat(70));

    for (const file of files) {
        const inputPath = path.join(SOURCE_DIR, file);
        const backupPath = path.join(BACKUP_DIR, file);
        const tempPath = path.join(SOURCE_DIR, `temp_${file}`);

        try {
            // 원본 정보
            const originalInfo = await getImageInfo(inputPath);
            totalOriginal += originalInfo.size;

            // 백업 (이미 있으면 건너뜀)
            if (!fs.existsSync(backupPath)) {
                fs.copyFileSync(inputPath, backupPath);
            }

            // 최적화 (임시 파일로)
            const newDimensions = await optimizeImage(inputPath, tempPath);

            // 최적화된 파일 정보
            const optimizedInfo = await getImageInfo(tempPath);
            totalOptimized += optimizedInfo.size;

            // 임시 파일을 원본으로 교체
            fs.unlinkSync(inputPath);
            fs.renameSync(tempPath, inputPath);

            // 결과 출력
            const reduction = ((1 - optimizedInfo.size / originalInfo.size) * 100).toFixed(0);
            console.log(
                file.padEnd(20) +
                `${originalInfo.width}×${originalInfo.height}`.padEnd(15) +
                `${originalInfo.sizeMB}MB`.padEnd(12) +
                `→ ${newDimensions.width}×${newDimensions.height}`.padEnd(15) +
                `${optimizedInfo.sizeMB}MB (-${reduction}%)`
            );

        } catch (err) {
            console.error(`❌ ${file}: ${err.message}`);
            // 임시 파일 정리
            if (fs.existsSync(tempPath)) {
                fs.unlinkSync(tempPath);
            }
        }
    }

    console.log('━'.repeat(70));

    const totalOriginalMB = (totalOriginal / (1024 * 1024)).toFixed(2);
    const totalOptimizedMB = (totalOptimized / (1024 * 1024)).toFixed(2);
    const totalReduction = ((1 - totalOptimized / totalOriginal) * 100).toFixed(0);

    console.log(`\n📊 결과 요약:`);
    console.log(`   원본 총 용량: ${totalOriginalMB}MB`);
    console.log(`   최적화 총 용량: ${totalOptimizedMB}MB`);
    console.log(`   절감률: ${totalReduction}%`);
    console.log(`   절감 용량: ${((totalOriginal - totalOptimized) / (1024 * 1024)).toFixed(2)}MB`);
    console.log(`\n💾 원본 파일은 ${BACKUP_DIR}에 백업됨`);
}

main().catch(console.error);
