
import React, { useState, useEffect, useMemo } from 'react';
import htm from 'htm';
import { 
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, Line, Cell 
} from 'recharts';

const html = htm.bind(React.createElement);

/**
 * ユーティリティ: 相関係数を指定してそれっぽいデータを生成する
 */
const generateCorrelatedData = (targetR, n = 50) => {
    const data = [];
    for (let i = 0; i < n; i++) {
        const x = Math.random() * 100;
        // r = 1 のときノイズ0, r = 0 のときノイズ最大
        // 簡易的な生成ロジック
        const error = (Math.random() - 0.5) * 100 * (1 - Math.abs(targetR)) * 2;
        let y = 50 + (x - 50) * targetR + error;
        
        // 範囲制限
        y = Math.max(0, Math.min(100, y));
        data.push({ x, y });
    }
    return data;
};

/**
 * コンポーネント: 穴埋め箇所
 */
const WorksheetBlank = ({ answer, width = "120px" }) => {
    const [revealed, setRevealed] = useState(false);
    return html`
        <span 
            class="inline-flex items-center justify-center border-b-2 border-gray-800 px-2 mx-1 font-bold text-indigo-700 bg-indigo-50/50 cursor-pointer hover:bg-indigo-100 transition-all select-none print:text-black print:border-none print:bg-transparent"
            style=${{ minWidth: width, minHeight: '1.5em', verticalAlign: 'bottom' }}
            onClick=${(e) => { e.stopPropagation(); setRevealed(!revealed); }}
            title="クリックして答えを表示/非表示"
        >
            ${revealed ? answer : html`<span class="text-indigo-300 text-xs font-normal">（クリック）</span>`}
        </span>
    `;
};

/**
 * コンポーネント: インタラクティブ相関シミュレーター
 */
const CorrelationSimulator = () => {
    const [r, setR] = useState(0.7);
    const [data, setData] = useState([]);

    useEffect(() => {
        setData(generateCorrelatedData(r));
    }, [r]);

    return html`
        <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm my-4">
            <div class="text-sm font-bold text-gray-500 mb-2 text-center">実際に動かして確かめよう！</div>
            <div class="h-48 w-full mb-4 bg-gray-50 rounded-lg overflow-hidden">
                <${ResponsiveContainer} width="100%" height="100%">
                    <${ScatterChart} margin=${{ top: 10, right: 10, bottom: 10, left: 10 }}>
                        <${CartesianGrid} strokeDasharray="3 3" />
                        <${XAxis} type="number" dataKey="x" domain=${[0, 100]} hide />
                        <${YAxis} type="number" dataKey="y" domain=${[0, 100]} hide />
                        <${Scatter} data=${data} fill="#6366f1">
                             ${data.map((entry, index) => html`<${Cell} key=${index} fill="#6366f1" />`)}
                        </${Scatter}>
                    </${ScatterChart}>
                </${ResponsiveContainer}>
            </div>
            <div class="flex items-center gap-4 px-4">
                <span class="font-bold text-gray-500 w-12 text-right">-1.0</span>
                <input 
                    type="range" 
                    min="-1" 
                    max="1" 
                    step="0.1" 
                    value=${r} 
                    onInput=${(e) => setR(parseFloat(e.target.value))}
                    class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <span class="font-bold text-gray-500 w-12">-1.0</span>
            </div>
            <div class="text-center mt-2">
                <span class="text-sm text-gray-500 font-bold mr-2">現在の相関係数:</span>
                <span class="text-2xl font-mono font-black text-indigo-600">${r.toFixed(1)}</span>
            </div>
        </div>
    `;
};

/**
 * メイン: デジタルワークシートモード
 */
export const LectureMode = ({ onExit }) => {
    return html`
        <div class="h-full flex flex-col bg-slate-50 dark:bg-slate-900 overflow-hidden">
            <!-- Header -->
            <div class="bg-white dark:bg-slate-800 p-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center shadow-sm z-10 shrink-0">
                <div class="flex items-center gap-3">
                    <div class="bg-indigo-600 text-white px-3 py-1 rounded-full font-bold text-sm shadow-sm">
                        <span class="mr-1">📝</span> 授業プリント
                    </div>
                    <h1 class="font-black text-lg text-gray-800 dark:text-white hidden md:block">23 データの活用：相関と回帰分析</h1>
                </div>
                <button 
                    onClick=${onExit} 
                    class="group flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-white rounded-lg font-bold text-sm transition-all"
                >
                    <span>閉じる</span>
                    <span class="bg-gray-300 dark:bg-slate-500 rounded px-1.5 text-xs group-hover:bg-gray-400">ESC</span>
                </button>
            </div>

            <!-- Scrollable Content -->
            <div class="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                <div class="max-w-4xl mx-auto bg-white min-h-screen shadow-xl rounded-xl p-8 md:p-12 text-gray-800 relative overflow-hidden print:shadow-none print:p-0">
                    
                    <!-- Paper texture effect -->
                    <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                    <!-- Title Section -->
                    <div class="border-b-4 border-gray-800 pb-6 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <div class="text-sm font-bold text-gray-500 mb-2">情報I next p.142～ / 最新情報I p.134～</div>
                            <h2 class="text-4xl font-black text-gray-900 tracking-tight">3. 相関と回帰分析</h2>
                        </div>
                        <div class="text-right bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div class="text-lg border-b border-gray-400 px-2 mb-2 w-full text-left font-mono">　年　　組　　番</div>
                            <div class="text-lg border-b border-gray-400 px-2 w-full text-left font-mono">氏名：　　　　　　</div>
                        </div>
                    </div>

                    <!-- Objectives -->
                    <div class="mb-12 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                        <h3 class="font-black text-lg mb-3 flex items-center gap-2 text-blue-800">
                            <span class="text-2xl">🎯</span> 本時の目標
                        </h3>
                        <p class="font-bold text-gray-700 pl-2 border-l-4 border-blue-500">
                            相関関係と回帰分析について理解し、データを分析する。
                        </p>
                    </div>

                    <!-- Section 1: Scatter Plot -->
                    <div class="mb-16">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</div>
                            <h3 class="font-bold text-2xl text-gray-800 border-b-2 border-gray-200 flex-1 pb-2">２つのデータの関係を調べてみよう</h3>
                        </div>

                        <div class="pl-4 md:pl-11 space-y-6">
                            <div class="bg-gray-100 p-4 rounded-lg text-sm font-bold text-gray-600">
                                例）「勉強を頑張るほど、テストの点数は上がるか」「気温が上がると、アイスの売上は増えるか」
                            </div>

                            <div class="leading-loose text-lg">
                                ・（ <${WorksheetBlank} answer="散布図" /> ）：上記のような2つのデータの関係を、「点」を使って視覚的に表したグラフ。
                            </div>

                            <div class="flex flex-col md:flex-row gap-8 items-center bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div class="flex-1">
                                    <p class="mb-4 leading-relaxed font-bold text-gray-600">
                                        データをグラフにすることで、数字の列だけでは気づけない<br/>
                                        <span class="text-indigo-600 text-xl">「傾向」「つながり」</span>が見えてくる。
                                    </p>
                                    <div class="text-xs text-gray-400">※右の図は勉強時間と成績の例</div>
                                </div>
                                <div class="w-64 h-48 bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                                    <${ResponsiveContainer} width="100%" height="100%">
                                        <${ScatterChart} margin=${{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                            <${XAxis} type="number" dataKey="x" hide />
                                            <${YAxis} type="number" dataKey="y" hide />
                                            <${Scatter} data=${generateCorrelatedData(0.8)} fill="#3b82f6" />
                                        </${ScatterChart}>
                                    </${ResponsiveContainer}>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Section 2: Correlation -->
                    <div class="mb-16">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">2</div>
                            <h3 class="font-bold text-2xl text-gray-800 border-b-2 border-gray-200 flex-1 pb-2">相関関係とその種類</h3>
                        </div>

                        <div class="pl-4 md:pl-11 space-y-8">
                            <div class="leading-loose text-lg">
                                ・（ <${WorksheetBlank} answer="相関関係" /> ）：どちらか増え（減）れば、もう一方も増える（減る）関係。
                            </div>

                            <!-- 3 Types Cards -->
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div class="bg-red-50 p-4 rounded-xl border-2 border-red-100 text-center hover:-translate-y-1 transition-transform">
                                    <div class="h-24 mb-2"><${ResponsiveContainer}><${ScatterChart}><${Scatter} data=${generateCorrelatedData(0.8)} fill="#ef4444" /></${ScatterChart}></${ResponsiveContainer}></div>
                                    <div class="font-bold text-gray-700 text-sm mb-2">右上がりの並び</div>
                                    <div class="text-sm mb-2">一方が増えると<br/>もう一方も<br/><${WorksheetBlank} answer="増える" width="80px" />傾向</div>
                                    <div class="font-black text-xl text-red-500 bg-white py-1 rounded-lg shadow-sm">正の相関</div>
                                </div>
                                <div class="bg-blue-50 p-4 rounded-xl border-2 border-blue-100 text-center hover:-translate-y-1 transition-transform">
                                    <div class="h-24 mb-2"><${ResponsiveContainer}><${ScatterChart}><${Scatter} data=${generateCorrelatedData(-0.8)} fill="#3b82f6" /></${ScatterChart}></${ResponsiveContainer}></div>
                                    <div class="font-bold text-gray-700 text-sm mb-2">右下がりの並び</div>
                                    <div class="text-sm mb-2">一方が増えると<br/>もう一方は<br/><${WorksheetBlank} answer="減る" width="80px" />傾向</div>
                                    <div class="font-black text-xl text-blue-500 bg-white py-1 rounded-lg shadow-sm">負の相関</div>
                                </div>
                                <div class="bg-gray-50 p-4 rounded-xl border-2 border-gray-200 text-center hover:-translate-y-1 transition-transform">
                                    <div class="h-24 mb-2"><${ResponsiveContainer}><${ScatterChart}><${Scatter} data=${generateCorrelatedData(0)} fill="#9ca3af" /></${ScatterChart}></${ResponsiveContainer}></div>
                                    <div class="font-bold text-gray-700 text-sm mb-2">バラバラ</div>
                                    <div class="text-sm mb-2">お互いに関係なく<br/>増減する<br/><span class="opacity-0">.</span></div>
                                    <div class="font-black text-xl text-gray-500 bg-white py-1 rounded-lg shadow-sm">相関なし</div>
                                </div>
                            </div>

                            <!-- Correlation Coefficient -->
                            <div class="mt-8">
                                <div class="leading-loose text-lg mb-4">
                                    ・（ <${WorksheetBlank} answer="相関係数" /> ）：相関（関係）の強さの強弱を判断する指標。
                                    <div class="text-base text-gray-600 mt-1 pl-4 border-l-2 border-gray-300">
                                        散布図の「点の集まり具合」を数字にしたもの。この数字は必ず <span class="font-bold font-mono text-xl mx-1 bg-yellow-100 px-1">-1.0 ～ 1.0</span> の間に収まる。
                                    </div>
                                </div>

                                <!-- Coefficient Scale -->
                                <div class="relative h-20 bg-gray-100 rounded-xl border border-gray-300 flex items-center px-4 overflow-hidden mb-6">
                                    <div class="absolute inset-x-4 top-1/2 h-2 bg-gradient-to-r from-blue-500 via-gray-300 to-red-500 rounded-full"></div>
                                    <div class="w-full flex justify-between text-xs font-bold relative z-10 pt-4">
                                        <div class="text-center group"><div class="text-lg text-blue-600 font-mono">-0.9</div><div class="bg-white/80 px-1 rounded">強い負</div></div>
                                        <div class="text-center group"><div class="text-lg text-blue-400 font-mono">-0.5</div><div class="bg-white/80 px-1 rounded">負</div></div>
                                        <div class="text-center group"><div class="text-lg text-gray-500 font-mono">0</div><div class="bg-white/80 px-1 rounded">なし</div></div>
                                        <div class="text-center group"><div class="text-lg text-red-400 font-mono">0.5</div><div class="bg-white/80 px-1 rounded">正</div></div>
                                        <div class="text-center group"><div class="text-lg text-red-600 font-mono">0.9</div><div class="bg-white/80 px-1 rounded">強い正</div></div>
                                    </div>
                                </div>

                                <!-- Interactive Simulator -->
                                <${CorrelationSimulator} />
                            </div>
                        </div>
                    </div>

                    <!-- Section 3: Regression Analysis -->
                    <div class="mb-16">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">3</div>
                            <h3 class="font-bold text-2xl text-gray-800 border-b-2 border-gray-200 flex-1 pb-2">未来を予測する分析</h3>
                        </div>

                        <div class="pl-4 md:pl-11 space-y-6">
                            <div class="leading-loose text-lg">
                                ・（ <${WorksheetBlank} answer="回帰分析" /> ）：データ１（ｘ軸）とデータ２（ｙ軸）に相関があるとき、その関係を式で表すこと。
                                <br/><span class="text-base text-gray-600">※ この式を使うことで、データがない部分（未来の数値など）を予測できるようになる。</span>
                            </div>

                            <div class="leading-loose text-lg">
                                ・（ <${WorksheetBlank} answer="回帰直線" /> ）：データの中心を通る線。
                            </div>

                            <div class="bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-200 relative overflow-hidden">
                                <div class="absolute -right-4 -top-4 text-9xl text-yellow-100 rotate-12 select-none">📉</div>
                                <div class="relative z-10">
                                    <span class="font-black text-xl text-yellow-800 border-b-2 border-yellow-300 inline-block mb-4">● <${WorksheetBlank} answer="単回帰分析" /></span>
                                    <div class="flex flex-col md:flex-row items-center gap-8">
                                        <div class="flex-1">
                                            <p class="mb-4 font-bold text-gray-700">１つのデータを使って、もう１つのデータを予測するシンプルな分析。</p>
                                            <div class="bg-white p-4 rounded-xl shadow-sm text-center border border-yellow-100">
                                                <div class="text-sm text-gray-500 font-bold mb-1">直線の式（一次関数）</div>
                                                <div class="text-3xl font-mono font-black text-indigo-600">y = ax + b</div>
                                            </div>
                                        </div>
                                        <div class="w-48 h-32 bg-white rounded-lg border border-yellow-200 p-2">
                                            <${ResponsiveContainer}><${ScatterChart}><${Scatter} data=${generateCorrelatedData(0.9)} fill="#eab308" /><${Line} type="monotone" dataKey="y" data=${[{x:0,y:5},{x:100,y:95}]} stroke="#fbbf24" strokeWidth=${3} dot=${false} /></${ScatterChart}></${ResponsiveContainer}>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Section 4: Causation vs Correlation -->
                    <div class="mb-16">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">4</div>
                            <h3 class="font-bold text-2xl text-gray-800 border-b-2 border-gray-200 flex-1 pb-2">因果関係と疑似相関（注意点）</h3>
                        </div>

                        <div class="pl-4 md:pl-11 space-y-8">
                            <div class="leading-loose text-lg">
                                ・（ <${WorksheetBlank} answer="因果関係" /> ）：「Aが原因でBが起きた」という関係。
                                <div class="pl-4 text-red-600 font-bold text-base mt-2 bg-red-50 p-2 rounded inline-block">
                                    ⚠️ （ <${WorksheetBlank} answer="相関" width="80px" /> ）があっても因果があるとは限らない。
                                </div>
                            </div>
                            
                            <!-- Spurious Correlation Diagram -->
                            <div class="bg-white border-4 border-gray-100 rounded-3xl p-6 shadow-sm">
                                <div class="font-bold text-gray-700 mb-6 text-center text-lg">例）アイスの売上が多い日は、海難事故が多かった。（正の相関があった）</div>
                                
                                <div class="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
                                    <div class="text-center group">
                                        <div class="text-5xl mb-2 group-hover:scale-110 transition-transform">🍦</div>
                                        <div class="font-bold text-gray-600">アイスの売上</div>
                                    </div>
                                    <div class="text-3xl text-gray-300 font-black">⇔</div>
                                    <div class="text-center group">
                                        <div class="text-5xl mb-2 group-hover:scale-110 transition-transform">🌊</div>
                                        <div class="font-bold text-gray-600">海難事故</div>
                                    </div>
                                </div>

                                <div class="text-center font-bold text-red-500 mb-8 bg-red-50 p-3 rounded-full mx-auto max-w-lg">
                                    ❌ アイスには海での事故を引き起こす成分があるのか？
                                </div>

                                <div class="bg-gray-50 p-8 rounded-2xl relative border-2 border-dashed border-gray-300">
                                    <div class="text-center font-bold mb-8 text-lg text-indigo-800">本当の理由：<${WorksheetBlank} answer="疑似相関" /></div>
                                    
                                    <div class="flex justify-center mb-12 relative z-10">
                                        <div class="text-center bg-white p-4 rounded-xl shadow-md border border-yellow-200">
                                            <div class="text-6xl animate-pulse-slow">☀️</div>
                                            <div class="font-black text-xl text-yellow-600 mt-2">
                                                <${WorksheetBlank} answer="交絡因子" />
                                            </div>
                                            <div class="text-sm font-bold text-gray-500">(今回の場合は気温)</div>
                                        </div>
                                    </div>

                                    <!-- Arrows SVG -->
                                    <svg class="absolute inset-0 w-full h-full pointer-events-none z-0">
                                        <defs>
                                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                                                <polygon points="0 0, 10 3.5, 0 7" fill="#9ca3af" />
                                            </marker>
                                        </defs>
                                        <!-- Left Arrow -->
                                        <path d="M 50% 40% Q 30% 60% 20% 85%" stroke="#9ca3af" stroke-width="3" fill="none" marker-end="url(#arrowhead)" />
                                        <!-- Right Arrow -->
                                        <path d="M 50% 40% Q 70% 60% 80% 85%" stroke="#9ca3af" stroke-width="3" fill="none" marker-end="url(#arrowhead)" />
                                    </svg>

                                    <div class="flex justify-between px-4 md:px-20 relative z-10">
                                        <div class="text-sm font-bold text-center bg-white/80 p-2 rounded w-32 shadow-sm text-gray-600">暑いから<br/>アイスが売れる</div>
                                        <div class="text-sm font-bold text-center bg-white/80 p-2 rounded w-32 shadow-sm text-gray-600">暑いから<br/>海に行く人が増える</div>
                                    </div>
                                </div>

                                <div class="mt-6 text-base font-medium text-gray-700 bg-gray-50 p-4 rounded-xl">
                                    <span class="font-black text-indigo-600">● <${WorksheetBlank} answer="疑似相関" /></span> ：本当は無関係なのに、別の隠れた要因（交絡因子）の影響であたかも関係があるように見えてしまう現象。
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Reflection -->
                    <div class="mt-20 pt-10 border-t-4 border-gray-100">
                        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            <h3 class="font-black text-xl flex items-center gap-2">
                                <span class="text-2xl">📝</span> 学習の振り返り
                            </h3>
                            <div class="text-sm font-bold text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
                                目標に対する達成度：
                                <span class="inline-block border-b border-gray-400 mx-1 w-8"></span>
                                <span class="text-xs font-normal text-gray-400">（よくできた / できた / ある程度 / できなかった）</span>
                            </div>
                        </div>
                        <div class="w-full h-40 border-2 border-gray-200 rounded-xl p-4 bg-white shadow-inner text-gray-400 text-sm font-bold">
                            （このプリントを通して学んだことを要約してまとめよう）
                        </div>
                    </div>

                </div>
                
                <div class="max-w-4xl mx-auto mt-12 mb-8 text-center print:hidden">
                    <p class="text-gray-500 font-bold mb-4 animate-bounce">解説をマスターしたら、次は実践！</p>
                    <button onClick=${onExit} class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-full font-black text-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                        メニューに戻る
                    </button>
                </div>
            </div>
        </div>
    `;
};
