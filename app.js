
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import htm from 'htm';
import { 
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, Line, ComposedChart, Label, Cell, Legend
} from 'recharts';
import { DATASETS, DRILL_QUESTS } from './utils/data.js';
import * as MathUtils from './utils/math.js';

const html = htm.bind(React.createElement);

// --- Custom Hooks ---

const useGameState = () => {
    const STORAGE_KEY = 'dac_save_v1';
    
    // 初期化時にlocalStorageから読み込む
    const [state, setState] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : { completedDrills: [], masterHighScore: 0 };
        } catch (e) {
            console.error("Save data load error:", e);
            return { completedDrills: [], masterHighScore: 0 };
        }
    });

    const saveState = (newState) => {
        setState(newState);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    };

    const completeDrill = (id) => {
        if (!state.completedDrills.includes(id)) {
            saveState({
                ...state,
                completedDrills: [...state.completedDrills, id]
            });
        }
    };

    const updateMasterScore = (score) => {
        if (score > state.masterHighScore) {
            saveState({
                ...state,
                masterHighScore: score
            });
            return true; // New Record
        }
        return false;
    };

    const resetData = () => {
        if (window.confirm("【警告】\nこれまでの学習記録とハイスコアを全て消去します。\n本当によろしいですか？")) {
            const initialState = { completedDrills: [], masterHighScore: 0 };
            saveState(initialState);
            alert("データをリセットしました。");
        }
    };

    return { state, completeDrill, updateMasterScore, resetData };
};

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
        if (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
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

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return isMobile;
};

// --- Components ---

const Card = ({ title, children, className = "" }) => html`
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden flex flex-col border border-gray-100 dark:border-slate-700 ${className}">
        ${title && html`<div class="px-3 py-1.5 bg-gray-50 dark:bg-slate-700/50 border-b border-gray-100 dark:border-slate-700 font-bold text-gray-700 dark:text-slate-200 text-xs md:text-sm shrink-0">${title}</div>`}
        <div class="p-2 md:p-3 flex-1 overflow-auto flex flex-col text-gray-800 dark:text-slate-300 text-sm md:text-base">
            ${children}
        </div>
    </div>
`;

/**
 * 紙吹雪コンポーネント (Simple CSS Confetti)
 */
const SimpleConfetti = () => {
    const pieces = useMemo(() => {
        return Array.from({ length: 30 }).map((_, i) => {
            const left = Math.random() * 100 + '%';
            const animationDelay = Math.random() * 0.5 + 's';
            const bgColors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#ec4899'];
            const color = bgColors[Math.floor(Math.random() * bgColors.length)];
            return { id: i, left, animationDelay, color };
        });
    }, []);

    return html`
        <div class="absolute inset-0 overflow-hidden pointer-events-none z-50">
            ${pieces.map(p => html`
                <div key=${p.id} class="confetti-piece" style=${{ left: p.left, animationDelay: p.animationDelay, backgroundColor: p.color }}></div>
            `)}
        </div>
    `;
};

/**
 * DrillMode (Story/Quest Mode)
 * 指定されたデータセットを使用し、仮説検証を行うモード
 */
const DrillMode = ({ completedDrills, onComplete, onExit }) => {
    const [currentDrillId, setCurrentDrillId] = useState(null);
    const [selectedX, setSelectedX] = useState("");
    const [selectedY, setSelectedY] = useState("");
    const [showResult, setShowResult] = useState(false);

    const currentDrill = useMemo(() => 
        DRILL_QUESTS.find(q => q.id === currentDrillId), 
    [currentDrillId]);

    const dataset = useMemo(() => 
        currentDrill ? DATASETS.find(d => d.id === currentDrill.datasetId) : null,
    [currentDrill]);

    // Initialize selection when drill changes
    useEffect(() => {
        if (currentDrill) {
            setSelectedX(currentDrill.initialX || "");
            setSelectedY(currentDrill.initialY || "");
            setShowResult(false);
        }
    }, [currentDrill]);

    const handleCheckAnswer = () => {
        if (!currentDrill) return;
        // ターゲットがX軸かY軸のどちらかに設定され、もう片方が正解リストに含まれているか
        const isTargetX = currentDrill.targetKey === selectedX;
        const isTargetY = currentDrill.targetKey === selectedY;
        
        let isCorrect = false;
        if (isTargetX && currentDrill.validAnswers.includes(selectedY)) isCorrect = true;
        if (isTargetY && currentDrill.validAnswers.includes(selectedX)) isCorrect = true;

        if (isCorrect) {
            onComplete(currentDrill.id);
        }
        setShowResult(true);
    };

    // ドリル一覧画面
    if (!currentDrillId) {
        return html`
            <div class="h-full flex flex-col p-4 max-w-4xl mx-auto w-full animate-fade-in-up">
                <div class="flex items-center justify-between mb-6">
                    <button onClick=${onExit} class="text-gray-500 hover:bg-gray-100 p-2 rounded-lg">
                         ⬅ 戻る
                    </button>
                    <h2 class="text-2xl font-black text-gray-800 dark:text-white">ドリル一覧</h2>
                    <div class="w-10"></div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pb-4">
                    ${DRILL_QUESTS.map(drill => {
                        const isCompleted = completedDrills.includes(drill.id);
                        return html`
                            <button key=${drill.id} onClick=${() => setCurrentDrillId(drill.id)}
                                class="text-left p-4 rounded-xl border-2 transition-all shadow-sm group hover:scale-[1.02]
                                ${isCompleted 
                                    ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                                    : 'bg-white border-gray-100 hover:border-indigo-300 dark:bg-slate-800 dark:border-slate-700'
                                }">
                                <div class="flex items-start justify-between mb-2">
                                    <span class="font-bold text-xs px-2 py-1 rounded ${isCompleted ? 'bg-green-200 text-green-800' : 'bg-indigo-100 text-indigo-700'}">
                                        QUEST ${drill.id}
                                    </span>
                                    ${isCompleted && html`<span class="text-xl">✅</span>`}
                                </div>
                                <div class="text-sm font-bold text-gray-700 dark:text-gray-200 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                    ${drill.text}
                                </div>
                            </button>
                        `;
                    })}
                </div>
            </div>
        `;
    }

    // ドリル実行画面
    const isCompleted = completedDrills.includes(currentDrill.id);
    const isAnswerCorrect = showResult && (isCompleted || (() => {
         const isTargetX = currentDrill.targetKey === selectedX;
         const isTargetY = currentDrill.targetKey === selectedY;
         return (isTargetX && currentDrill.validAnswers.includes(selectedY)) || (isTargetY && currentDrill.validAnswers.includes(selectedX));
    })());

    // 回帰計算
    const regression = (dataset && selectedX && selectedY) ? 
        MathUtils.calculateRegression(dataset.data.map(d=>d[selectedX]), dataset.data.map(d=>d[selectedY])) 
        : null;
    const r = (dataset && selectedX && selectedY) ?
        MathUtils.calculateCorrelation(dataset.data.map(d=>d[selectedX]), dataset.data.map(d=>d[selectedY]))
        : 0;

    return html`
        <div class="h-full flex flex-col p-2 md:p-4 max-w-6xl mx-auto w-full animate-fade-in-up">
            <div class="flex items-center justify-between mb-2">
                <button onClick=${() => setCurrentDrillId(null)} class="text-sm font-bold text-gray-500 hover:text-gray-800 flex items-center gap-1">
                    ⬅ 一覧へ
                </button>
                <div class="font-bold text-gray-400 text-xs">QUEST ${currentDrill.id}</div>
            </div>

            <!-- Quest Card -->
            <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-indigo-100 dark:border-slate-700 mb-4">
                <div class="flex gap-3 items-start">
                    <div class="text-3xl">🕵️‍♂️</div>
                    <div>
                        <div class="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">${currentDrill.text}</div>
                        <div class="text-xs bg-indigo-50 dark:bg-slate-700 text-indigo-800 dark:text-indigo-200 px-3 py-1.5 rounded inline-block font-bold">
                            ヒント: ${currentDrill.hint}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Content: Graph & Controls -->
            <div class="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden">
                <!-- Graph -->
                <div class="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-inner border border-gray-200 dark:border-slate-700 p-2 md:p-4 relative flex flex-col min-h-[300px]">
                    ${dataset ? html`
                        <${ResponsiveContainer} width="100%" height="100%">
                            <${ScatterChart} margin=${{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <${CartesianGrid} strokeDasharray="3 3" opacity=${0.3} />
                                <${XAxis} type="number" dataKey=${selectedX} name=${dataset.columns.find(c=>c.key===selectedX)?.label || 'X'} domain=${['auto', 'auto']} 
                                    label=${{ value: dataset.columns.find(c=>c.key===selectedX)?.label, position: 'bottom', offset: 0 }} />
                                <${YAxis} type="number" dataKey=${selectedY} name=${dataset.columns.find(c=>c.key===selectedY)?.label || 'Y'} domain=${['auto', 'auto']} 
                                    label=${{ value: dataset.columns.find(c=>c.key===selectedY)?.label, angle: -90, position: 'left' }} />
                                <${Tooltip} cursor=${{ strokeDasharray: '3 3' }} />
                                <${Scatter} name="Data" data=${dataset.data} fill="#6366f1" />
                                ${showResult && regression && html`
                                    <${Line} 
                                        data=${[
                                            { [selectedX]: dataset.columns.find(c=>c.key===selectedX).min, [selectedY]: MathUtils.predictY(dataset.columns.find(c=>c.key===selectedX).min, regression.slope, regression.intercept) },
                                            { [selectedX]: dataset.columns.find(c=>c.key===selectedX).max, [selectedY]: MathUtils.predictY(dataset.columns.find(c=>c.key===selectedX).max, regression.slope, regression.intercept) }
                                        ]}
                                        dataKey=${selectedY} stroke="#f97316" strokeWidth=${2} dot=${false} activeDot=${false}
                                    />
                                `}
                            </${ScatterChart}>
                        </${ResponsiveContainer}>
                    ` : html`<div class="flex items-center justify-center h-full text-gray-400">データセット読み込みエラー</div>`}

                    ${showResult && isAnswerCorrect && html`
                        <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
                             <div class="text-6xl md:text-9xl opacity-80 animate-pop-in">⭕</div>
                        </div>
                    `}
                    ${showResult && !isAnswerCorrect && html`
                        <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
                             <div class="text-6xl md:text-9xl opacity-80 animate-pop-in">❌</div>
                        </div>
                    `}
                </div>

                <!-- Controls -->
                <div class="md:w-72 flex flex-col gap-4">
                    <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col gap-4">
                        <div>
                            <label class="block text-xs font-bold text-gray-400 mb-1">横軸 (X)</label>
                            <select value=${selectedX} onChange=${(e) => { setSelectedX(e.target.value); setShowResult(false); }} 
                                class="w-full p-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-bold text-gray-700 dark:text-white">
                                ${dataset?.columns.map(c => html`<option key=${c.key} value=${c.key}>${c.label}</option>`)}
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-400 mb-1">縦軸 (Y)</label>
                            <select value=${selectedY} onChange=${(e) => { setSelectedY(e.target.value); setShowResult(false); }} 
                                class="w-full p-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-bold text-gray-700 dark:text-white">
                                ${dataset?.columns.map(c => html`<option key=${c.key} value=${c.key}>${c.label}</option>`)}
                            </select>
                        </div>

                        <button onClick=${handleCheckAnswer} disabled=${showResult && isAnswerCorrect}
                            class="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold shadow-md hover:bg-indigo-700 active:scale-95 transition-all disabled:bg-green-500 disabled:opacity-100">
                            ${showResult && isAnswerCorrect ? '正解！' : '関係性をチェック'}
                        </button>
                    </div>

                    ${showResult && html`
                        <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border-2 ${isAnswerCorrect ? 'border-green-400' : 'border-red-400'} animate-fade-in-up flex-1 overflow-y-auto">
                            <h3 class="font-black ${isAnswerCorrect ? 'text-green-600' : 'text-red-500'} mb-2 text-lg">
                                ${isAnswerCorrect ? '分析成功！' : '分析失敗...'}
                            </h3>
                            
                            <div class="mb-4 text-sm bg-gray-50 dark:bg-slate-700 p-2 rounded">
                                <div class="flex justify-between mb-1">
                                    <span class="text-gray-500 text-xs">相関係数 (r)</span>
                                    <span class="font-mono font-bold">${r.toFixed(2)}</span>
                                </div>
                                <div class="text-xs font-bold text-gray-700 dark:text-gray-300 text-right">
                                    判定: ${MathUtils.getCorrelationStrength(r)}
                                </div>
                            </div>

                            <p class="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                                ${isAnswerCorrect ? currentDrill.causationNote : 'ヒント：指定された相関関係が見つかりません。軸の組み合わせを変えてみましょう。'}
                            </p>
                            
                            ${isAnswerCorrect && !completedDrills.includes(currentDrill.id) && html`
                                <div class="mt-4 text-center text-xs text-green-500 font-bold">クリア記録を保存しました</div>
                            `}
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
};

/**
 * 相関マスターモード (MasterMode)
 */
const MasterMode = ({ onExit, highScore, onUpdateScore }) => {
    // phase: 'intro', 'practice', 'practice_result', 'game_start', 'playing', 'result', 'finished'
    const [phase, setPhase] = useState('intro');
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [currentData, setCurrentData] = useState(null);
    const [userGuess, setUserGuess] = useState(0);
    const [history, setHistory] = useState([]);
    const TOTAL_ROUNDS = 5; 

    // データ生成ロジック
    const generateData = () => {
        const count = 30;
        const types = ['strong_pos', 'mod_pos', 'weak_pos', 'none', 'weak_neg', 'mod_neg', 'strong_neg'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        let slope = 0;
        let noiseLevel = 0;
        
        switch(type) {
            case 'strong_pos': slope = 1 + Math.random(); noiseLevel = 15; break;
            case 'mod_pos': slope = 0.5 + Math.random(); noiseLevel = 40; break;
            case 'weak_pos': slope = 0.2 + Math.random() * 0.3; noiseLevel = 80; break;
            case 'none': slope = (Math.random() - 0.5) * 0.2; noiseLevel = 100; break;
            case 'weak_neg': slope = -0.2 - Math.random() * 0.3; noiseLevel = 80; break;
            case 'mod_neg': slope = -0.5 - Math.random(); noiseLevel = 40; break;
            case 'strong_neg': slope = -1 - Math.random(); noiseLevel = 15; break;
        }

        const data = [];
        for(let i=0; i<count; i++) {
            const x = Math.random() * 100;
            const y = (x * slope) + 50 + ((Math.random() - 0.5) * 2 * noiseLevel);
            data.push({ id: i, x, y });
        }
        
        const n = data.length;
        const meanX = data.reduce((a, b) => a + b.x, 0) / n;
        const meanY = data.reduce((a, b) => a + b.y, 0) / n;
        let sumXY = 0, sumXX = 0, sumYY = 0;
        data.forEach(p => {
            sumXY += (p.x - meanX) * (p.y - meanY);
            sumXX += (p.x - meanX) ** 2;
            sumYY += (p.y - meanY) ** 2;
        });
        
        const covariance = sumXY / n;
        const stdDevX = Math.sqrt(sumXX / n);
        const stdDevY = Math.sqrt(sumYY / n);
        const denominator = (stdDevX * stdDevY);
        const r = denominator === 0 ? 0 : covariance / denominator;

        return { data, r, stats: { meanX, meanY, covariance, stdDevX, stdDevY } };
    };

    useEffect(() => {
        if (phase === 'practice' || phase === 'game_start') {
            setCurrentData(generateData());
            setUserGuess(0);
            if (phase === 'game_start') setPhase('playing');
        }
    }, [phase]);

    useEffect(() => {
        if (phase === 'finished') {
            onUpdateScore(score);
        }
    }, [phase, score]);

    const calculatePoints = (correctR, guessR) => {
        const diff = Math.abs(correctR - guessR);
        return Math.max(0, Math.round((1 - (diff * 2)) * 100));
    };

    const handleSubmit = () => {
        const points = calculatePoints(currentData.r, userGuess);
        
        if (phase === 'practice') {
            setPhase('practice_result');
        } else {
            setScore(prev => prev + points);
            setHistory(prev => [...prev, { round, r: currentData.r, guess: userGuess, points }]);
            setPhase('result');
        }
    };

    const handleNext = () => {
        if (phase === 'practice_result') {
            setRound(1);
            setScore(0);
            setHistory([]);
            setPhase('game_start');
        } else if (phase === 'result') {
            if (round >= TOTAL_ROUNDS) {
                setPhase('finished');
            } else {
                setRound(prev => prev + 1);
                setCurrentData(generateData());
                setUserGuess(0);
                setPhase('playing');
            }
        }
    };

    const handleRetry = () => {
        setRound(1);
        setScore(0);
        setHistory([]);
        setPhase('game_start');
    };

    const renderGameScreen = (isPractice) => {
        const points = (phase === 'result' || phase === 'practice_result') ? calculatePoints(currentData.r, userGuess) : 0;
        const isPerfect = points >= 90;
        const isGreat = points >= 70 && points < 90;

        return html`
        <div class="h-full flex flex-col p-2 md:p-4 max-w-4xl mx-auto w-full animate-fade-in-up">
            <div class="flex justify-between items-center mb-4 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                <div class="font-black text-xl text-gray-800 dark:text-white flex items-center gap-2">
                    ${isPractice ? html`
                        <span class="bg-green-100 text-green-700 px-2 py-0.5 rounded text-sm">PRACTICE</span>
                        <span>練習問題</span>
                    ` : html`
                        <span class="text-indigo-500 mr-2">ROUND</span>
                        ${round} <span class="text-sm text-gray-400">/ ${TOTAL_ROUNDS}</span>
                    `}
                </div>
                ${!isPractice && html`
                    <div class="font-black text-xl text-gray-800 dark:text-white">
                        SCORE: <span class="text-indigo-600 dark:text-indigo-400">${score}</span>
                    </div>
                `}
            </div>

            <div class="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-inner border border-gray-200 dark:border-slate-700 p-2 md:p-6 mb-4 relative overflow-hidden flex flex-col justify-center">
                 <div class="absolute top-2 left-2 text-xs font-bold text-gray-300 dark:text-slate-600">X: Variable A</div>
                 <div class="absolute bottom-2 right-2 text-xs font-bold text-gray-300 dark:text-slate-600">Y: Variable B</div>
                 ${currentData && html`
                    <${ResponsiveContainer} width="100%" height="100%">
                        <${ScatterChart} margin=${{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <${CartesianGrid} strokeDasharray="3 3" opacity=${0.3} />
                            <${XAxis} type="number" dataKey="x" hide domain=${['auto', 'auto']} />
                            <${YAxis} type="number" dataKey="y" hide domain=${['auto', 'auto']} />
                            <${Scatter} data=${currentData.data} fill="#8884d8">
                                ${currentData.data.map((entry, index) => html`
                                    <${Cell} key=${index} fill="#6366f1" />
                                `)}
                            </${Scatter}>
                            ${(phase === 'result' || phase === 'practice_result') && html`
                                <${Line} 
                                    data=${[
                                        { x: 0, y: MathUtils.predictY(0, MathUtils.calculateRegression(currentData.data.map(d=>d.x), currentData.data.map(d=>d.y)).slope, MathUtils.calculateRegression(currentData.data.map(d=>d.x), currentData.data.map(d=>d.y)).intercept) },
                                        { x: 100, y: MathUtils.predictY(100, MathUtils.calculateRegression(currentData.data.map(d=>d.x), currentData.data.map(d=>d.y)).slope, MathUtils.calculateRegression(currentData.data.map(d=>d.x), currentData.data.map(d=>d.y)).intercept) }
                                    ]} 
                                    dataKey="y" stroke="#f97316" strokeWidth=${3} dot=${false} 
                                    isAnimationActive=${true}
                                />
                            `}
                        </${ScatterChart}>
                    </${ResponsiveContainer}>
                 `}
                 
                 ${(phase === 'result' || phase === 'practice_result') && html`
                    <div class="absolute inset-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center animate-fade-in-up z-10 p-4 overflow-y-auto">
                        ${isPerfect && html`<${SimpleConfetti} />`}

                        <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xl border-4 ${isPerfect ? 'border-yellow-400' : 'border-indigo-500'} w-full max-w-lg text-center relative overflow-hidden">
                            ${isPerfect && html`
                                <div class="absolute -top-10 -right-10 bg-yellow-400 text-white font-black py-10 px-10 rotate-12 shadow-lg animate-pulse">
                                    PERFECT!!
                                </div>
                            `}
                            
                            <div class="text-sm font-bold text-gray-500 dark:text-slate-400 mb-1">正解 (r)</div>
                            <div class="text-5xl font-black text-indigo-600 dark:text-indigo-400 mb-2 font-mono">${currentData.r.toFixed(2)}</div>
                            
                            ${isPerfect ? html`
                                <div class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 animate-rainbow mb-4 animate-scale-up-bounce">
                                    PERFECT MATCH!
                                </div>
                            ` : isGreat ? html`
                                <div class="text-2xl font-black text-green-500 mb-4 animate-bounce">
                                    GREAT GUESS!
                                </div>
                            ` : html`<div class="h-8 mb-4"></div>`}

                            <div class="flex justify-between gap-4 text-sm border-b dark:border-slate-700 pb-4 mb-4">
                                <div class="flex-1">
                                    <div class="font-bold text-gray-400 text-xs">あなたの予想</div>
                                    <div class="font-mono font-bold text-xl text-gray-800 dark:text-white">${userGuess.toFixed(2)}</div>
                                </div>
                                <div class="flex-1">
                                    <div class="font-bold text-gray-400 text-xs">誤差</div>
                                    <div class="font-mono font-bold text-xl ${points > 0 ? 'text-gray-800 dark:text-white' : 'text-red-500'}">${Math.abs(currentData.r - userGuess).toFixed(2)}</div>
                                </div>
                                ${!isPractice && html`
                                    <div class="flex-1">
                                        <div class="font-bold text-gray-400 text-xs">獲得ポイント</div>
                                        <div class="font-bold text-xl ${isPerfect ? 'text-yellow-500 scale-125' : 'text-orange-500'} transition-transform">+${points}</div>
                                    </div>
                                `}
                            </div>
                            
                            <button onClick=${handleNext} class="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 active:scale-95 transition-all">
                                ${isPractice ? '本番スタート！ 🔥' : (round >= TOTAL_ROUNDS ? '最終結果を見る 🏆' : '次の問題へ ➡')}
                            </button>
                        </div>
                    </div>
                 `}
            </div>

            <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700">
                <div class="flex flex-col gap-4">
                    <div class="flex justify-between items-center px-2">
                        <div class="text-center">
                            <span class="font-mono text-gray-400 font-bold block text-xs">完全な負</span>
                            <span class="font-mono text-gray-500 font-bold">-1.00</span>
                        </div>
                        <span class="text-4xl font-black text-indigo-600 dark:text-indigo-400 font-mono tracking-wider w-32 text-center bg-gray-50 dark:bg-slate-900 rounded-lg py-1 border dark:border-slate-700 shadow-inner">
                            ${userGuess.toFixed(2)}
                        </span>
                        <div class="text-center">
                            <span class="font-mono text-gray-400 font-bold block text-xs">完全な正</span>
                            <span class="font-mono text-gray-500 font-bold">1.00</span>
                        </div>
                    </div>
                    <input type="range" min="-1" max="1" step="0.01" value=${userGuess} 
                        onInput=${(e) => setUserGuess(parseFloat(e.target.value))}
                        disabled=${phase === 'result' || phase === 'practice_result'}
                        class="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                    
                    <button onClick=${handleSubmit} disabled=${phase === 'result' || phase === 'practice_result'}
                        class="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-xl shadow-md hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        決定
                    </button>
                </div>
            </div>
        </div>
        `;
    };

    if (phase === 'intro') {
        return html`
            <div class="h-full flex flex-col items-center justify-center p-4 animate-fade-in-up bg-indigo-50 dark:bg-slate-900">
                <div class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 max-w-lg w-full text-center border-2 border-indigo-200">
                    <button onClick=${onExit} class="absolute top-4 left-4 text-gray-400 hover:text-gray-600">⬅ 戻る</button>
                    <div class="text-6xl mb-4 animate-bounce-slow">👑</div>
                    <h2 class="text-3xl font-black text-indigo-800 dark:text-indigo-300 mb-2">相関マスターモード</h2>
                    <p class="text-gray-600 dark:text-slate-400 mb-6 font-bold text-sm">
                        散布図を見て、<span class="text-indigo-600 dark:text-indigo-400 font-black text-lg">相関係数（r）</span>を目視で当ててください！
                    </p>
                    
                    ${highScore > 0 && html`
                        <div class="bg-yellow-100 border border-yellow-300 rounded-lg p-2 mb-6 animate-pulse">
                            <div class="text-xs text-yellow-700 font-bold">YOUR BEST SCORE</div>
                            <div class="text-2xl font-black text-yellow-600">${highScore} pts</div>
                        </div>
                    `}

                    <button onClick=${() => setPhase('practice')} class="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold text-xl shadow-lg hover:scale-105 transition-all">
                        練習問題へ進む ➡
                    </button>
                </div>
            </div>
        `;
    }

    if (phase === 'finished') {
        const getRank = (s) => {
            if (s >= 450) return "S (神の目)";
            if (s >= 400) return "A (データマスター)";
            if (s >= 300) return "B (一人前)";
            return "C (修行中)";
        };
        const isSRank = score >= 450;
        const isNewRecord = score > highScore;

        return html`
            <div class="h-full flex flex-col items-center justify-center p-4 animate-fade-in-up">
                ${isSRank && html`<${SimpleConfetti} />`}
                <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center border-2 border-indigo-500 relative">
                    ${isNewRecord && html`
                        <div class="absolute -top-4 -right-4 bg-red-500 text-white font-bold py-1 px-4 rounded-full animate-bounce shadow-lg z-30 transform rotate-12">
                            NEW RECORD!
                        </div>
                    `}
                    ${isSRank && html`
                        <div class="absolute -top-6 -left-6 text-6xl animate-bounce-slow z-20">🏆</div>
                    `}
                    <h2 class="text-2xl font-black text-gray-800 dark:text-white mb-2">RESULT</h2>
                    <div class="text-6xl font-black text-indigo-600 dark:text-indigo-400 mb-2">${score} <span class="text-xl">pts</span></div>
                    <div class="text-xl font-bold text-gray-600 dark:text-slate-300 mb-6">Rank: ${getRank(score)}</div>
                    
                    <div class="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 mb-6 max-h-48 overflow-y-auto text-sm">
                        <table class="w-full text-left">
                            <thead class="text-gray-500 dark:text-slate-400 border-b dark:border-slate-600">
                                <tr><th>Round</th><th>正解</th><th>予想</th><th>Pts</th></tr>
                            </thead>
                            <tbody class="text-gray-700 dark:text-slate-200">
                                ${history.map((h, i) => html`
                                    <tr key=${i} class="border-b dark:border-slate-700/50">
                                        <td class="py-1">${h.round}</td>
                                        <td class="font-mono font-bold">${h.r.toFixed(2)}</td>
                                        <td class="font-mono">${h.guess.toFixed(2)}</td>
                                        <td class="font-bold text-indigo-600 dark:text-indigo-400">+${h.points}</td>
                                    </tr>
                                `)}
                            </tbody>
                        </table>
                    </div>

                    <div class="flex gap-3">
                        <button onClick=${onExit} class="flex-1 py-3 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-slate-600">
                            終了
                        </button>
                        <button onClick=${handleRetry} class="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all">
                            もう一度挑戦
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    return renderGameScreen(phase === 'practice' || phase === 'practice_result');
};

/**
 * Main App Component
 */
const App = () => {
    // Mode: 'home', 'drill', 'master'
    const [mode, setMode] = useState('home');
    const { state, completeDrill, updateMasterScore, resetData } = useGameState();

    const renderHome = () => html`
        <div class="h-full flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 animate-fade-in-up overflow-y-auto">
            <div class="max-w-md w-full text-center">
                <div class="mb-8">
                    <h1 class="text-4xl font-black text-indigo-600 dark:text-indigo-400 mb-2">Data Challenge</h1>
                    <p class="text-gray-500 dark:text-gray-400 font-bold">データ分析・活用スキルを磨こう</p>
                </div>

                <div class="space-y-4">
                    <button onClick=${() => setMode('drill')} class="w-full bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border-2 border-transparent hover:border-indigo-500 transition-all text-left group relative overflow-hidden">
                        <div class="relative z-10">
                            <div class="text-2xl mb-1">🔍 ドリルモード</div>
                            <div class="text-gray-500 dark:text-gray-400 text-sm mb-3">仮説を立ててデータを検証する</div>
                            <div class="flex items-center gap-2">
                                <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div class="h-full bg-indigo-500" style=${{ width: `${(state.completedDrills.length / DRILL_QUESTS.length) * 100}%` }}></div>
                                </div>
                                <span class="text-xs font-bold text-indigo-600">${state.completedDrills.length} / ${DRILL_QUESTS.length}</span>
                            </div>
                        </div>
                        <div class="absolute right-0 bottom-0 text-9xl opacity-5 group-hover:scale-110 transition-transform">📊</div>
                    </button>

                    <button onClick=${() => setMode('master')} class="w-full bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl shadow-lg text-left group relative overflow-hidden text-white hover:scale-[1.02] transition-transform">
                        <div class="relative z-10">
                            <div class="text-2xl font-black mb-1">👑 マスターモード</div>
                            <div class="text-indigo-100 text-sm mb-3">相関係数を目視で当てる上級者向け</div>
                            <div class="bg-white/20 inline-block px-3 py-1 rounded text-sm font-bold backdrop-blur-sm">
                                BEST: ${state.masterHighScore} pts
                            </div>
                        </div>
                        <div class="absolute -right-4 -bottom-4 text-9xl opacity-20 group-hover:rotate-12 transition-transform">🏆</div>
                    </button>
                </div>

                <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <button onClick=${resetData} class="text-xs text-gray-400 hover:text-red-500 underline transition-colors">
                        すべての学習データをリセット
                    </button>
                </div>
            </div>
        </div>
    `;

    return html`
        <div class="w-full h-full text-gray-800 dark:text-gray-200">
            ${mode === 'home' && renderHome()}
            ${mode === 'drill' && html`
                <${DrillMode} 
                    completedDrills=${state.completedDrills} 
                    onComplete=${completeDrill} 
                    onExit=${() => setMode('home')} 
                />
            `}
            ${mode === 'master' && html`
                <${MasterMode} 
                    highScore=${state.masterHighScore}
                    onUpdateScore=${updateMasterScore}
                    onExit=${() => setMode('home')} 
                />
            `}
        </div>
    `;
};

const root = createRoot(document.getElementById('root'));
root.render(html`<${App} />`);
