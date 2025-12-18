
import { DATASETS } from './datasets.js';

export { DATASETS };

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
