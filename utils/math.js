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
 * 相関の強さを判定
 */
export const getCorrelationStrength = (r) => {
    const absR = Math.abs(r);
    if (absR >= 0.7) return r > 0 ? "強い正の相関" : "強い負の相関";
    if (absR >= 0.4) return r > 0 ? "正の相関あり" : "負の相関あり";
    if (absR >= 0.2) return r > 0 ? "弱い正の相関" : "弱い負の相関";
    return "相関なし";
};

/**
 * 予測値を計算
 */
export const predictY = (x, slope, intercept) => {
    return slope * x + intercept;
};