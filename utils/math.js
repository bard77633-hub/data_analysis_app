
// 統計計算用ユーティリティ

/**
 * 平均値を計算
 */
export const calculateMean = (data) => {
    if (!data || data.length === 0) return 0;
    const sum = data.reduce((acc, val) => acc + val, 0);
    return sum / data.length;
};

/**
 * 相関係数 (r) を計算
 */
export const calculateCorrelation = (xArray, yArray) => {
    if (xArray.length !== yArray.length || xArray.length === 0) return 0;
    const n = xArray.length;
    const meanX = calculateMean(xArray);
    const meanY = calculateMean(yArray);

    let numerator = 0;
    let sumSqDiffX = 0;
    let sumSqDiffY = 0;

    for (let i = 0; i < n; i++) {
        const diffX = xArray[i] - meanX;
        const diffY = yArray[i] - meanY;
        numerator += diffX * diffY;
        sumSqDiffX += diffX * diffX;
        sumSqDiffY += diffY * diffY;
    }

    const denominator = Math.sqrt(sumSqDiffX * sumSqDiffY);
    if (denominator === 0) return 0;

    return numerator / denominator;
};

/**
 * 回帰直線 (y = ax + b) のパラメータを計算
 */
export const calculateRegression = (xArray, yArray) => {
    if (xArray.length !== yArray.length || xArray.length === 0) {
        return { slope: 0, intercept: 0 };
    }
    const n = xArray.length;
    const meanX = calculateMean(xArray);
    const meanY = calculateMean(yArray);

    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n; i++) {
        const diffX = xArray[i] - meanX;
        const diffY = yArray[i] - meanY;
        numerator += diffX * diffY;
        denominator += diffX * diffX;
    }

    const slope = denominator === 0 ? 0 : numerator / denominator;
    const intercept = meanY - (slope * meanX);

    return { slope, intercept };
};

/**
 * 相関の強さを判定（7段階評価）
 */
export const getCorrelationStrength = (r) => {
    if (r >= 0.7) return "かなり強い正の相関がある";
    if (r >= 0.4) return "正の相関がある";
    if (r >= 0.2) return "弱い正の相関がある";
    if (r > -0.2) return "ほとんど相関がない";
    if (r > -0.4) return "弱い負の相関がある";
    if (r > -0.7) return "負の相関がある";
    return "かなり強い負の相関がある";
};

/**
 * 予測値を計算
 */
export const predictY = (x, slope, intercept) => {
    return slope * x + intercept;
};
