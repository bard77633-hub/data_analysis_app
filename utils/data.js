// プリセットデータセット定義

export const DATASETS = [
    {
        id: "students",
        name: "高校生の生活習慣と成績",
        description: "ある高校のクラス（20名）における生活習慣アンケートと期末テストの結果データ。",
        columns: [
            { key: "study_time", label: "勉強時間 (分/日)", type: "number", min: 0, max: 300 },
            { key: "score", label: "テスト点数 (点)", type: "number", min: 0, max: 100 },
            { key: "smartphone_time", label: "スマホ使用時間 (分/日)", type: "number", min: 0, max: 300 },
            { key: "height", label: "身長 (cm)", type: "number", min: 150, max: 190 },
            { key: "sleep_time", label: "睡眠時間 (時間)", type: "number", min: 4, max: 10 }
        ],
        data: [
            { id: 1, study_time: 120, score: 85, smartphone_time: 60, height: 170, sleep_time: 7.0 },
            { id: 2, study_time: 30, score: 45, smartphone_time: 180, height: 165, sleep_time: 6.0 },
            { id: 3, study_time: 90, score: 78, smartphone_time: 90, height: 172, sleep_time: 7.5 },
            { id: 4, study_time: 150, score: 92, smartphone_time: 45, height: 168, sleep_time: 6.5 },
            { id: 5, study_time: 60, score: 60, smartphone_time: 120, height: 175, sleep_time: 8.0 },
            { id: 6, study_time: 10, score: 30, smartphone_time: 240, height: 160, sleep_time: 5.5 },
            { id: 7, study_time: 180, score: 98, smartphone_time: 30, height: 171, sleep_time: 7.0 },
            { id: 8, study_time: 75, score: 70, smartphone_time: 100, height: 178, sleep_time: 7.0 },
            { id: 9, study_time: 45, score: 55, smartphone_time: 150, height: 166, sleep_time: 6.5 },
            { id: 10, study_time: 110, score: 82, smartphone_time: 70, height: 169, sleep_time: 7.5 },
            { id: 11, study_time: 130, score: 88, smartphone_time: 50, height: 173, sleep_time: 7.2 },
            { id: 12, study_time: 20, score: 40, smartphone_time: 200, height: 158, sleep_time: 6.0 },
            { id: 13, study_time: 100, score: 75, smartphone_time: 80, height: 174, sleep_time: 8.0 },
            { id: 14, study_time: 50, score: 58, smartphone_time: 130, height: 167, sleep_time: 7.0 },
            { id: 15, study_time: 160, score: 95, smartphone_time: 40, height: 176, sleep_time: 7.5 },
            { id: 16, study_time: 80, score: 72, smartphone_time: 110, height: 162, sleep_time: 7.0 },
            { id: 17, study_time: 40, score: 50, smartphone_time: 160, height: 170, sleep_time: 6.5 },
            { id: 18, study_time: 140, score: 90, smartphone_time: 55, height: 180, sleep_time: 8.0 },
            { id: 19, study_time: 5, score: 25, smartphone_time: 300, height: 164, sleep_time: 5.0 },
            { id: 20, study_time: 95, score: 76, smartphone_time: 95, height: 172, sleep_time: 7.2 }
        ]
    },
    {
        id: "convenience",
        name: "コンビニエンスストアの日別データ",
        description: "ある店舗の8月の営業データ（20日間）。気象条件と売上の関係。",
        columns: [
            { key: "temperature", label: "最高気温 (℃)", type: "number", min: 20, max: 40 },
            { key: "customers", label: "来客数 (人)", type: "number", min: 200, max: 1000 },
            { key: "icecream_sales", label: "アイス売上 (個)", type: "number", min: 0, max: 200 },
            { key: "hot_coffee_sales", label: "ホットコーヒー売上 (杯)", type: "number", min: 0, max: 100 },
            { key: "umbrella_sales", label: "傘売上 (本)", type: "number", min: 0, max: 50 },
            { key: "rain", label: "降水量 (mm)", type: "number", min: 0, max: 100 }
        ],
        data: [
            { id: 1, temperature: 35.0, customers: 850, icecream_sales: 180, hot_coffee_sales: 10, umbrella_sales: 0, rain: 0 },
            { id: 2, temperature: 28.0, customers: 600, icecream_sales: 50, hot_coffee_sales: 40, umbrella_sales: 20, rain: 15 },
            { id: 3, temperature: 33.5, customers: 800, icecream_sales: 150, hot_coffee_sales: 15, umbrella_sales: 0, rain: 0 },
            { id: 4, temperature: 24.0, customers: 450, icecream_sales: 20, hot_coffee_sales: 60, umbrella_sales: 45, rain: 50 },
            { id: 5, temperature: 36.2, customers: 900, icecream_sales: 200, hot_coffee_sales: 5, umbrella_sales: 0, rain: 0 },
            { id: 6, temperature: 31.0, customers: 700, icecream_sales: 100, hot_coffee_sales: 25, umbrella_sales: 5, rain: 0 },
            { id: 7, temperature: 22.5, customers: 400, icecream_sales: 15, hot_coffee_sales: 80, umbrella_sales: 30, rain: 20 },
            { id: 8, temperature: 34.0, customers: 820, icecream_sales: 160, hot_coffee_sales: 12, umbrella_sales: 0, rain: 0 },
            { id: 9, temperature: 30.5, customers: 680, icecream_sales: 90, hot_coffee_sales: 28, umbrella_sales: 2, rain: 0 },
            { id: 10, temperature: 29.0, customers: 620, icecream_sales: 70, hot_coffee_sales: 35, umbrella_sales: 10, rain: 5 },
            { id: 11, temperature: 37.0, customers: 950, icecream_sales: 210, hot_coffee_sales: 5, umbrella_sales: 0, rain: 0 },
            { id: 12, temperature: 23.0, customers: 420, icecream_sales: 18, hot_coffee_sales: 75, umbrella_sales: 40, rain: 35 },
            { id: 13, temperature: 32.5, customers: 750, icecream_sales: 130, hot_coffee_sales: 18, umbrella_sales: 0, rain: 0 },
            { id: 14, temperature: 27.5, customers: 580, icecream_sales: 45, hot_coffee_sales: 45, umbrella_sales: 15, rain: 10 },
            { id: 15, temperature: 35.5, customers: 880, icecream_sales: 190, hot_coffee_sales: 8, umbrella_sales: 0, rain: 0 },
            { id: 16, temperature: 30.0, customers: 650, icecream_sales: 80, hot_coffee_sales: 30, umbrella_sales: 0, rain: 0 },
            { id: 17, temperature: 25.0, customers: 500, icecream_sales: 30, hot_coffee_sales: 55, umbrella_sales: 25, rain: 12 },
            { id: 18, temperature: 34.5, customers: 830, icecream_sales: 170, hot_coffee_sales: 10, umbrella_sales: 0, rain: 0 },
            { id: 19, temperature: 21.0, customers: 350, icecream_sales: 10, hot_coffee_sales: 90, umbrella_sales: 50, rain: 60 },
            { id: 20, temperature: 31.5, customers: 720, icecream_sales: 110, hot_coffee_sales: 22, umbrella_sales: 0, rain: 0 }
        ]
    }
];

export const DRILL_QUESTS = [
    {
        id: 1,
        text: "「勉強時間」と「強い正の相関」がある項目を探そう。",
        datasetId: "students",
        targetX: "study_time",
        expectedCorrelation: "strong_positive",
        hint: "勉強を頑張ると上がる数値は何かな？"
    },
    {
        id: 2,
        text: "「スマホ使用時間」と「負の相関」がある項目を探そう。",
        datasetId: "students",
        targetX: "smartphone_time",
        expectedCorrelation: "negative",
        hint: "スマホを使いすぎると下がってしまうものは？"
    },
    {
        id: 3,
        text: "「最高気温」と「強い正の相関」があるコンビニの商品を探そう。",
        datasetId: "convenience",
        targetX: "temperature",
        expectedCorrelation: "strong_positive",
        hint: "暑い日によく売れる冷たいものは？"
    },
    {
        id: 4,
        text: "「降水量」と「強い正の相関」がある商品を探そう。",
        datasetId: "convenience",
        targetX: "rain",
        expectedCorrelation: "strong_positive",
        hint: "雨の日に必要になるものは？"
    }
];