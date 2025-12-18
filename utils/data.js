
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
            { key: "sleep_time", label: "睡眠時間 (時間)", type: "number", min: 4, max: 10 },
            { key: "commute_time", label: "通学時間 (分)", type: "number", min: 0, max: 120 },
            { key: "gaming_time", label: "ゲーム時間 (分/日)", type: "number", min: 0, max: 300 }
        ],
        data: [
            { id: 1, study_time: 120, score: 85, smartphone_time: 60, height: 170, sleep_time: 7.5, commute_time: 30, gaming_time: 20 },
            { id: 2, study_time: 30, score: 45, smartphone_time: 240, height: 165, sleep_time: 5.0, commute_time: 15, gaming_time: 180 },
            { id: 3, study_time: 90, score: 78, smartphone_time: 90, height: 172, sleep_time: 7.0, commute_time: 45, gaming_time: 60 },
            { id: 4, study_time: 150, score: 92, smartphone_time: 45, height: 168, sleep_time: 8.0, commute_time: 20, gaming_time: 10 },
            { id: 5, study_time: 60, score: 60, smartphone_time: 150, height: 175, sleep_time: 6.5, commute_time: 60, gaming_time: 90 },
            { id: 6, study_time: 10, score: 30, smartphone_time: 280, height: 160, sleep_time: 4.5, commute_time: 25, gaming_time: 200 },
            { id: 7, study_time: 180, score: 98, smartphone_time: 20, height: 171, sleep_time: 8.5, commute_time: 50, gaming_time: 0 },
            { id: 8, study_time: 75, score: 70, smartphone_time: 100, height: 178, sleep_time: 7.0, commute_time: 10, gaming_time: 60 },
            { id: 9, study_time: 45, score: 55, smartphone_time: 180, height: 166, sleep_time: 6.0, commute_time: 40, gaming_time: 120 },
            { id: 10, study_time: 110, score: 82, smartphone_time: 70, height: 169, sleep_time: 7.5, commute_time: 35, gaming_time: 30 },
            { id: 11, study_time: 130, score: 88, smartphone_time: 50, height: 173, sleep_time: 8.0, commute_time: 15, gaming_time: 20 },
            { id: 12, study_time: 20, score: 40, smartphone_time: 220, height: 158, sleep_time: 5.5, commute_time: 55, gaming_time: 150 },
            { id: 13, study_time: 100, score: 75, smartphone_time: 80, height: 174, sleep_time: 7.2, commute_time: 20, gaming_time: 50 },
            { id: 14, study_time: 50, score: 58, smartphone_time: 160, height: 167, sleep_time: 6.0, commute_time: 30, gaming_time: 100 },
            { id: 15, study_time: 160, score: 95, smartphone_time: 30, height: 176, sleep_time: 8.2, commute_time: 45, gaming_time: 10 },
            { id: 16, study_time: 80, score: 72, smartphone_time: 110, height: 162, sleep_time: 7.0, commute_time: 25, gaming_time: 70 },
            { id: 17, study_time: 40, score: 50, smartphone_time: 190, height: 170, sleep_time: 5.8, commute_time: 60, gaming_time: 130 },
            { id: 18, study_time: 140, score: 90, smartphone_time: 55, height: 180, sleep_time: 7.8, commute_time: 10, gaming_time: 15 },
            { id: 19, study_time: 5, score: 25, smartphone_time: 300, height: 164, sleep_time: 4.0, commute_time: 5, gaming_time: 240 },
            { id: 20, study_time: 95, score: 76, smartphone_time: 95, height: 172, sleep_time: 7.0, commute_time: 30, gaming_time: 60 }
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
            { key: "cold_drink_sales", label: "清涼飲料水売上 (本)", type: "number", min: 0, max: 500 },
            { key: "hot_coffee_sales", label: "ホットコーヒー売上 (杯)", type: "number", min: 0, max: 100 },
            { key: "umbrella_sales", label: "傘売上 (本)", type: "number", min: 0, max: 50 },
            { key: "rain", label: "降水量 (mm)", type: "number", min: 0, max: 100 }
        ],
        data: [
            { id: 1, temperature: 35.0, customers: 850, icecream_sales: 180, cold_drink_sales: 450, hot_coffee_sales: 10, umbrella_sales: 0, rain: 0 },
            { id: 2, temperature: 28.0, customers: 600, icecream_sales: 50, cold_drink_sales: 200, hot_coffee_sales: 40, umbrella_sales: 20, rain: 15 },
            { id: 3, temperature: 33.5, customers: 800, icecream_sales: 150, cold_drink_sales: 400, hot_coffee_sales: 15, umbrella_sales: 0, rain: 0 },
            { id: 4, temperature: 24.0, customers: 450, icecream_sales: 20, cold_drink_sales: 120, hot_coffee_sales: 60, umbrella_sales: 45, rain: 50 },
            { id: 5, temperature: 36.2, customers: 900, icecream_sales: 200, cold_drink_sales: 480, hot_coffee_sales: 5, umbrella_sales: 0, rain: 0 },
            { id: 6, temperature: 31.0, customers: 700, icecream_sales: 100, cold_drink_sales: 320, hot_coffee_sales: 25, umbrella_sales: 5, rain: 0 },
            { id: 7, temperature: 22.5, customers: 400, icecream_sales: 15, cold_drink_sales: 100, hot_coffee_sales: 80, umbrella_sales: 30, rain: 20 },
            { id: 8, temperature: 34.0, customers: 820, icecream_sales: 160, cold_drink_sales: 430, hot_coffee_sales: 12, umbrella_sales: 0, rain: 0 },
            { id: 9, temperature: 30.5, customers: 680, icecream_sales: 90, cold_drink_sales: 300, hot_coffee_sales: 28, umbrella_sales: 2, rain: 0 },
            { id: 10, temperature: 29.0, customers: 620, icecream_sales: 70, cold_drink_sales: 250, hot_coffee_sales: 35, umbrella_sales: 10, rain: 5 },
            { id: 11, temperature: 37.0, customers: 950, icecream_sales: 210, cold_drink_sales: 490, hot_coffee_sales: 5, umbrella_sales: 0, rain: 0 },
            { id: 12, temperature: 23.0, customers: 420, icecream_sales: 18, cold_drink_sales: 110, hot_coffee_sales: 75, umbrella_sales: 40, rain: 35 },
            { id: 13, temperature: 32.5, customers: 750, icecream_sales: 130, cold_drink_sales: 380, hot_coffee_sales: 18, umbrella_sales: 0, rain: 0 },
            { id: 14, temperature: 27.5, customers: 580, icecream_sales: 45, cold_drink_sales: 190, hot_coffee_sales: 45, umbrella_sales: 15, rain: 10 },
            { id: 15, temperature: 35.5, customers: 880, icecream_sales: 190, cold_drink_sales: 460, hot_coffee_sales: 8, umbrella_sales: 0, rain: 0 },
            { id: 16, temperature: 30.0, customers: 650, icecream_sales: 80, cold_drink_sales: 280, hot_coffee_sales: 30, umbrella_sales: 0, rain: 0 },
            { id: 17, temperature: 25.0, customers: 500, icecream_sales: 30, cold_drink_sales: 150, hot_coffee_sales: 55, umbrella_sales: 25, rain: 12 },
            { id: 18, temperature: 34.5, customers: 830, icecream_sales: 170, cold_drink_sales: 440, hot_coffee_sales: 10, umbrella_sales: 0, rain: 0 },
            { id: 19, temperature: 21.0, customers: 350, icecream_sales: 10, cold_drink_sales: 80, hot_coffee_sales: 90, umbrella_sales: 50, rain: 60 },
            { id: 20, temperature: 31.5, customers: 720, icecream_sales: 110, cold_drink_sales: 330, hot_coffee_sales: 22, umbrella_sales: 0, rain: 0 }
        ]
    },
    // --- Extra Missions (Data Cleaning & Searching) ---
    {
        id: "extra_cleaning_1",
        name: "【修正用 Lv.1】テスト結果の入力ミス",
        description: "入力ミスが含まれているデータセット。",
        columns: [
            { key: "study_time", label: "勉強時間 (分/日)", type: "number", min: 0, max: 300 },
            { key: "score", label: "テスト点数 (点)", type: "number", min: 0, max: 100 }
        ],
        data: [
            { id: 1, study_time: 120, score: 85 },
            { id: 2, study_time: 30, score: 45 },
            { id: 3, study_time: 90, score: 78 },
            { id: 4, study_time: 150, score: 92 },
            { id: 5, study_time: 60, score: 60 },
            { id: 6, study_time: 10, score: 30 },
            { id: 7, study_time: 180, score: 98 },
            { id: 8, study_time: 75, score: 70 },
            { id: 9, study_time: 45, score: 55 },
            { id: 10, study_time: 110, score: 82 },
            { id: 11, study_time: 130, score: 88 },
            { id: 12, study_time: 20, score: 40 },
            { id: 13, study_time: 100, score: 75 },
            { id: 99, study_time: 10, score: 95 },
            { id: 100, study_time: 250, score: 10 }
        ]
    },
    {
        id: "extra_selection_1",
        name: "【探索用 Lv.1】天才肌の生徒",
        description: "生徒の特性データ。",
        columns: [
            { key: "study_time", label: "勉強時間 (分/日)", type: "number", min: 0, max: 300 },
            { key: "score", label: "テスト点数 (点)", type: "number", min: 0, max: 100 }
        ],
        data: [
            { id: 1, study_time: 120, score: 85 },
            { id: 2, study_time: 130, score: 88 },
            { id: 3, study_time: 140, score: 90 },
            { id: 4, study_time: 150, score: 92 },
            { id: 5, study_time: 180, score: 98 },
            { id: 6, study_time: 30, score: 45 },
            { id: 7, study_time: 40, score: 50 },
            { id: 8, study_time: 45, score: 55 },
            { id: 9, study_time: 20, score: 40 },
            { id: 10, study_time: 10, score: 30 },
            // Targets: Low Study, High Score
            { id: 21, study_time: 20, score: 90 },
            { id: 22, study_time: 30, score: 95 },
            { id: 23, study_time: 15, score: 85 },
            // Decoys: Low Study, but Average Score (Not Genius)
            { id: 91, study_time: 25, score: 60 }, 
            { id: 92, study_time: 35, score: 65 }
        ]
    },
    {
        id: "extra_selection_2",
        name: "【探索用 Lv.2】伝説の武器",
        description: "装備と攻撃力のデータ。",
        columns: [
            { key: "equip_weight", label: "装備重量", type: "number", min: 0, max: 100 },
            { key: "attack", label: "攻撃力", type: "number", min: 10, max: 200 }
        ],
        data: [
            { id: 1, equip_weight: 80, attack: 150 },
            { id: 2, equip_weight: 90, attack: 180 },
            { id: 3, equip_weight: 70, attack: 140 },
            { id: 4, equip_weight: 85, attack: 170 },
            { id: 5, equip_weight: 95, attack: 190 },
            { id: 6, equip_weight: 20, attack: 30 },
            { id: 7, equip_weight: 15, attack: 25 },
            { id: 8, equip_weight: 30, attack: 40 },
            { id: 9, equip_weight: 25, attack: 35 },
            { id: 10, equip_weight: 10, attack: 20 },
            // Good weapons (Decoys)
            { id: 31, equip_weight: 15, attack: 140 }, // Good
            { id: 32, equip_weight: 20, attack: 150 }, // Good
            // The Legendary One (Target)
            { id: 33, equip_weight: 5, attack: 195 } // Extreme
        ]
    }
];

export const DRILL_QUESTS = [
    {
        id: 1,
        text: "【調査依頼：校長先生】「勉強すればするほど、本当に成績は上がるのか証明してほしい！」とのことです。",
        datasetId: "students",
        initialX: "study_time",
        initialY: "height",
        targetKey: "study_time",
        validAnswers: ["score"], 
        explicitObjective: "「勉強時間」と「強い正の相関」がある項目を探してください。",
        expectedStrength: "かなり強い正の相関がある",
        hint: "勉強時間を横軸にしたとき、右肩上がり（正の相関）になる項目はどれかな？",
        causationNote: "【分析結果】「勉強時間」と「成績」には強い正の相関が見られました。例外もありますが、基本的には学習量に比例して成果が出る傾向にあると言えます。校長先生もこれで安心するでしょう！"
    },
    {
        id: 2,
        text: "【調査依頼：生活指導の先生】「スマホの使いすぎで成績が下がっている生徒がいる気がする…。データで確認してくれ」",
        datasetId: "students",
        initialX: "smartphone_time",
        initialY: "height",
        targetKey: "smartphone_time",
        validAnswers: ["score", "study_time"],
        explicitObjective: "「スマホ使用時間」と「負の相関」がある項目を探してください。",
        expectedStrength: "かなり強い負の相関がある",
        hint: "スマホ時間を横軸にしたとき、右肩下がり（負の相関）になる項目を探してみよう。",
        causationNote: "【分析結果】「スマホ時間」と「成績」には負の相関が見つかりました（また、勉強時間も減少傾向にあります）。スマホの長時間利用が睡眠や学習時間を圧迫し、成績低下の一因となっている可能性が高いです。"
    },
    {
        id: 3,
        text: "【調査依頼：ゲーム開発部】「重装備のキャラの動きが遅い気がする。装備の重さが影響しているか調べて！」",
        datasetId: "rpg_game",
        initialX: "equip_weight",
        initialY: "hp",
        targetKey: "equip_weight",
        validAnswers: ["speed"],
        explicitObjective: "「装備重量」と「負の相関」がある項目を探してください。",
        expectedStrength: "負の相関がある", 
        hint: "重たい鎧を着込むほど、数値が下がってしまうステータスはどれ？",
        causationNote: "【分析結果】「装備重量」と「素早さ」に負の相関を確認しました。重い装備は防御力を上げる一方で、スピードを犠牲にするトレードオフの関係にあることがデータから読み取れます。"
    },
    {
        id: 4,
        text: "【調査依頼：コンビニ店長】「夏本番！ 暑くなると飛ぶように売れる飲み物があるらしい。来客数との関係から突き止めて！」",
        datasetId: "convenience",
        initialX: "temperature",
        initialY: "customers",
        targetKey: "temperature",
        validAnswers: ["cold_drink_sales"], 
        explicitObjective: "「最高気温」と「強い正の相関」がある項目を探してください。",
        expectedStrength: "かなり強い正の相関がある",
        hint: "気温が上がると、みんなが飲みたくなる冷たいものは何だろう？",
        causationNote: "【分析結果】「気温」と「清涼飲料水」に強い正の相関があります。暑い日ほど脱水予防やリフレッシュのために購入者が増えるため、発注量を増やす必要があります。"
    },
    {
        id: 5,
        text: "【調査依頼：新人アルバイト】「アイスが売れる日は、他の飲み物も売れてる気がします！ これってアイスのおかげですか！？」",
        datasetId: "convenience",
        initialX: "icecream_sales",
        initialY: "customers",
        targetKey: "icecream_sales",
        validAnswers: ["cold_drink_sales"], 
        explicitObjective: "「アイス売上」と「正の相関」がある（疑似相関）項目を探してください。",
        expectedStrength: "かなり強い正の相関がある",
        hint: "相関は強いけど、これは「疑似相関」の可能性が高いよ。アイスとよく似た売れ方をする飲み物は？",
        causationNote: "【分析結果】正解！ただし注意が必要です。これは「アイスを買うから飲み物を買う」のではなく、「暑いからどちらも売れる」という【疑似相関】です。原因を見誤らないようにしましょう！"
    },
    {
        id: 6,
        text: "【調査依頼：プレイヤー】「レベル上げ頑張ったのにステータスが上がってない気がする…。レベルと一番関係あるステータスって何？」",
        datasetId: "rpg_game",
        initialX: "level",
        initialY: "luck",
        targetKey: "level",
        validAnswers: ["attack"], 
        explicitObjective: "「レベル」と「強い正の相関」がある項目を探してください。",
        expectedStrength: "かなり強い正の相関がある",
        hint: "レベルアップで確実に成長するように設定されている、基本ステータス（体力や力）を見てみよう。",
        causationNote: "【分析結果】「レベル」は「攻撃力」と非常に強い正の相関があります。このゲームでは、レベルを上げれば力は確実に向上するように設計されていることが証明されました。"
    },
    {
        id: 7,
        text: "【調査依頼：エリアマネージャー】「雨の日に特有の売上傾向があるか知りたい。雨量と連動して最も売れる商品は何か？」",
        datasetId: "convenience",
        initialX: "rain",
        initialY: "icecream_sales",
        targetKey: "rain",
        validAnswers: ["umbrella_sales"],
        explicitObjective: "「降水量」と「正の相関」がある項目を探してください。",
        expectedStrength: "正の相関がある",
        hint: "雨が降れば降るほど、必要に迫られて売れるものといえば？",
        causationNote: "【分析結果】「降水量」と「傘の売上」に正の相関があります。雨が強くなるほど、傘を持っていない人が緊急で購入するケースが増えるという、わかりやすい直接的な因果関係です。"
    },
    {
        id: 8,
        text: "【追加調査依頼：マネージャー】「雨の日には傘以外にも売れるものがあるらしい。傘以外で、雨量と関係がある商品を探してくれ」",
        datasetId: "convenience",
        initialX: "rain",
        initialY: "umbrella_sales",
        targetKey: "rain",
        validAnswers: ["hot_coffee_sales"],
        explicitObjective: "「降水量」と「正の相関」がある、傘以外の商品を探してください。",
        expectedStrength: "正の相関がある",
        hint: "雨が降ると気温はどうなる？寒くなると飲みたくなるものは？",
        causationNote: "【分析結果】素晴らしい！「ホットコーヒー」も雨量と正の相関があります。「雨が降る→気温が下がる→温かいものが売れる」という、間に気温を挟んだ間接的な因果関係（風が吹けば桶屋が儲かる的な関係）が見えましたね。"
    },
    {
        id: 9,
        text: "【調査依頼：統計の先生】「最後は難問だ。『全く関係がない』ことを証明するのも重要だ。テストの点数と関係ない項目を見つけてくれ」",
        datasetId: "students",
        initialX: "score",
        initialY: "study_time",
        targetKey: "score",
        validAnswers: ["height", "commute_time"],
        explicitObjective: "「テスト点数」と「相関がない」項目を探してください。",
        expectedStrength: "ほとんど相関がない",
        hint: "背の高さや、家から学校までの距離で、テストの点数は決まるかな？",
        causationNote: "【分析結果】正解です！「身長」や「通学時間」は、グラフ全体に点がバラバラに散らばっており、相関が見られません。これを【無相関】と呼び、「関係がないこと」の証明になります。"
    }
];
