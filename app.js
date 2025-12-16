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

// --- Components ---

/**
 * 汎用カードコンポーネント
 */
const Card = ({ title, children, className = "" }) => html`
    <div class="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full border border-gray-100 ${className}">
        ${title && html`<div class="px-4 py-3 bg-gray-50 border-b border-gray-100 font-bold text-gray-700">${title}</div>`}
        <div class="p-4 flex-1 overflow-auto">
            ${children}
        </div>
    </div>
`;

/**
 * データ入力モーダル
 */
const DataInputModal = ({ onClose, onImport }) => {
    const [name, setName] = useState("");
    const [text, setText] = useState("身長,体重\n170,60\n165,55\n180,75\n155,48\n172,68");
    const [error, setError] = useState("");

    const handleSave = () => {
        setError("");
        if (!name.trim()) {
            setError("データセット名を入力してください。");
            return;
        }
        if (!text.trim()) {
            setError("データを入力してください。");
            return;
        }
        onImport(name, text);
    };

    return html`
        <div class="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] animate-fade-in-up">
                <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
                    <h3 class="text-lg font-bold text-gray-800">新しいデータを作る</h3>
                    <button onClick=${onClose} class="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors">×</button>
                </div>
                
                <div class="p-6 overflow-y-auto space-y-5">
                    ${error && html`
                        <div class="bg-red-50 text-red-600 px-4 py-2 rounded text-sm border border-red-100 flex items-center">
                            <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            ${error}
                        </div>
                    `}
                    
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">データセット名</label>
                        <input 
                            type="text" 
                            class="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                            placeholder="例: クラスの身長と体重"
                            value=${name}
                            onInput=${e => setName(e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <div class="flex justify-between items-end mb-1">
                            <label class="block text-sm font-bold text-gray-700">データ (CSV形式)</label>
                            <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">ExcelからコピペOK</span>
                        </div>
                        <p class="text-xs text-gray-500 mb-2">1行目に見出し、2行目以降に数値をカンマ(,)区切りで入力。</p>
                        <textarea 
                            class="w-full h-48 border border-gray-300 rounded-md p-2.5 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow leading-relaxed"
                            placeholder="身長,体重&#10;170,60&#10;165,55"
                            value=${text}
                            onInput=${e => setText(e.target.value)}
                        ></textarea>
                    </div>
                </div>

                <div class="px-6 py-4 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50 rounded-b-xl">
                    <button onClick=${onClose} class="px-4 py-2 text-gray-600 hover:bg-white hover:text-gray-800 border border-transparent hover:border-gray-200 rounded-md transition-all">キャンセル</button>
                    <button onClick=${handleSave} class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-sm font-medium transition-colors flex items-center">
                        <span class="mr-1">＋</span> 作成する
                    </button>
                </div>
            </div>
        </div>
    `;
};

/**
 * フローティングデータウィンドウ
 */
const FloatingDataWindow = ({ data, columns, excludedIds, onTogglePoint, onClose }) => {
    // 初期位置をレスポンシブに調整
    const isMobile = window.innerWidth < 768;
    const [position, setPosition] = useState(isMobile ? { x: 10, y: 60 } : { x: 20, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isMinimized, setIsMinimized] = useState(false);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - offset.x,
            y: e.clientY - offset.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return html`
        <div 
            class="fixed bg-white shadow-2xl rounded-lg border border-gray-200 z-50 flex flex-col overflow-hidden max-w-[95vw]"
            style=${{ 
                top: position.y, 
                left: position.x, 
                width: isMinimized ? '200px' : '550px',
                height: isMinimized ? 'auto' : '400px',
                transition: isDragging ? 'none' : 'width 0.2s, height 0.2s'
            }}
        >
            <div 
                class="bg-gray-800 text-white px-3 py-2 cursor-grab active:cursor-grabbing flex justify-between items-center select-none"
                onMouseDown=${handleMouseDown}
            >
                <span class="text-sm font-bold">データ選択・一覧 (n=${data.length})</span>
                <div class="flex gap-2">
                    <button onClick=${() => setIsMinimized(!isMinimized)} class="hover:text-gray-300">
                        ${isMinimized ? '□' : '－'}
                    </button>
                    <button onClick=${onClose} class="hover:text-red-300">×</button>
                </div>
            </div>
            ${!isMinimized && html`
                <div class="flex-1 overflow-auto p-0">
                    <table class="w-full text-sm text-left text-gray-600">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                            <tr>
                                <th class="px-4 py-2 border-b bg-gray-50 w-10 text-center">使用</th>
                                <th class="px-4 py-2 border-b bg-gray-50">ID</th>
                                ${columns.map(col => html`<th key=${col.key} class="px-4 py-2 border-b bg-gray-50 whitespace-nowrap">${col.label}</th>`)}
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(row => {
                                const isExcluded = excludedIds.includes(row.id);
                                return html`
                                <tr key=${row.id} class="border-b hover:bg-gray-50 ${isExcluded ? 'bg-gray-100 text-gray-400' : 'bg-white'}">
                                    <td class="px-4 py-2 text-center">
                                        <input 
                                            type="checkbox" 
                                            checked=${!isExcluded} 
                                            onChange=${() => onTogglePoint(row.id)}
                                            class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                                        />
                                    </td>
                                    <td class="px-4 py-2 font-medium">${row.id}</td>
                                    ${columns.map(col => html`
                                        <td key=${col.key} class="px-4 py-2">${row[col.key]}</td>
                                    `)}
                                </tr>
                            `})}
                        </tbody>
                    </table>
                </div>
            `}
        </div>
    `;
};

/**
 * 散布図コンポーネント
 */
const ScatterVis = ({ data, xConfig, yConfig, regression, excludedIds, onTogglePoint }) => {
    // グラフのドメイン（表示範囲）を全データに基づいて固定する（点を除外しても軸がブレないように）
    const domain = useMemo(() => {
        if (!data || data.length === 0) return { x: ['auto', 'auto'], y: ['auto', 'auto'] };
        const xValues = data.map(d => d[xConfig.key]);
        const yValues = data.map(d => d[yConfig.key]);
        const minX = Math.min(...xValues);
        const maxX = Math.max(...xValues);
        const minY = Math.min(...yValues);
        const maxY = Math.max(...yValues);
        
        // 少し余白を持たせる
        const padX = (maxX - minX) * 0.1 || 1; // prevent 0 range
        const padY = (maxY - minY) * 0.1 || 1;

        return {
            x: [Math.floor(minX - padX), Math.ceil(maxX + padX)],
            y: [Math.floor(minY - padY), Math.ceil(maxY + padY)]
        };
    }, [data, xConfig, yConfig]);

    // 回帰直線のデータポイント生成（除外データの影響を受けたregressionパラメータを使用）
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
            <${ComposedChart}
                margin=${{ top: 20, right: 30, bottom: 20, left: 20 }}
            >
                <${CartesianGrid} strokeDasharray="3 3" />
                <${XAxis} 
                    type="number" 
                    dataKey=${xConfig.key} 
                    name=${xConfig.label} 
                    domain=${domain.x}
                    label=${{ value: xConfig.label, position: 'bottom', offset: 0, fill: '#3b82f6' }}
                />
                <${YAxis} 
                    type="number" 
                    dataKey=${yConfig.key} 
                    name=${yConfig.label} 
                    domain=${domain.y}
                    label=${{ value: yConfig.label, angle: -90, position: 'insideLeft', fill: '#10b981' }}
                />
                <${Tooltip} 
                    cursor=${{ strokeDasharray: '3 3' }}
                    content=${({ active, payload }) => {
                        if (active && payload && payload.length) {
                            const d = payload[0].payload;
                            // tooltip payload comes from Scatter or Line. Check data type.
                            if (!d.id) return null; // Ignore line tooltip
                            
                            const isExcluded = excludedIds.includes(d.id);
                            return html`
                                <div class="bg-white border border-gray-200 p-2 rounded shadow text-sm">
                                    <div class="font-bold mb-1 flex justify-between">
                                        <span>ID: ${d.id}</span>
                                        <span class="text-xs ${isExcluded ? 'text-red-500' : 'text-green-600'} ml-2">
                                            ${isExcluded ? '除外中' : '使用中'}
                                        </span>
                                    </div>
                                    <p class="text-blue-600">${xConfig.label}: ${d[xConfig.key]}</p>
                                    <p class="text-green-600">${yConfig.label}: ${d[yConfig.key]}</p>
                                    <p class="text-xs text-gray-400 mt-1">クリックで切替</p>
                                </div>
                            `;
                        }
                        return null;
                    }}
                />
                <${Scatter} 
                    name="Data" 
                    data=${data} 
                    onClick=${(d) => onTogglePoint(d.id)}
                    cursor="pointer"
                >
                    ${data.map((entry, index) => {
                        const isExcluded = excludedIds.includes(entry.id);
                        return html`
                            <${Cell} 
                                key=${`cell-${index}`} 
                                fill=${isExcluded ? '#e5e7eb' : '#6366f1'} 
                                stroke=${isExcluded ? '#9ca3af' : 'none'}
                            />
                        `;
                    })}
                </${Scatter}>
                <${Line}
                    data=${lineData}
                    dataKey=${yConfig.key}
                    stroke="#ff7300"
                    strokeWidth=${2}
                    dot=${false}
                    activeDot=${false}
                    legendType="none"
                    isAnimationActive=${false}
                />
            </${ComposedChart}>
        </${ResponsiveContainer}>
    `;
};

/**
 * 分析パネル
 */
const AnalysisPanel = ({ xLabel, yLabel, correlation, regression, strength, activeCount, totalCount }) => {
    const [predictInput, setPredictInput] = useState("");
    
    const predictedValue = useMemo(() => {
        const x = parseFloat(predictInput);
        if (isNaN(x)) return null;
        return MathUtils.predictY(x, regression.slope, regression.intercept).toFixed(2);
    }, [predictInput, regression]);

    return html`
        <div class="space-y-6">
            <div>
                <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">相関分析</h3>
                <div class="bg-blue-50 p-4 rounded-lg">
                    <div class="flex justify-between items-baseline mb-1">
                        <span class="text-gray-600 font-medium">相関係数 (r)</span>
                        <span class="text-2xl font-bold text-blue-700">${correlation.toFixed(3)}</span>
                    </div>
                    <div class="text-right flex justify-between items-center">
                        <span class="text-xs text-gray-500">n = ${activeCount} / ${totalCount}</span>
                        <span class="inline-block px-2 py-1 text-xs font-semibold rounded-full 
                            ${strength.includes('強') ? 'bg-red-100 text-red-800' : 
                              strength.includes('なし') ? 'bg-gray-200 text-gray-800' : 'bg-green-100 text-green-800'}">
                            ${strength}
                        </span>
                    </div>
                </div>
            </div>

            <div>
                <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">回帰分析</h3>
                <div class="bg-green-50 p-4 rounded-lg">
                    <div class="text-gray-600 font-medium mb-2">回帰式 (近似直線)</div>
                    <div class="text-lg font-mono text-center bg-white py-2 rounded border border-green-200 text-green-800">
                        y = ${regression.slope.toFixed(2)}x ${regression.intercept >= 0 ? '+' : '-'} ${Math.abs(regression.intercept).toFixed(2)}
                    </div>
                    <p class="text-xs text-gray-500 mt-2 text-center">
                        x: ${xLabel}, y: ${yLabel}
                    </p>
                </div>
            </div>

            <div>
                <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">予測シミュレーター</h3>
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label class="block text-sm font-medium text-gray-700 mb-1">${xLabel} を入力:</label>
                    <div class="flex items-center space-x-2">
                        <input 
                            type="number" 
                            value=${predictInput}
                            onInput=${(e) => setPredictInput(e.target.value)}
                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            placeholder="数値を入力"
                        />
                        <span class="text-gray-400">→</span>
                        <div class="w-full bg-white border border-gray-300 rounded-md p-2 text-center font-bold text-gray-800 h-10 flex items-center justify-center">
                            ${predictedValue !== null ? predictedValue : "-"}
                        </div>
                    </div>
                    <p class="text-xs text-gray-500 mt-2 text-right">予想される ${yLabel}</p>
                </div>
            </div>
        </div>
    `;
};

// --- Main App Component ---

const App = () => {
    // State: Mode
    const [mode, setMode] = useState('exploration'); // 'exploration' | 'drill'
    
    // State: Datasets (Start with presets, allow adding more)
    const [availableDatasets, setAvailableDatasets] = useState(DATASETS);
    const [datasetId, setDatasetId] = useState(DATASETS[0].id);
    
    // State: Columns
    const [xKey, setXKey] = useState(DATASETS[0].columns[0].key);
    const [yKey, setYKey] = useState(DATASETS[0].columns[1].key);
    
    // State: Selection (Excluded Data Points)
    const [excludedIds, setExcludedIds] = useState([]);

    // State: UI
    const [showDataWindow, setShowDataWindow] = useState(false);
    const [showInputModal, setShowInputModal] = useState(false);
    
    // State: Drill
    const [currentQuestIndex, setCurrentQuestIndex] = useState(0);
    const [drillFeedback, setDrillFeedback] = useState(null);

    // Derived Data
    const dataset = useMemo(() => 
        availableDatasets.find(d => d.id === datasetId) || availableDatasets[0], 
    [datasetId, availableDatasets]);
    
    const xColumn = useMemo(() => dataset.columns.find(c => c.key === xKey) || dataset.columns[0], [dataset, xKey]);
    const yColumn = useMemo(() => dataset.columns.find(c => c.key === yKey) || dataset.columns[1], [dataset, yKey]);
    
    // Statistics Calculation (Active data only)
    const stats = useMemo(() => {
        const activeData = dataset.data.filter(d => !excludedIds.includes(d.id));
        const xData = activeData.map(d => d[xColumn.key]);
        const yData = activeData.map(d => d[yColumn.key]);
        
        // Handle empty selection
        if (xData.length === 0) {
            return { 
                correlation: 0, regression: { slope: 0, intercept: 0 }, strength: "データなし", activeCount: 0,
                xStats: { min: 0, max: 0, mean: 0 }, yStats: { min: 0, max: 0, mean: 0 }
            };
        }

        const r = MathUtils.calculateCorrelation(xData, yData);
        const reg = MathUtils.calculateRegression(xData, yData);
        const str = MathUtils.getCorrelationStrength(r);
        
        // Basic stats for variables (useful for selection context)
        const calcStats = (arr) => ({
            min: Math.min(...arr),
            max: Math.max(...arr),
            mean: MathUtils.calculateMean(arr)
        });

        return { 
            correlation: r, 
            regression: reg, 
            strength: str, 
            activeCount: xData.length,
            xStats: calcStats(xData),
            yStats: calcStats(yData)
        };
    }, [dataset, xColumn, yColumn, excludedIds]);

    // Handlers
    const togglePoint = (id) => {
        setExcludedIds(prev => 
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleSwapAxes = () => {
        setXKey(yKey);
        setYKey(xKey);
    };

    const handleImportData = (name, csvText) => {
        const lines = csvText.trim().split(/\r?\n/).filter(l => l.trim() !== "");
        if (lines.length < 2) {
            alert("データは少なくとも2行（見出し＋データ）必要です");
            return;
        }

        const headers = lines[0].split(",").map(h => h.trim());
        const columns = headers.map((h, i) => ({ 
            key: `col_${i}`, 
            label: h, 
            type: 'number' 
        }));

        const rawData = lines.slice(1).map((line, idx) => {
            const values = line.split(",").map(v => v.trim());
            const row = { id: idx + 1 };
            columns.forEach((col, i) => {
                const val = parseFloat(values[i]);
                row[col.key] = isNaN(val) ? 0 : val;
            });
            return row;
        });

        const newDataset = {
            id: `custom_${Date.now()}`,
            name: name,
            description: "ユーザーが作成したカスタムデータセット",
            columns: columns,
            data: rawData
        };

        setAvailableDatasets([...availableDatasets, newDataset]);
        setDatasetId(newDataset.id);
        setShowInputModal(false);
        setExcludedIds([]);
    };

    const handleDrillSubmit = () => {
        const quest = DRILL_QUESTS[currentQuestIndex];
        let isCorrect = false;

        if (quest.datasetId === datasetId) {
             if (quest.expectedCorrelation === "strong_positive" && stats.strength === "強い正の相関") isCorrect = true;
             if (quest.expectedCorrelation === "negative" && stats.strength.includes("負")) isCorrect = true;
        }

        if (isCorrect) {
            setDrillFeedback('correct');
        } else {
            setDrillFeedback('incorrect');
        }
    };

    const nextQuest = () => {
        setDrillFeedback(null);
        if (currentQuestIndex < DRILL_QUESTS.length - 1) {
            setCurrentQuestIndex(prev => prev + 1);
        } else {
            alert("全クエストクリア！おめでとう！");
            setMode('exploration');
            setCurrentQuestIndex(0);
        }
    };

    // Auto-select first columns & reset selection when dataset changes
    useEffect(() => {
        if (!dataset.columns.find(c => c.key === xKey)) setXKey(dataset.columns[0].key);
        if (!dataset.columns.find(c => c.key === yKey)) setYKey(dataset.columns.length > 1 ? dataset.columns[1].key : dataset.columns[0].key);
        setExcludedIds([]); // Reset filters
    }, [datasetId, dataset]);

    return html`
        <div class="h-full flex flex-col bg-gray-50">
            <!-- Header -->
            <header class="bg-white border-b border-gray-200 px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row justify-between items-center shadow-sm z-10 gap-3">
                <div class="flex items-center space-x-3 md:space-x-4 w-full md:w-auto">
                    <div class="bg-indigo-600 text-white p-1.5 md:p-2 rounded-lg flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    </div>
                    <div class="min-w-0">
                        <h1 class="text-lg md:text-xl font-bold text-gray-900 truncate">Data Analysis</h1>
                        <p class="text-xs text-gray-500 truncate">データの活用・分析学習ツール</p>
                    </div>
                </div>
                
                <div class="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto">
                    <button 
                        class="flex-1 md:flex-none px-3 py-1.5 md:px-4 md:py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${mode === 'exploration' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}"
                        onClick=${() => { setMode('exploration'); setDrillFeedback(null); }}
                    >
                        自由研究
                    </button>
                    <button 
                        class="flex-1 md:flex-none px-3 py-1.5 md:px-4 md:py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${mode === 'drill' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}"
                        onClick=${() => { setMode('drill'); setDrillFeedback(null); }}
                    >
                        ドリル
                    </button>
                </div>
            </header>

            <!-- Drill Mode Controller -->
            ${mode === 'drill' && html`
                <div class="bg-orange-50 border-b border-orange-200 px-4 py-3 md:px-6 md:py-4 flex-shrink-0">
                    <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                        <div>
                            <span class="inline-block px-2 py-1 bg-orange-200 text-orange-800 text-xs font-bold rounded mb-1">Quest ${currentQuestIndex + 1}/${DRILL_QUESTS.length}</span>
                            <h2 class="text-base md:text-lg font-bold text-gray-800 leading-tight">${DRILL_QUESTS[currentQuestIndex].text}</h2>
                            <p class="text-xs md:text-sm text-gray-600 mt-1">💡 ヒント: ${DRILL_QUESTS[currentQuestIndex].hint}</p>
                        </div>
                        <div class="flex items-center space-x-4 w-full md:w-auto justify-end">
                            ${drillFeedback === 'correct' ? html`
                                <div class="flex items-center text-green-600 font-bold animate-bounce text-sm md:text-base">
                                    <span class="text-lg md:text-2xl mr-1 md:mr-2">◎</span> 正解！
                                </div>
                                <button onClick=${nextQuest} class="px-3 py-1.5 md:px-4 md:py-2 bg-orange-600 text-white text-sm rounded shadow hover:bg-orange-700">次へ</button>
                            ` : drillFeedback === 'incorrect' ? html`
                                <div class="text-red-600 font-bold mr-2 text-sm md:text-base">
                                    <span class="text-lg md:text-xl mr-1">×</span> 違うよ
                                </div>
                                <button onClick=${handleDrillSubmit} class="px-3 py-1.5 md:px-4 md:py-2 bg-white border border-orange-300 text-orange-700 text-sm rounded shadow hover:bg-orange-50">回答</button>
                            ` : html`
                                <button onClick=${handleDrillSubmit} class="px-3 py-1.5 md:px-4 md:py-2 bg-orange-600 text-white text-sm rounded shadow hover:bg-orange-700">回答する</button>
                            `}
                        </div>
                    </div>
                </div>
            `}

            <!-- Main Area -->
            <main class="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden p-4 md:p-6 gap-4 md:gap-6 max-w-[1600px] w-full mx-auto">
                
                <!-- Left Column: Controls -->
                <aside class="w-full lg:w-80 flex-shrink-0 flex flex-col gap-4">
                    <${Card} title="データ設定" className="flex-none">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">データソース</label>
                                <select 
                                    class="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-gray-50"
                                    value=${datasetId}
                                    onChange=${(e) => setDatasetId(e.target.value)}
                                >
                                    ${availableDatasets.map(d => html`<option key=${d.id} value=${d.id}>${d.name}</option>`)}
                                </select>
                                <p class="mt-2 text-xs text-gray-500 leading-snug">${dataset.description}</p>
                            </div>

                            <button 
                                onClick=${() => setShowInputModal(true)}
                                class="w-full flex items-center justify-center px-4 py-2 border border-dashed border-indigo-300 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md text-sm font-medium transition-colors"
                            >
                                ＋ 自分でデータを作る
                            </button>

                            <button 
                                onClick=${() => setShowDataWindow(!showDataWindow)}
                                class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                ${showDataWindow ? 'データ一覧を閉じる' : 'データ一覧・選択'}
                            </button>
                            <p class="text-xs text-gray-400 text-center">※ グラフ上の点をクリックして一時的に除外可能</p>
                        </div>
                    </${Card}>

                    <${Card} title="変数選択" className="flex-1">
                        <div class="space-y-4">
                            <div class="p-3 bg-blue-50 rounded-md border border-blue-100">
                                <label class="block text-sm font-bold text-blue-800 mb-1">X軸 (説明変数)</label>
                                <select 
                                    class="block w-full border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                    value=${xKey}
                                    onChange=${(e) => setXKey(e.target.value)}
                                >
                                    ${dataset.columns.map(c => html`<option key=${c.key} value=${c.key}>${c.label}</option>`)}
                                </select>
                                <div class="mt-2 text-xs text-blue-700 flex justify-between px-1">
                                    <span>Min: ${stats.xStats.min}</span>
                                    <span>Avg: ${stats.xStats.mean.toFixed(1)}</span>
                                    <span>Max: ${stats.xStats.max}</span>
                                </div>
                            </div>

                            <div class="flex justify-center items-center">
                                <button 
                                    onClick=${handleSwapAxes}
                                    class="p-2 rounded-full hover:bg-gray-100 border border-gray-200 text-gray-500 transition-transform active:scale-95"
                                    title="軸を入れ替える"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10l5-6 5 6"/><path d="M17 14l-5 6-5-6"/></svg>
                                </button>
                            </div>

                            <div class="p-3 bg-green-50 rounded-md border border-green-100">
                                <label class="block text-sm font-bold text-green-800 mb-1">Y軸 (目的変数)</label>
                                <select 
                                    class="block w-full border-green-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm p-2 border"
                                    value=${yKey}
                                    onChange=${(e) => setYKey(e.target.value)}
                                >
                                    ${dataset.columns.map(c => html`<option key=${c.key} value=${c.key}>${c.label}</option>`)}
                                </select>
                                <div class="mt-2 text-xs text-green-700 flex justify-between px-1">
                                    <span>Min: ${stats.yStats.min}</span>
                                    <span>Avg: ${stats.yStats.mean.toFixed(1)}</span>
                                    <span>Max: ${stats.yStats.max}</span>
                                </div>
                            </div>
                        </div>
                    </${Card}>
                </aside>

                <!-- Center Column: Visualization -->
                <section class="flex-1 flex flex-col min-w-0">
                    <${Card} className="h-full min-h-[400px] lg:min-h-0">
                        <div class="h-full flex flex-col">
                            <div class="flex justify-between items-center mb-4 px-2">
                                <h2 class="font-bold text-gray-800 text-lg">散布図と回帰直線</h2>
                                <div class="flex items-center gap-4 text-xs md:text-sm">
                                    <div class="flex items-center"><span class="w-2 h-2 md:w-3 md:h-3 bg-indigo-500 rounded-full mr-1 md:mr-2"></span>実測値</div>
                                    <div class="flex items-center"><span class="w-2 h-2 md:w-3 md:h-3 bg-gray-300 rounded-full mr-1 md:mr-2"></span>除外値</div>
                                    <div class="flex items-center"><span class="w-4 h-1 md:w-8 bg-orange-500 mr-1 md:mr-2"></span>回帰直線</div>
                                </div>
                            </div>
                            <div class="flex-1 w-full min-h-0 relative">
                                <${ScatterVis} 
                                    data=${dataset.data} 
                                    xConfig=${xColumn} 
                                    yConfig=${yColumn} 
                                    regression=${stats.regression}
                                    excludedIds=${excludedIds}
                                    onTogglePoint=${togglePoint}
                                />
                            </div>
                        </div>
                    </${Card}>
                </section>

                <!-- Right Column: Analysis -->
                <aside class="w-full lg:w-72 flex-shrink-0">
                    <${Card} title="分析結果" className="h-full">
                        <${AnalysisPanel} 
                            xLabel=${xColumn.label}
                            yLabel=${yColumn.label}
                            correlation=${stats.correlation}
                            regression=${stats.regression}
                            strength=${stats.strength}
                            activeCount=${stats.activeCount}
                            totalCount=${dataset.data.length}
                        />
                    </${Card}>
                </aside>

            </main>

            <!-- Floating Window -->
            ${showDataWindow && html`
                <${FloatingDataWindow} 
                    data=${dataset.data} 
                    columns=${dataset.columns} 
                    excludedIds=${excludedIds}
                    onTogglePoint=${togglePoint}
                    onClose=${() => setShowDataWindow(false)} 
                />
            `}
            
            <!-- Input Modal -->
            ${showInputModal && html`
                <${DataInputModal} 
                    onClose=${() => setShowInputModal(false)}
                    onImport=${handleImportData}
                />
            `}
        </div>
    `;
};

// Mount App
const root = createRoot(document.getElementById('root'));
root.render(html`<${App} />`);