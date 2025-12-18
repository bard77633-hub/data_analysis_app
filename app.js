
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import htm from 'htm';
import { 
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, Line, ComposedChart, Label, Cell 
} from 'recharts';
import { DATASETS, DRILL_QUESTS } from './utils/data.js';
import * as MathUtils from './utils/math.js';

const html = htm.bind(React.createElement);

// Extra Mission Configuration
const EXTRA_MISSION_STAGES = [
    { datasetId: "extra_cleaning_1", xKey: "study_time", yKey: "score", targetR: 0.95 },
    { datasetId: "extra_cleaning_2", xKey: "temperature", yKey: "cold_drink_sales", targetR: 0.90 },
    { datasetId: "extra_cleaning_3", xKey: "level", yKey: "hp", targetR: 0.98 }
];

// --- Custom Hooks ---

const useDraggableWindow = (initialX, initialY) => {
    const getSafePosition = (x, y) => {
        const maxX = window.innerWidth - 50;
        const maxY = window.innerHeight - 50;
        return {
            x: Math.min(Math.max(0, x), maxX),
            y: Math.min(Math.max(0, y), maxY)
        };
    };
    const [position, setPosition] = useState(getSafePosition(initialX, initialY));
    const isDragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const onPointerDown = (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.tagName === 'INPUT') return;
        e.preventDefault();
        isDragging.current = true;
        dragOffset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
        e.currentTarget.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e) => {
        if (!isDragging.current) return;
        e.preventDefault();
        setPosition({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
    };
    const onPointerUp = (e) => {
        if (isDragging.current) {
            isDragging.current = false;
            e.currentTarget.releasePointerCapture(e.pointerId);
        }
    };
    return { position, setPosition, onPointerDown, onPointerMove, onPointerUp };
};

// --- Components ---

const Card = ({ title, children, className = "" }) => html`
    <div class="bg-white rounded-lg shadow-md overflow-hidden flex flex-col border border-gray-100 ${className}">
        ${title && html`<div class="px-4 py-3 bg-gray-50 border-b border-gray-100 font-bold text-gray-700">${title}</div>`}
        <div class="p-4 flex-1 overflow-auto flex flex-col">
            ${children}
        </div>
    </div>
`;

/**
 * 解説モードコンポーネント
 * 視認性を重視しつつ、デザインの太さや丸みは標準的に戻す
 */
const TutorialMode = ({ onFinish }) => {
    const [step, setStep] = useState(0);
    const demoData = [{ id: 1, temp: 25, sales: 150 }, { id: 2, temp: 30, sales: 280 }, { id: 3, temp: 35, sales: 400 }];
    const [plotStep, setPlotStep] = useState(0);

    const pages = [
        {
            title: "散布図（さんぷず）ってなに？",
            content: html`
                <div class="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-10 animate-fade-in-up py-8">
                    <div class="text-9xl animate-bounce-slow">📊</div>
                    <div class="space-y-6 max-w-4xl">
                        <p class="text-2xl md:text-3xl lg:text-4xl text-gray-700 leading-relaxed">
                            「気温が上がると、アイスが売れる」<br/>
                            「勉強時間を増やすと、テストの点数が上がる」
                        </p>
                        <p class="text-3xl md:text-4xl lg:text-5xl text-gray-800 font-black">
                            <span class="text-indigo-600 border-b-4 border-indigo-200">2つのデータの関係</span>を<br/>
                            視覚的に調べるためのグラフです。
                        </p>
                    </div>
                </div>
            `
        },
        {
            title: "ステップ1：グラフの作り方",
            content: html`
                <div class="flex flex-col lg:flex-row gap-10 min-h-[60vh] items-center justify-center animate-fade-in-up py-6">
                    <div class="w-full lg:w-1/3 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h4 class="font-bold text-xl text-center mb-4 text-indigo-600">データの表</h4>
                        <table class="w-full text-lg">
                            <thead class="bg-indigo-50">
                                <tr><th class="p-3">気温(℃)</th><th class="p-3">売上(個)</th></tr>
                            </thead>
                            <tbody class="divide-y">
                                ${demoData.map((d, i) => html`
                                    <tr class="transition-all duration-300 ${plotStep > i ? 'bg-indigo-50' : ''}">
                                        <td class="p-4 text-center font-mono font-bold">${d.temp}℃</td>
                                        <td class="p-4 text-center font-mono font-bold text-green-600">${d.sales}個</td>
                                    </tr>
                                `)}
                            </tbody>
                        </table>
                        <div class="mt-6 flex flex-col gap-3">
                            <button onClick=${() => setPlotStep(prev => Math.min(prev + 1, 3))}
                                class="px-6 py-4 bg-indigo-600 text-white rounded-xl text-lg font-bold hover:bg-indigo-700 shadow-md active:scale-95 transition-all">
                                点を1つずつ打つ ➡
                            </button>
                            <button onClick=${() => setPlotStep(0)} class="text-gray-400 font-bold hover:text-gray-600 text-sm">リセット</button>
                        </div>
                    </div>
                    <div class="w-full lg:w-3/5 aspect-video bg-white rounded-xl shadow-lg border border-gray-200 relative p-8">
                        <svg viewBox="0 0 400 300" class="w-full h-full overflow-visible">
                            <line x1="50" y1="250" x2="380" y2="250" stroke="#333" stroke-width="2" marker-end="url(#arrow)" />
                            <line x1="50" y1="250" x2="50" y2="20" stroke="#333" stroke-width="2" marker-end="url(#arrow)" />
                            <text x="380" y="275" text-anchor="end" font-size="14" fill="#3b82f6" font-weight="bold">気温 (X軸)</text>
                            <text x="40" y="20" text-anchor="end" font-size="14" fill="#10b981" font-weight="bold">売上</text>
                            ${demoData.map((d, i) => {
                                const x = 50 + ((d.temp - 20) / 20) * 300;
                                const y = 250 - (d.sales / 500) * 230;
                                return plotStep > i && html`
                                    <g key=${i}>
                                        <line x1="${x}" y1="250" x2="${x}" y2="${y}" stroke="#3b82f6" stroke-dasharray="4" class="animate-grow-y" />
                                        <line x1="50" y1="${y}" x2="${x}" y2="${y}" stroke="#10b981" stroke-dasharray="4" class="animate-grow-x" />
                                        <circle cx="${x}" cy="${y}" r="7" fill="#6366f1" stroke="white" stroke-width="2" class="animate-pop-point" />
                                    </g>
                                `;
                            })}
                        </svg>
                    </div>
                </div>
            `
        },
        {
            title: "ステップ2：相関の3つのパターン",
            content: html`
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 min-h-[50vh] items-stretch animate-fade-in-up py-8">
                    <div class="bg-red-50 p-8 rounded-2xl border border-red-100 text-center flex flex-col justify-between shadow-sm">
                        <div class="text-6xl mb-4">↗️</div>
                        <h4 class="font-black text-2xl text-red-700 mb-2">正の相関</h4>
                        <p class="text-lg text-gray-700 font-bold">右上がり</p>
                        <p class="text-base text-gray-500 mt-2 leading-relaxed">一方が増えると、もう一方も増える傾向。</p>
                        <p class="mt-4 bg-white py-2 rounded-lg font-bold text-red-600 shadow-sm text-sm">例：勉強と成績</p>
                    </div>
                    <div class="bg-green-50 p-8 rounded-2xl border border-green-100 text-center flex flex-col justify-between shadow-sm">
                        <div class="text-6xl mb-4">↘️</div>
                        <h4 class="font-black text-2xl text-green-700 mb-2">負の相関</h4>
                        <p class="text-lg text-gray-700 font-bold">右下がり</p>
                        <p class="text-base text-gray-500 mt-2 leading-relaxed">一方が増えると、もう一方は減る傾向。</p>
                        <p class="mt-4 bg-white py-2 rounded-lg font-bold text-green-600 shadow-sm text-sm">例：スマホと成績</p>
                    </div>
                    <div class="bg-gray-50 p-8 rounded-2xl border border-gray-200 text-center flex flex-col justify-between shadow-sm">
                        <div class="text-6xl mb-4">∴</div>
                        <h4 class="font-black text-2xl text-gray-700 mb-2">相関なし</h4>
                        <p class="text-lg text-gray-700 font-bold">バラバラ</p>
                        <p class="text-base text-gray-500 mt-2 leading-relaxed">特に関連性が認められない状態。</p>
                        <p class="mt-4 bg-white py-2 rounded-lg font-bold text-gray-600 shadow-sm text-sm">例：身長と成績</p>
                    </div>
                </div>
            `
        },
        {
            title: "ステップ3：だまされないで！「疑似相関」",
            content: html`
                <div class="flex flex-col items-center justify-center min-h-[60vh] space-y-10 animate-fade-in-up py-8">
                    <div class="bg-yellow-50 border-2 border-yellow-200 text-black p-8 rounded-2xl shadow-md max-w-4xl w-full text-center">
                        <h3 class="text-3xl lg:text-4xl font-black mb-4 flex items-center justify-center">
                            ⚠️ 相関 ≠ 因果
                        </h3>
                        <p class="text-xl lg:text-2xl leading-relaxed font-bold">
                            関係があるからといって、<br/>
                            「一方が原因でもう一方が起きた」とは限らない！
                        </p>
                    </div>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full max-w-6xl">
                        <div class="bg-white p-8 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center">
                            <div class="text-sm font-black text-red-500 mb-6 uppercase tracking-widest">誤った解釈</div>
                            <div class="flex items-center gap-6">
                                <div class="text-center"><div class="text-6xl mb-2">🍦</div><div class="font-bold text-sm">アイス売上</div></div>
                                <div class="text-3xl text-red-400 font-black">➡ ?</div>
                                <div class="text-center"><div class="text-6xl mb-2">🏊</div><div class="font-bold text-sm">水難事故</div></div>
                            </div>
                            <p class="mt-8 text-lg font-bold text-red-600 bg-red-50 p-4 rounded-xl text-center">
                                「アイスを食べると事故が増える」<br/>…わけではありません！
                            </p>
                        </div>
                        <div class="bg-white p-8 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center relative">
                            <div class="text-sm font-black text-indigo-500 mb-6 uppercase tracking-widest">正しい解釈</div>
                            <div class="flex flex-col items-center">
                                <div class="text-center mb-6"><div class="text-7xl mb-1 animate-bounce-slow">☀️</div><div class="text-lg font-bold bg-yellow-100 px-3 py-1 rounded-full">気温上昇</div></div>
                                <div class="flex gap-16">
                                    <div class="text-center"><div class="text-5xl mb-1">🍦</div><div class="font-bold text-xs">アイス増</div></div>
                                    <div class="text-center"><div class="text-5xl mb-1">🏊</div><div class="font-bold text-xs">水泳増</div></div>
                                </div>
                            </div>
                            <p class="mt-8 text-lg font-bold text-indigo-700 bg-indigo-50 p-4 rounded-xl text-center">
                                「暑い」という共通の原因があるだけ。<br/>これを<span class="text-2xl font-black">疑似相関</span>と呼びます！
                            </p>
                        </div>
                    </div>
                </div>
            `
        },
        {
            title: "ミッションスタート！",
            content: html`
                <div class="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-12 animate-fade-in-up py-10">
                    <div class="text-[10rem] animate-bounce-slow">🔎</div>
                    <div class="space-y-4">
                        <h2 class="text-4xl lg:text-6xl font-black text-gray-900 tracking-tighter">準備はいいですか？</h2>
                        <p class="text-xl lg:text-2xl text-gray-500 font-medium">データの裏に隠された真実を暴く、<br/>データ探偵の出番です！</p>
                    </div>
                    <button onClick=${onFinish} class="px-12 py-6 bg-indigo-600 text-white text-3xl font-black rounded-2xl shadow-xl hover:bg-indigo-700 transition-all active:scale-95">
                        ドリルを開始する 🚀
                    </button>
                </div>
            `
        }
    ];

    const current = pages[step];

    return html`
        <div class="flex-1 flex flex-col min-h-0 p-4 md:p-8 xl:max-w-6xl mx-auto w-full">
            <div class="bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col h-full overflow-hidden">
                <div class="bg-indigo-600 text-white px-8 py-5 flex justify-between items-center shrink-0">
                    <h2 class="text-2xl md:text-3xl font-bold flex items-center">
                        <span class="bg-white text-indigo-600 rounded-lg px-3 py-1 mr-4 text-xl font-black">${step + 1}</span>
                        ${current.title}
                    </h2>
                    <div class="text-lg font-bold opacity-70">${step + 1} / ${pages.length}</div>
                </div>
                <div class="flex-1 p-6 md:p-10 overflow-y-auto bg-gray-50/50">
                    ${current.content}
                </div>
                <div class="bg-white border-t border-gray-100 p-6 flex justify-between items-center shrink-0 px-8">
                    <button onClick=${() => setStep(Math.max(0, step - 1))} disabled=${step === 0}
                        class="px-6 py-2 rounded-lg font-bold text-lg text-gray-400 hover:text-gray-800 disabled:opacity-0 transition-all">
                        ← 戻る
                    </button>
                    <div class="flex space-x-2">
                        ${pages.map((_, i) => html`<div class="w-3 h-3 rounded-full transition-all ${i === step ? 'bg-indigo-600' : 'bg-gray-200'}"></div>`)}
                    </div>
                    <button onClick=${() => setStep(Math.min(pages.length - 1, step + 1))} disabled=${step === pages.length - 1}
                        class="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-md disabled:opacity-0 transition-all">
                        次へ →
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * エクストラミッション用のウィンドウ (標準的な太さに調整)
 */
const ExtraMissionWindow = ({ correlation, activeCount, stage, totalStages, targetR, onNext, onComplete }) => {
    const isMobile = window.innerWidth < 768;
    const initialPos = isMobile ? { x: 16, y: window.innerHeight - 300 } : { x: window.innerWidth - 380, y: 80 };
    const { position, onPointerDown, onPointerMove, onPointerUp } = useDraggableWindow(initialPos.x, initialPos.y);
    const [isMinimized, setIsMinimized] = useState(false);
    
    const isSuccess = correlation >= targetR;
    const isFinalStage = stage === totalStages - 1;

    return html`
        <div class="fixed z-[90] bg-white shadow-2xl rounded-xl overflow-hidden border-2 transition-all duration-300
                   ${isSuccess ? 'border-green-400 ring-4 ring-green-100' : 'border-red-500 ring-4 ring-red-100'}"
            style=${{ top: position.y, left: position.x, width: isMinimized ? '200px' : (isMobile ? 'calc(100vw - 32px)' : '350px'), touchAction: 'none' }}>
            <div class="px-4 py-2 bg-gray-900 text-white flex justify-between items-center cursor-grab active:cursor-grabbing select-none touch-none"
                onPointerDown=${onPointerDown} onPointerMove=${onPointerMove} onPointerUp=${onPointerUp}>
                <div class="flex items-center space-x-2">
                    <span class="text-xl">🛠️</span>
                    <span class="font-bold text-xs tracking-widest uppercase">Stage ${stage + 1} / ${totalStages}</span>
                </div>
                <button onClick=${() => setIsMinimized(!isMinimized)} class="p-1 hover:bg-white/20 rounded">
                    ${isMinimized ? '□' : '－'}
                </button>
            </div>
            ${!isMinimized && html`
                <div class="p-5 flex flex-col gap-4">
                    ${isSuccess ? html`
                         <div class="text-center space-y-3">
                            <div class="text-5xl animate-bounce-slow">✨</div>
                            <h3 class="text-xl font-bold text-green-600">修正完了！</h3>
                            <div class="p-3 bg-green-50 rounded-xl border border-green-200 text-center font-mono text-2xl text-green-800 font-black">
                                r = ${correlation.toFixed(3)}
                            </div>
                            <p class="text-xs text-gray-500 font-bold">目標の ${targetR.toFixed(2)} をクリアしました</p>
                            ${isFinalStage ? html`
                                <button onClick=${onComplete} class="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-all text-lg">
                                    探偵マスター！トップへ 🎓
                                </button>
                            ` : html`
                                <button onClick=${onNext} class="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all text-lg">
                                    次の事件へ ➡
                                </button>
                            `}
                        </div>
                    ` : html`
                        <div class="space-y-3">
                            <h3 class="font-bold text-red-700 text-lg border-b border-red-50 pb-1">⚠ データ異常発生！</h3>
                            <p class="text-sm text-gray-800 font-bold">
                                傾向から外れた<strong class="text-red-600">「点」をクリックして除外</strong>し、正しい相関を取り戻せ！
                            </p>
                            <div class="space-y-2 bg-gray-50 p-3 rounded-lg">
                                <div class="flex justify-between font-bold text-xs">
                                    <span>現在の r</span>
                                    <span class="${correlation < 0.5 ? 'text-red-500' : 'text-orange-500'}">${correlation.toFixed(3)}</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                                    <div class="bg-red-500 h-full transition-all duration-500 ease-out" style=${{ width: `${Math.max(0, correlation * 100)}%` }}></div>
                                    <div class="absolute top-0 bottom-0 border-r-2 border-dashed border-white" style=${{ left: `${targetR * 100}%` }}></div>
                                </div>
                                <div class="text-right text-[10px] font-bold text-gray-400">Target: ${targetR.toFixed(3)} 以上</div>
                            </div>
                        </div>
                    `}
                </div>
            `}
        </div>
    `;
}

/**
 * 散布図コンポーネント (標準視認性)
 */
const ScatterVis = ({ data, xConfig, yConfig, regression, excludedIds, onTogglePoint }) => {
    const domain = useMemo(() => {
        if (!data || data.length === 0) return { x: ['auto', 'auto'], y: ['auto', 'auto'] };
        const xValues = data.map(d => d[xConfig.key]);
        const yValues = data.map(d => d[yConfig.key]);
        const minX = Math.min(...xValues);
        const maxX = Math.max(...xValues);
        const minY = Math.min(...yValues);
        const maxY = Math.max(...yValues);
        const padX = (maxX - minX) * 0.1 || 1;
        const padY = (maxY - minY) * 0.1 || 1;
        return { x: [Math.floor(minX - padX), Math.ceil(maxX + padX)], y: [Math.floor(minY - padY), Math.ceil(maxY + padY)] };
    }, [data, xConfig, yConfig]);

    const lineData = useMemo(() => {
        const [minX, maxX] = domain.x;
        if (typeof minX !== 'number' || typeof maxX !== 'number') return [];
        return [
            { [xConfig.key]: minX, [yConfig.key]: MathUtils.predictY(minX, regression.slope, regression.intercept) },
            { [xConfig.key]: maxX, [yConfig.key]: MathUtils.predictY(maxX, regression.slope, regression.intercept) }
        ];
    }, [domain, xConfig, yConfig, regression]);

    return html`
        <${ResponsiveContainer} width="100%" height="100%">
            <${ComposedChart} margin=${{ top: 20, right: 30, bottom: 20, left: 20 }}>
                <${CartesianGrid} strokeDasharray="3 3" stroke="#eee" />
                <${XAxis} type="number" dataKey=${xConfig.key} name=${xConfig.label} domain=${domain.x}
                    label=${{ value: xConfig.label, position: 'bottom', offset: 0, fill: '#3b82f6', fontSize: 12 }} />
                <${YAxis} type="number" dataKey=${yConfig.key} name=${yConfig.label} domain=${domain.y}
                    label=${{ value: yConfig.label, angle: -90, position: 'insideLeft', fill: '#10b981', fontSize: 12 }} />
                <${Tooltip} cursor=${{ strokeDasharray: '3 3' }}
                    content=${({ active, payload }) => {
                        if (active && payload && payload.length) {
                            const d = payload[0].payload;
                            if (!d.id) return null;
                            const isExcluded = excludedIds.includes(d.id);
                            return html`
                                <div class="bg-white border border-gray-200 p-2 rounded shadow text-xs">
                                    <div class="font-bold mb-1 flex justify-between gap-4">
                                        <span>ID: ${d.id}</span>
                                        <span class="${isExcluded ? 'text-red-500' : 'text-green-600'}">
                                            ${isExcluded ? '除外中' : '使用中'}
                                        </span>
                                    </div>
                                    <p class="text-blue-600">${xConfig.label}: ${d[xConfig.key]}</p>
                                    <p class="text-green-600">${yConfig.label}: ${d[yConfig.key]}</p>
                                </div>
                            `;
                        }
                        return null;
                    }} />
                <${Scatter} name="Data" data=${data} onClick=${(d) => onTogglePoint(d.id)} cursor="pointer">
                    ${data.map((entry, index) => html`<${Cell} key=${`cell-${index}`} fill=${excludedIds.includes(entry.id) ? '#eee' : '#6366f1'} 
                        stroke=${excludedIds.includes(entry.id) ? '#ccc' : 'none'} />`)}
                </${Scatter}>
                <${Line} data=${lineData} dataKey=${yConfig.key} stroke="#f97316" strokeWidth=${2} dot=${false} activeDot=${false} isAnimationActive=${false} />
            </${ComposedChart}>
        </${ResponsiveContainer}>
    `;
};

// Analysis Panel
const AnalysisPanel = ({ xLabel, yLabel, correlation, regression, strength, activeCount, totalCount }) => html`
    <div class="space-y-6">
        <div>
            <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Correlation</h3>
            <div class="bg-blue-50/50 p-4 rounded-xl border border-blue-50">
                <div class="flex justify-between items-baseline mb-2">
                    <span class="text-gray-500 font-bold text-sm">相関係数 (r)</span>
                    <span class="text-2xl font-black text-blue-700">${correlation.toFixed(3)}</span>
                </div>
                <${CorrelationMeter} r=${correlation} />
                <div class="flex justify-between items-center mt-4">
                    <span class="text-[10px] text-gray-400">n=${activeCount}/${totalCount}</span>
                    <span class="px-2 py-1 text-xs font-bold rounded-lg 
                        ${strength.includes('かなり強い') ? 'bg-purple-100 text-purple-800' : 
                          strength.includes('正の') ? 'bg-red-100 text-red-800' :
                          strength.includes('負の') ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}">${strength}</span>
                </div>
            </div>
        </div>
        <div>
            <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Regression</h3>
            <div class="bg-green-50/50 p-4 rounded-xl border border-green-50">
                <div class="text-gray-500 font-bold text-sm mb-2">回帰式</div>
                <div class="text-sm font-mono font-bold text-center bg-white py-3 rounded-lg border border-green-100 text-green-800 shadow-inner">
                    y = ${regression.slope.toFixed(2)}x ${regression.intercept >= 0 ? '+' : '-'} ${Math.abs(regression.intercept).toFixed(2)}
                </div>
            </div>
        </div>
    </div>
`;

const CorrelationMeter = ({ r }) => {
    const percentage = ((r + 1) / 2) * 100;
    return html`
        <div class="mt-2">
            <div class="relative h-4 w-full rounded-full bg-gradient-to-r from-green-400 via-gray-200 to-red-400 shadow-inner overflow-hidden">
                <div class="absolute top-0 bottom-0 w-1 bg-black border border-white shadow transition-all duration-700 ease-out" style=${{ left: `${percentage}%`, transform: 'translateX(-50%)' }}></div>
            </div>
            <div class="flex justify-between text-[8px] font-bold text-gray-400 mt-1">
                <span>-1.0</span><span>0</span><span>1.0</span>
            </div>
        </div>
    `;
};

// Main App Component (React 19)
const App = () => {
    const [mode, setMode] = useState('explanation');
    const [availableDatasets, setAvailableDatasets] = useState(DATASETS);
    const [datasetId, setDatasetId] = useState(DATASETS[0].id);
    const [xKey, setXKey] = useState(DATASETS[0].columns[0].key);
    const [yKey, setYKey] = useState(DATASETS[0].columns[1].key);
    const [excludedIds, setExcludedIds] = useState([]);
    const [showDataWindow, setShowDataWindow] = useState(false);
    const [showInputModal, setShowInputModal] = useState(false);
    const [currentQuestIndex, setCurrentQuestIndex] = useState(0);
    const [drillFeedback, setDrillFeedback] = useState(null);
    const [showClearModal, setShowClearModal] = useState(false);
    const [hasCleared, setHasCleared] = useState(false);
    const [extraMissionLevel, setExtraMissionLevel] = useState(0);

    const dataset = useMemo(() => availableDatasets.find(d => d.id === datasetId) || availableDatasets[0], [datasetId, availableDatasets]);
    const xColumn = useMemo(() => dataset.columns.find(c => c.key === xKey) || dataset.columns[0], [dataset, xKey]);
    const yColumn = useMemo(() => dataset.columns.find(c => c.key === yKey) || dataset.columns[1], [dataset, yKey]);

    const stats = useMemo(() => {
        const activeData = dataset.data.filter(d => !excludedIds.includes(d.id));
        const xData = activeData.map(d => d[xColumn.key]);
        const yData = activeData.map(d => d[yColumn.key]);
        if (xData.length === 0) return { correlation: 0, regression: { slope: 0, intercept: 0 }, strength: "データなし", activeCount: 0, xStats: { min: 0, max: 0, mean: 0 }, yStats: { min: 0, max: 0, mean: 0 } };
        const r = MathUtils.calculateCorrelation(xData, yData);
        const reg = MathUtils.calculateRegression(xData, yData);
        const str = MathUtils.getCorrelationStrength(r);
        const calcStats = (arr) => ({ min: Math.min(...arr), max: Math.max(...arr), mean: MathUtils.calculateMean(arr) });
        return { correlation: r, regression: reg, strength: str, activeCount: xData.length, xStats: calcStats(xData), yStats: calcStats(yData) };
    }, [dataset, xColumn, yColumn, excludedIds]);

    useEffect(() => {
        if (mode === 'drill' && !hasCleared) {
            const quest = DRILL_QUESTS[currentQuestIndex];
            if (quest) { setDatasetId(quest.datasetId); setXKey(quest.initialX); setYKey(quest.initialY); }
            setDrillFeedback(null);
        }
    }, [currentQuestIndex, mode, hasCleared]);

    const togglePoint = (id) => setExcludedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    const handleSwapAxes = () => { const oldX = xKey; setXKey(yKey); setYKey(oldX); };

    const handleDrillSubmit = () => {
        const quest = DRILL_QUESTS[currentQuestIndex];
        if (datasetId !== quest.datasetId) { setDrillFeedback('incorrect_dataset'); return; }
        if (xKey === yKey) { setDrillFeedback('same_variable'); return; }
        const isTargetX = xKey === quest.targetKey;
        const isTargetY = yKey === quest.targetKey;
        const selectedPair = isTargetX ? yKey : (isTargetY ? xKey : null);
        if (selectedPair && quest.validAnswers.includes(selectedPair)) { setDrillFeedback('correct'); }
        else { setDrillFeedback('incorrect'); }
    };

    const nextQuest = () => { setDrillFeedback(null); if (currentQuestIndex < DRILL_QUESTS.length - 1) { setCurrentQuestIndex(prev => prev + 1); } else { setHasCleared(true); setShowClearModal(true); } };
    const restartDrill = () => { setShowClearModal(false); setHasCleared(false); setCurrentQuestIndex(0); setDrillFeedback(null); setMode('drill'); };
    const loadExtraMissionLevel = (levelIndex) => { const config = EXTRA_MISSION_STAGES[levelIndex]; setDatasetId(config.datasetId); setXKey(config.xKey); setYKey(config.yKey); setExcludedIds([]); };
    const startExtraMission = () => { setShowClearModal(false); setMode('extra'); setExtraMissionLevel(0); loadExtraMissionLevel(0); };
    const nextExtraMission = () => { if (extraMissionLevel < EXTRA_MISSION_STAGES.length - 1) { const nextLevel = extraMissionLevel + 1; setExtraMissionLevel(nextLevel); loadExtraMissionLevel(nextLevel); } };
    const finishExtraMission = () => { setMode('explanation'); setDatasetId(DATASETS[0].id); setExcludedIds([]); };

    return html`
        <div class="h-full flex flex-col font-sans bg-gray-50 transition-all duration-500 overflow-hidden">
            <header class="bg-white px-6 py-4 flex flex-col lg:flex-row justify-between items-center shadow-md z-10 gap-4 border-b">
                <div class="flex items-center space-x-4">
                    <div class="bg-indigo-600 text-white p-2 rounded-lg shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    </div>
                    <div><h1 class="text-xl font-black text-gray-900 tracking-tight">Data Detective</h1></div>
                </div>
                <div class="flex bg-gray-100 p-1 rounded-lg gap-1">
                    <button class="px-6 py-2 rounded-md text-sm font-bold transition-all ${mode === 'explanation' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}" onClick=${() => setMode('explanation')}>📚 解説</button>
                    <button class="px-6 py-2 rounded-md text-sm font-bold transition-all ${mode === 'drill' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400'}" onClick=${() => setMode('drill')}>🔎 ドリル</button>
                    <button class="px-6 py-2 rounded-md text-sm font-bold transition-all ${mode === 'exploration' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400'}" onClick=${() => setMode('exploration')}>📊 自由研究</button>
                </div>
            </header>

            ${mode === 'explanation' ? html`<${TutorialMode} onFinish=${() => setMode('drill')} />` : html`
                <main class="flex-1 flex flex-col lg:flex-row overflow-hidden p-4 md:p-6 gap-4 md:gap-6 w-full">
                    <aside class="w-full lg:w-80 flex flex-col gap-4 shrink-0 overflow-y-auto">
                        <${Card} title="Settings">
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Data Source</label>
                                    <select class="block w-full border border-gray-200 rounded-lg p-2 bg-white text-sm font-bold" value=${datasetId} onChange=${e => setDatasetId(e.target.value)} disabled=${mode === 'extra'}>
                                        ${availableDatasets.map(d => html`<option key=${d.id} value=${d.id}>${d.name}</option>`)}
                                    </select>
                                    <p class="mt-2 text-xs text-gray-500 font-medium leading-relaxed">${dataset.description}</p>
                                </div>
                                <button onClick=${() => setShowDataWindow(true)} class="w-full py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all">詳細表示</button>
                            </div>
                        </${Card}>
                        <${Card} title="Variables" className="flex-1">
                            <div class="space-y-4">
                                <div class="p-4 bg-blue-50/50 rounded-xl border border-blue-50 ${mode === 'extra' ? 'opacity-50' : ''}">
                                    <label class="block text-[10px] font-black text-blue-800 mb-2 uppercase">X-Axis</label>
                                    <select class="w-full border border-blue-100 rounded-lg p-2 bg-white text-sm font-bold" value=${xKey} onChange=${e => setXKey(e.target.value)} disabled=${mode === 'extra'}>
                                        ${dataset.columns.map(c => html`<option key=${c.key} value=${c.key}>${c.label}</option>`)}
                                    </select>
                                </div>
                                <div class="flex justify-center"><button onClick=${handleSwapAxes} class="p-2 bg-white border border-gray-100 rounded-full shadow-sm hover:bg-gray-50 transition-all" disabled=${mode === 'extra'}>🔄</button></div>
                                <div class="p-4 bg-green-50/50 rounded-xl border border-green-50 ${mode === 'extra' ? 'opacity-50' : ''}">
                                    <label class="block text-[10px] font-black text-green-800 mb-2 uppercase">Y-Axis</label>
                                    <select class="w-full border border-green-100 rounded-lg p-2 bg-white text-sm font-bold" value=${yKey} onChange=${e => setYKey(e.target.value)} disabled=${mode === 'extra'}>
                                        ${dataset.columns.map(c => html`<option key=${c.key} value=${c.key}>${c.label}</option>`)}
                                    </select>
                                </div>
                            </div>
                        </${Card}>
                    </aside>
                    <section class="flex-1 flex flex-col min-w-0">
                        <${Card} className="h-full shadow-md border-gray-200">
                            <div class="h-full flex flex-col">
                                <div class="flex justify-between items-center mb-4 px-2">
                                    <h2 class="text-lg font-black text-gray-800">散布図: <span class="text-blue-500">${xColumn.label}</span> vs <span class="text-green-500">${yColumn.label}</span></h2>
                                    <div class="flex gap-4 text-[10px] font-black text-gray-400 uppercase">
                                        <div class="flex items-center gap-1"><div class="w-2 h-2 bg-indigo-500 rounded"></div> Actual</div>
                                        <div class="flex items-center gap-1"><div class="w-2 h-2 bg-orange-500 rounded-full"></div> Regression</div>
                                    </div>
                                </div>
                                <div class="flex-1"><${ScatterVis} data=${dataset.data} xConfig=${xColumn} yConfig=${yColumn} regression=${stats.regression} excludedIds=${excludedIds} onTogglePoint=${togglePoint} /></div>
                            </div>
                        </${Card}>
                    </section>
                    <aside class="w-full lg:w-80 flex-shrink-0">
                        <${Card} title="Analysis" className="h-full">
                            <${AnalysisPanel} xLabel=${xColumn.label} yLabel=${yColumn.label} correlation=${stats.correlation} regression=${stats.regression} strength=${stats.strength} activeCount=${stats.activeCount} totalCount=${dataset.data.length} />
                        </${Card}>
                    </aside>
                </main>
            `}

            ${mode === 'drill' && !showClearModal && html`<${DrillQuestWindow} quest=${currentQuest} index=${displayQuestIndex} total=${DRILL_QUESTS.length} feedback=${drillFeedback} onSubmit=${handleDrillSubmit} onNext=${nextQuest} hasCleared=${hasCleared} onRestart=${restartDrill} />`}
            ${mode === 'extra' && html`<${ExtraMissionWindow} correlation=${stats.correlation} activeCount=${stats.activeCount} stage=${extraMissionLevel} totalStages=${EXTRA_MISSION_STAGES.length} targetR=${EXTRA_MISSION_STAGES[extraMissionLevel].targetR} onNext=${nextExtraMission} onComplete=${finishExtraMission} />`}
            ${showDataWindow && html`<${FloatingDataWindow} data=${dataset.data} columns=${dataset.columns} excludedIds=${excludedIds} onTogglePoint=${togglePoint} onClose=${() => setShowDataWindow(false)} />`}
            ${showClearModal && html`<${DrillClearModal} onRestart=${restartDrill} onExploration=${() => {setShowClearModal(false); setMode('exploration');}} onExtraMission=${startExtraMission} />`}
        </div>
    `;
};

const root = createRoot(document.getElementById('root'));
root.render(html`<${App} />`);
