import { useRef, useState, useEffect, useCallback, type JSX } from "react";

interface Rect { x: number; y: number; w: number; h: number; }
interface Frame { id: string; dataUrl: string; croppedUrl: string | null; }
type HandleType = 'nw' | 'n' | 'ne' | 'w' | 'e' | 'sw' | 's' | 'se';
type OcrSubStep = 'select' | 'grid' | 'result';

interface PreprocessOpts {
    grayscale: boolean;
    invert: boolean;
    threshold: boolean;
    thresholdValue: number; // 0–255
    contrast: number;       // -100 to 100
    brightness: number;     // -100 to 100
}

const DEFAULT_PREPROCESS: PreprocessOpts = { grayscale: false, invert: false, threshold: false, thresholdValue: 128, contrast: 0, brightness: 0 };

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${m}:${String(s).padStart(2, '0')}.${ms}`;
}

async function preprocessImage(src: string, opts: PreprocessOpts): Promise<string> {
    if (!opts.grayscale && !opts.invert && !opts.threshold && opts.contrast === 0 && opts.brightness === 0) return src;
    const img = await loadImage(src);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = imageData.data;
    const cf = opts.contrast !== 0 ? (259 * (opts.contrast + 255)) / (255 * (259 - opts.contrast)) : 1;
    const bd = opts.brightness * 2.55;
    for (let i = 0; i < d.length; i += 4) {
        let r = d[i], g = d[i + 1], b = d[i + 2];
        if (opts.brightness !== 0) {
            r = Math.max(0, Math.min(255, r + bd));
            g = Math.max(0, Math.min(255, g + bd));
            b = Math.max(0, Math.min(255, b + bd));
        }
        if (opts.contrast !== 0) {
            r = Math.max(0, Math.min(255, cf * (r - 128) + 128));
            g = Math.max(0, Math.min(255, cf * (g - 128) + 128));
            b = Math.max(0, Math.min(255, cf * (b - 128) + 128));
        }
        if (opts.grayscale || opts.threshold) {
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;
            r = g = b = gray;
        }
        if (opts.threshold) {
            const v = r >= opts.thresholdValue ? 255 : 0;
            r = g = b = v;
        }
        if (opts.invert) { r = 255 - r; g = 255 - g; b = 255 - b; }
        d[i] = r; d[i + 1] = g; d[i + 2] = b;
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/png');
}

async function cropDataUrl(src: string, rect: Rect): Promise<string> {
    const img = await loadImage(src);
    const sx = Math.max(0, rect.x);
    const sy = Math.max(0, rect.y);
    const sw = Math.min(rect.w, img.naturalWidth - sx);
    const sh = Math.min(rect.h, img.naturalHeight - sy);
    if (sw <= 0 || sh <= 0) return src;
    const canvas = document.createElement("canvas");
    canvas.width = sw; canvas.height = sh;
    canvas.getContext("2d")!.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    return canvas.toDataURL("image/png");
}

const HANDLES: { type: HandleType; cx: (r: Rect) => number; cy: (r: Rect) => number; cursor: string }[] = [
    { type: 'nw', cx: r => r.x,           cy: r => r.y,           cursor: 'nw-resize' },
    { type: 'n',  cx: r => r.x + r.w / 2, cy: r => r.y,           cursor: 'n-resize'  },
    { type: 'ne', cx: r => r.x + r.w,     cy: r => r.y,           cursor: 'ne-resize' },
    { type: 'w',  cx: r => r.x,           cy: r => r.y + r.h / 2, cursor: 'w-resize'  },
    { type: 'e',  cx: r => r.x + r.w,     cy: r => r.y + r.h / 2, cursor: 'e-resize'  },
    { type: 'sw', cx: r => r.x,           cy: r => r.y + r.h,     cursor: 'sw-resize' },
    { type: 's',  cx: r => r.x + r.w / 2, cy: r => r.y + r.h,     cursor: 's-resize'  },
    { type: 'se', cx: r => r.x + r.w,     cy: r => r.y + r.h,     cursor: 'se-resize' },
];

const HANDLE_SIZE = 8;
const BTN = "px-3 py-1.5 rounded-lg bg-surface-1 border border-border text-sm text-foreground hover:bg-surface-2 transition-colors";
const BTN_DISABLED = `${BTN} disabled:opacity-40 disabled:cursor-not-allowed`;
const FPS = 30;
const BASE_CROP_WIDTH = 900;

// Reusable crop-rect overlay contents (dim + border + handles)
function CropOverlayContents({ dc, onStartResize }: {
    dc: Rect;
    onStartResize: (h: HandleType, e: React.MouseEvent) => void;
}) {
    return (
        <>
            <div className="absolute inset-0 bg-black/40 pointer-events-none" style={{
                clipPath: `polygon(0 0,100% 0,100% 100%,0 100%,0 0,${dc.x}px ${dc.y}px,${dc.x}px ${dc.y + dc.h}px,${dc.x + dc.w}px ${dc.y + dc.h}px,${dc.x + dc.w}px ${dc.y}px,${dc.x}px ${dc.y}px)`,
            }} />
            <div className="absolute" style={{ left: dc.x, top: dc.y, width: dc.w, height: dc.h, cursor: 'move' }} />
            <div className="absolute pointer-events-none border border-white/80" style={{ left: dc.x, top: dc.y, width: dc.w, height: dc.h }} />
            {HANDLES.map(h => (
                <div key={h.type} onMouseDown={e => onStartResize(h.type, e)} style={{
                    position: 'absolute',
                    left: h.cx(dc) - HANDLE_SIZE / 2, top: h.cy(dc) - HANDLE_SIZE / 2,
                    width: HANDLE_SIZE, height: HANDLE_SIZE,
                    cursor: h.cursor, background: 'white',
                    border: '1px solid rgba(0,0,0,0.5)', boxSizing: 'border-box',
                }} />
            ))}
        </>
    );
}

export default function Cropper(): JSX.Element {
    const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const [frames, setFrames] = useState<Frame[]>([]);
    const [order, setOrder] = useState<string[]>([]);

    // step 2
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1);
    const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
    const [cropRect, setCropRect] = useState<Rect | null>(null);
    const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
    const [activeHandle, setActiveHandle] = useState<HandleType | null>(null);
    const [resizeAnchor, setResizeAnchor] = useState({ x: 0, y: 0 });
    const [resizeBaseRect, setResizeBaseRect] = useState<Rect | null>(null);
    const [moveState, setMoveState] = useState<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

    // step 1 scrubber
    const [videoDuration, setVideoDuration] = useState(0);
    const [videoCurrentTime, setVideoCurrentTime] = useState(0);

    // step 3
    const dragItemId = useRef<string | null>(null);
    const [dragOverId, setDragOverId] = useState<string | null>(null);

    // step 4
    const [ocrSubStep, setOcrSubStep] = useState<OcrSubStep>('select');
    const [stackedUrl, setStackedUrl] = useState<string | null>(null);
    const [stackBuilding, setStackBuilding] = useState(false);
    const [ocrRect, setOcrRect] = useState<Rect | null>(null);
    const [ocrGridCols, setOcrGridCols] = useState(3);
    const [ocrGridRows, setOcrGridRows] = useState(3);
    const [colDividers, setColDividers] = useState<number[]>([]);
    const [rowDividers, setRowDividers] = useState<number[]>([]);
    const [ocrTable, setOcrTable] = useState<string[][] | null>(null);
    const [ocrLoading, setOcrLoading] = useState(false);
    const [ocrProgress, setOcrProgress] = useState('');
    const [ocrZoom, setOcrZoom] = useState(1);
    const [ocrNaturalSize, setOcrNaturalSize] = useState({ w: 0, h: 0 });
    const [ocrDrawStart, setOcrDrawStart] = useState<{ x: number; y: number } | null>(null);
    const [ocrActiveHandle, setOcrActiveHandle] = useState<HandleType | null>(null);
    const [ocrResizeAnchor, setOcrResizeAnchor] = useState({ x: 0, y: 0 });
    const [ocrResizeBaseRect, setOcrResizeBaseRect] = useState<Rect | null>(null);
    const [ocrMoveState, setOcrMoveState] = useState<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
    const [draggingDivider, setDraggingDivider] = useState<{ axis: 'col' | 'row'; idx: number } | null>(null);
    const [preprocess, setPreprocess] = useState<PreprocessOpts>(DEFAULT_PREPROCESS);
    const [preprocessedUrl, setPreprocessedUrl] = useState<string | null>(null);
    const [preprocessedStackUrl, setPreprocessedStackUrl] = useState<string | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const cropImgRef = useRef<HTMLImageElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const ocrImgRef = useRef<HTMLImageElement>(null);

    // ── Step 1 ───────────────────────────────────────────────────────────────

    const handleVideoFile = useCallback((file: File) => {
        if (!file.type.startsWith("video/")) return;
        setVideoSrc(URL.createObjectURL(file));
        setFrames([]); setOrder([]); setCropRect(null); setSelectedId(null);
    }, []);

    const captureFrame = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth; canvas.height = video.videoHeight;
        canvas.getContext("2d")!.drawImage(video, 0, 0);
        const id = crypto.randomUUID();
        setFrames(prev => [...prev, { id, dataUrl: canvas.toDataURL("image/png"), croppedUrl: null }]);
        setOrder(prev => [...prev, id]);
    }, []);

    const jogVideo = useCallback((dir: 1 | -1) => {
        const v = videoRef.current;
        if (!v) return;
        v.pause();
        v.currentTime = Math.max(0, Math.min(v.duration, v.currentTime + dir / FPS));
    }, []);

    useEffect(() => {
        if (step !== 1) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") jogVideo(1);
            else if (e.key === "ArrowLeft") jogVideo(-1);
            else if (e.key === " ") { e.preventDefault(); const v = videoRef.current; if (v) v.paused ? v.play() : v.pause(); }
            else if (e.key === "s" || e.key === "S") captureFrame();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [step, jogVideo, captureFrame]);

    const goToStep = (n: 1 | 2 | 3 | 4 | 5) => {
        if (n === 4 && frames.length > 0) {
            setStackedUrl(null); setPreprocessedStackUrl(null); setPreprocessedUrl(null);
            setPreprocess(DEFAULT_PREPROCESS);
            setStackBuilding(true);
            buildStackDataUrl(frames, order).then(url => { setStackedUrl(url); setStackBuilding(false); });
        }
        if (n === 5) {
            setOcrRect(null); setOcrSubStep('select');
            setOcrNaturalSize({ w: 0, h: 0 }); setColDividers([]); setRowDividers([]); setOcrTable(null); setOcrZoom(1);
        }
        setStep(n);
    };

    const goToOcr = async () => {
        if (!stackedUrl) return;
        const url = await preprocessImage(stackedUrl, preprocess);
        setPreprocessedStackUrl(url);
        setOcrRect(null); setOcrSubStep('select');
        setOcrNaturalSize({ w: 0, h: 0 }); setColDividers([]); setRowDividers([]); setOcrTable(null); setOcrZoom(1);
        setStep(5);
    };

    const goToStep2 = (firstId: string) => {
        setSelectedId(firstId); setZoom(1); setCropRect(null); setStep(2);
    };

    // ── Step 2 ───────────────────────────────────────────────────────────────

    const selectedFrame = frames.find(f => f.id === selectedId) ?? null;
    const currentImageUrl = selectedFrame ? (selectedFrame.croppedUrl ?? selectedFrame.dataUrl) : null;
    const displayWidth = naturalSize.w > 0 ? Math.min(naturalSize.w, BASE_CROP_WIDTH) * zoom : 0;
    const displayHeight = naturalSize.w > 0 ? displayWidth * naturalSize.h / naturalSize.w : 0;
    const scale = displayWidth > 0 ? displayWidth / naturalSize.w : 1;
    const displayCrop = cropRect && scale > 0
        ? { x: cropRect.x * scale, y: cropRect.y * scale, w: cropRect.w * scale, h: cropRect.h * scale }
        : null;

    const onCropImageLoad = () => {
        const img = cropImgRef.current;
        if (!img) return;
        setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
        setCropRect(null);
    };

    const relPos = (e: React.MouseEvent) => {
        const r = overlayRef.current!.getBoundingClientRect();
        return { x: Math.max(0, Math.min(e.clientX - r.left, displayWidth)), y: Math.max(0, Math.min(e.clientY - r.top, displayHeight)) };
    };


    const onOverlayMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        const { x, y } = relPos(e);
        const nx = x / scale, ny = y / scale;
        if (cropRect && nx >= cropRect.x && nx <= cropRect.x + cropRect.w && ny >= cropRect.y && ny <= cropRect.y + cropRect.h) {
            setMoveState({ startX: nx, startY: ny, origX: cropRect.x, origY: cropRect.y }); return;
        }
        setDrawStart({ x, y }); setCropRect(null); setMoveState(null); setActiveHandle(null);
    };

    const applyResizeMove = (
        x: number, y: number,
        sc: number, natW: number, natH: number,
        move: typeof moveState, rect: Rect | null,
        handle: HandleType | null, anchor: { x: number; y: number }, base: Rect | null,
        ds: { x: number; y: number } | null,
        setRect: (r: Rect) => void,
    ) => {
        const nx = x / sc, ny = y / sc;
        if (move && rect) {
            setRect({
                ...rect,
                x: Math.round(Math.max(0, Math.min(move.origX + nx - move.startX, natW - rect.w))),
                y: Math.round(Math.max(0, Math.min(move.origY + ny - move.startY, natH - rect.h))),
            }); return;
        }
        if (handle && base) {
            const ax = anchor.x, ay = anchor.y, br = base;
            let x1: number, y1: number, x2: number, y2: number;
            switch (handle) {
                case 'nw': [x1, y1, x2, y2] = [nx, ny, ax, ay]; break;
                case 'ne': [x1, y1, x2, y2] = [ax, ny, nx, ay]; break;
                case 'sw': [x1, y1, x2, y2] = [nx, ay, ax, ny]; break;
                case 'se': [x1, y1, x2, y2] = [ax, ay, nx, ny]; break;
                case 'n':  [x1, y1, x2, y2] = [br.x, ny, br.x + br.w, ay]; break;
                case 's':  [x1, y1, x2, y2] = [br.x, ay, br.x + br.w, ny]; break;
                case 'w':  [x1, y1, x2, y2] = [nx, br.y, ax, br.y + br.h]; break;
                case 'e':  [x1, y1, x2, y2] = [ax, br.y, nx, br.y + br.h]; break;
                default: return;
            }
            setRect({ x: Math.round(Math.max(0, Math.min(x1, x2))), y: Math.round(Math.max(0, Math.min(y1, y2))), w: Math.round(Math.max(1, Math.abs(x2 - x1))), h: Math.round(Math.max(1, Math.abs(y2 - y1))) });
            return;
        }
        if (ds) {
            const { x: nx1, y: ny1 } = { x: Math.round(Math.min(x, ds.x) / sc), y: Math.round(Math.min(y, ds.y) / sc) };
            const { x: nx2, y: ny2 } = { x: Math.round(Math.max(x, ds.x) / sc), y: Math.round(Math.max(y, ds.y) / sc) };
            setRect({ x: nx1, y: ny1, w: nx2 - nx1, h: ny2 - ny1 });
        }
    };

    const onOverlayMouseMove = (e: React.MouseEvent) => {
        const { x, y } = relPos(e);
        applyResizeMove(x, y, scale, naturalSize.w, naturalSize.h, moveState, cropRect, activeHandle, resizeAnchor, resizeBaseRect, drawStart, setCropRect);
    };

    const stopAll = () => { setDrawStart(null); setActiveHandle(null); setMoveState(null); setResizeBaseRect(null); };

    const startResize = (handle: HandleType, e: React.MouseEvent, rect: Rect, setHandle: (h: HandleType) => void, setAnchor: (a: { x: number; y: number }) => void, setBase: (r: Rect) => void, clearDraw: () => void, clearMove: () => void) => {
        e.stopPropagation(); e.preventDefault();
        const x2 = rect.x + rect.w, y2 = rect.y + rect.h;
        const anchors: Record<HandleType, { x: number; y: number }> = {
            nw: { x: x2, y: y2 }, ne: { x: rect.x, y: y2 }, sw: { x: x2, y: rect.y }, se: { x: rect.x, y: rect.y },
            n: { x: 0, y: y2 }, s: { x: 0, y: rect.y }, w: { x: x2, y: 0 }, e: { x: rect.x, y: 0 },
        };
        setHandle(handle); setAnchor(anchors[handle]); setBase({ ...rect }); clearDraw(); clearMove();
    };

    const overlayCursor = activeHandle ? `${activeHandle}-resize` : moveState ? 'move' : 'crosshair';

    const applyCrop = useCallback(async (toAll: boolean) => {
        if (!cropRect || cropRect.w < 2 || cropRect.h < 2) return;
        if (toAll) {
            const updated = await Promise.all(frames.map(async f => ({ ...f, croppedUrl: await cropDataUrl(f.croppedUrl ?? f.dataUrl, cropRect) })));
            setFrames(updated);
        } else if (selectedId && currentImageUrl) {
            const url = await cropDataUrl(currentImageUrl, cropRect);
            setFrames(prev => prev.map(f => f.id === selectedId ? { ...f, croppedUrl: url } : f));
        }
        setCropRect(null);
    }, [cropRect, frames, selectedId, currentImageUrl]);

    const resetCrop = (id: string) => { setFrames(prev => prev.map(f => f.id === id ? { ...f, croppedUrl: null } : f)); setCropRect(null); };
    const selectFrame = (id: string) => { setSelectedId(id); setCropRect(null); setZoom(1); };

    // ── Step 3 ───────────────────────────────────────────────────────────────

    const onDragOver = (e: React.DragEvent, id: string) => { e.preventDefault(); setDragOverId(id); };

    const onDrop = (targetId: string) => {
        const srcId = dragItemId.current;
        if (!srcId || srcId === targetId) { setDragOverId(null); return; }
        setOrder(prev => {
            const next = [...prev];
            const fi = next.indexOf(srcId), ti = next.indexOf(targetId);
            next.splice(fi, 1); next.splice(ti, 0, srcId);
            return next;
        });
        setDragOverId(null); dragItemId.current = null;
    };

    const buildStackDataUrl = async (currentFrames: Frame[], currentOrder: string[]): Promise<string> => {
        const ordered = currentOrder.map(id => currentFrames.find(f => f.id === id)).filter((f): f is Frame => !!f);
        const images = await Promise.all(ordered.map(f => loadImage(f.croppedUrl ?? f.dataUrl)));
        const maxW = Math.max(...images.map(i => i.naturalWidth));
        const totalH = images.reduce((s, i) => s + i.naturalHeight, 0);
        const canvas = document.createElement("canvas");
        canvas.width = maxW; canvas.height = totalH;
        const ctx = canvas.getContext("2d")!;
        let y = 0;
        for (const img of images) { ctx.drawImage(img, 0, y); y += img.naturalHeight; }
        return canvas.toDataURL("image/png");
    };

    const downloadStack = async () => {
        const url = await buildStackDataUrl(frames, order);
        const a = document.createElement("a");
        a.href = url; a.download = "stacked.png"; a.click();
    };

    // ── Step 4 ───────────────────────────────────────────────────────────────

    const ocrSourceUrl = preprocessedStackUrl ?? stackedUrl;
    const ocrDisplayWidth = ocrNaturalSize.w > 0 ? Math.min(ocrNaturalSize.w, BASE_CROP_WIDTH) * ocrZoom : 0;
    const ocrDisplayHeight = ocrNaturalSize.w > 0 ? ocrDisplayWidth * ocrNaturalSize.h / ocrNaturalSize.w : 0;
    const ocrScale = ocrDisplayWidth > 0 ? ocrDisplayWidth / ocrNaturalSize.w : 1;
    const ocrDisplayRect = ocrRect && ocrScale > 0
        ? { x: ocrRect.x * ocrScale, y: ocrRect.y * ocrScale, w: ocrRect.w * ocrScale, h: ocrRect.h * ocrScale }
        : null;

    const onOcrImageLoad = () => {
        const img = ocrImgRef.current;
        if (!img) return;
        setOcrNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    };

    // Debounced preprocessing preview — regenerates whenever options or source change
    useEffect(() => {
        if (!ocrSourceUrl) { setPreprocessedUrl(null); return; }
        const isNoop = !preprocess.grayscale && !preprocess.invert && !preprocess.threshold && preprocess.contrast === 0 && preprocess.brightness === 0;
        if (isNoop) { setPreprocessedUrl(null); return; }
        let cancelled = false;
        const timer = setTimeout(async () => {
            const url = await preprocessImage(ocrSourceUrl, preprocess);
            if (!cancelled) setPreprocessedUrl(url);
        }, 250);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [preprocess, ocrSourceUrl]);

    const ocrRelPos = (e: React.MouseEvent) => {
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        return { x: Math.max(0, Math.min(e.clientX - r.left, ocrDisplayWidth)), y: Math.max(0, Math.min(e.clientY - r.top, ocrDisplayHeight)) };
    };

    const onOcrOverlayMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        const { x, y } = ocrRelPos(e);
        const nx = x / ocrScale, ny = y / ocrScale;
        if (ocrRect && nx >= ocrRect.x && nx <= ocrRect.x + ocrRect.w && ny >= ocrRect.y && ny <= ocrRect.y + ocrRect.h) {
            setOcrMoveState({ startX: nx, startY: ny, origX: ocrRect.x, origY: ocrRect.y }); return;
        }
        setOcrDrawStart({ x, y }); setOcrRect(null); setOcrMoveState(null); setOcrActiveHandle(null);
    };

    const onOcrOverlayMouseMove = (e: React.MouseEvent) => {
        const { x, y } = ocrRelPos(e);
        if (ocrSubStep === 'grid' && draggingDivider && ocrRect) {
            const nv = (ocrSubStep === 'grid' && draggingDivider.axis === 'col') ? x / ocrScale : y / ocrScale;
            if (draggingDivider.axis === 'col') {
                const i = draggingDivider.idx;
                const mn = i === 0 ? ocrRect.x + 2 : colDividers[i - 1] + 2;
                const mx = i === colDividers.length - 1 ? ocrRect.x + ocrRect.w - 2 : colDividers[i + 1] - 2;
                setColDividers(p => { const n = [...p]; n[i] = Math.round(Math.max(mn, Math.min(mx, nv))); return n; });
            } else {
                const i = draggingDivider.idx;
                const mn = i === 0 ? ocrRect.y + 2 : rowDividers[i - 1] + 2;
                const mx = i === rowDividers.length - 1 ? ocrRect.y + ocrRect.h - 2 : rowDividers[i + 1] - 2;
                setRowDividers(p => { const n = [...p]; n[i] = Math.round(Math.max(mn, Math.min(mx, nv))); return n; });
            }
            return;
        }
        if (ocrSubStep !== 'select') return;
        applyResizeMove(x, y, ocrScale, ocrNaturalSize.w, ocrNaturalSize.h, ocrMoveState, ocrRect, ocrActiveHandle, ocrResizeAnchor, ocrResizeBaseRect, ocrDrawStart, setOcrRect);
    };

    const stopOcrAll = () => { setOcrDrawStart(null); setOcrActiveHandle(null); setOcrMoveState(null); setOcrResizeBaseRect(null); setDraggingDivider(null); };

    const ocrOverlayCursor = ocrActiveHandle ? `${ocrActiveHandle}-resize` : ocrMoveState ? 'move' : 'crosshair';

    const buildGrid = () => {
        if (!ocrRect || ocrRect.w < 2 || ocrRect.h < 2) return;
        setColDividers(Array.from({ length: ocrGridCols - 1 }, (_, i) => Math.round(ocrRect.x + (i + 1) * ocrRect.w / ocrGridCols)));
        setRowDividers(Array.from({ length: ocrGridRows - 1 }, (_, i) => Math.round(ocrRect.y + (i + 1) * ocrRect.h / ocrGridRows)));
        setOcrSubStep('grid');
    };

    const runOcr = async () => {
        if (!ocrRect || !stackedUrl) return;
        const srcUrl = stackedUrl;
        const rect = ocrRect, cols = ocrGridCols, rows = ocrGridRows;
        const cDivs = [...colDividers], rDivs = [...rowDividers];
        const cellRect = (r: number, c: number): Rect => ({
            x: c === 0 ? rect.x : cDivs[c - 1],
            y: r === 0 ? rect.y : rDivs[r - 1],
            w: (c === cols - 1 ? rect.x + rect.w : cDivs[c]) - (c === 0 ? rect.x : cDivs[c - 1]),
            h: (r === rows - 1 ? rect.y + rect.h : rDivs[r]) - (r === 0 ? rect.y : rDivs[r - 1]),
        });
        setOcrLoading(true);
        try {
            const { default: Tesseract } = await import('tesseract.js');
            const total = rows * cols;
            let done = 0;
            const results: string[][] = Array.from({ length: rows }, () => Array(cols).fill(''));
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    setOcrProgress(`Cell ${++done} / ${total}…`);
                    const cellUrl = await cropDataUrl(srcUrl, cellRect(r, c));
                    const { data: { text } } = await Tesseract.recognize(cellUrl, 'eng');
                    results[r][c] = text.trim();
                }
            }
            setOcrTable(results);
            setOcrSubStep('result');
        } finally {
            setOcrLoading(false); setOcrProgress('');
        }
    };

    const copyTable = (sep: string) => {
        if (!ocrTable) return;
        const text = ocrTable.map(row =>
            sep === ',' ? row.map(c => `"${c.replace(/"/g, '""')}"`).join(',') : row.join('\t')
        ).join('\n');
        navigator.clipboard.writeText(text).catch(() => {});
    };

    // ── Render ────────────────────────────────────────────────────────────────

    const stepLabels = ["Capture", "Crop", "Stack", "Preprocess", "OCR"] as const;

    return (
        <div className="mt-8 max-w-6xl mx-auto flex flex-col gap-6 px-4 pb-16">

            {/* Step indicator */}
            <div className="flex items-center gap-2">
                {stepLabels.map((label, i) => {
                    const n = (i + 1) as 1 | 2 | 3 | 4 | 5;
                    const active = step === n;
                    const disabled = n > 1 && frames.length === 0;
                    return (
                        <div key={n} className="flex items-center gap-2">
                            {i > 0 && <div className="w-8 h-px bg-border" />}
                            <button onClick={() => goToStep(n)} disabled={disabled}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${active ? "bg-surface-2 text-foreground" : "text-muted hover:text-foreground"}`}>
                                <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center ${active ? "bg-foreground text-background" : "bg-surface-1 text-muted"}`}>{n}</span>
                                {label}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* ── Step 1 ───────────────────────────────────────────────────── */}
            {step === 1 && (
                <div className="flex flex-col gap-4">
                    {!videoSrc ? (
                        <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-muted transition-colors"
                            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleVideoFile(f); }}
                            onDragOver={e => e.preventDefault()}>
                            <span className="text-muted text-sm">Drop a video here or click to upload</span>
                            <input type="file" accept="video/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleVideoFile(f); }} />
                        </label>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <video ref={videoRef} src={videoSrc}
                                className="w-full max-h-[55vh] rounded-lg bg-black object-contain cursor-pointer"
                                onClick={() => { const v = videoRef.current; if (v) v.paused ? v.play() : v.pause(); }}
                                onTimeUpdate={e => setVideoCurrentTime(e.currentTarget.currentTime)}
                                onLoadedMetadata={e => { setVideoDuration(e.currentTarget.duration); setVideoCurrentTime(0); }}
                            />
                            {/* Scrubber */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted font-mono w-12 shrink-0 text-right">{formatTime(videoCurrentTime)}</span>
                                <input
                                    type="range" min={0} max={videoDuration || 1} step={1 / FPS}
                                    value={videoCurrentTime} title=""
                                    onChange={e => {
                                        const v = videoRef.current;
                                        if (!v) return;
                                        v.currentTime = +e.target.value;
                                        setVideoCurrentTime(+e.target.value);
                                    }}
                                    className="flex-1 accent-foreground"
                                />
                                <span className="text-xs text-muted font-mono w-12 shrink-0">{formatTime(videoDuration)}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <button className={BTN} onClick={() => { const v = videoRef.current; if (v) v.paused ? v.play() : v.pause(); }}>Play / Pause</button>
                                <button className={BTN} onClick={() => jogVideo(-1)}>← Frame</button>
                                <button className={BTN} onClick={() => jogVideo(1)}>Frame →</button>
                                <button className={`${BTN} font-semibold`} onClick={captureFrame}>Capture frame <span className="text-muted font-normal">(S)</span></button>
                                <label className={`${BTN} cursor-pointer`}>Change video<input type="file" accept="video/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleVideoFile(f); }} /></label>
                                <span className="text-xs text-muted ml-auto">← → to jog · Space to play/pause · S to capture</span>
                            </div>
                            {frames.length > 0 && (
                                <div className="flex flex-col gap-2 rounded-lg border border-border bg-surface-1 p-3">
                                    <span className="text-sm text-muted">{frames.length} frame{frames.length !== 1 ? "s" : ""} captured</span>
                                    <div className="flex gap-2 flex-wrap">
                                        {frames.map((f, i) => (
                                            <div key={f.id} className="relative group">
                                                <img src={f.dataUrl} alt={`frame ${i + 1}`} className="h-16 w-auto rounded border border-border object-cover" />
                                                <button onClick={() => { setFrames(p => p.filter(x => x.id !== f.id)); setOrder(p => p.filter(id => id !== f.id)); }}
                                                    className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/70 text-white text-xs opacity-0 group-hover:opacity-100 flex items-center justify-center leading-none">×</button>
                                            </div>
                                        ))}
                                    </div>
                                    <button className={`${BTN} self-start`} onClick={() => goToStep2(frames[0].id)}>Next: Crop →</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* ── Step 2 ───────────────────────────────────────────────────── */}
            {step === 2 && (
                <div className="flex gap-4 min-h-0">
                    <div className="flex flex-col gap-2 w-24 shrink-0">
                        {frames.map((f, i) => (
                            <button key={f.id} onClick={() => selectFrame(f.id)}
                                className={`relative rounded border-2 overflow-hidden ${f.id === selectedId ? "border-foreground" : "border-border hover:border-muted"}`}>
                                <img src={f.croppedUrl ?? f.dataUrl} alt={`frame ${i + 1}`} className="w-full h-auto block" />
                                {f.croppedUrl && <span className="absolute bottom-0 right-0 bg-black/70 text-white text-[9px] px-1 leading-4">✓</span>}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-col gap-3 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-muted">Zoom:</span>
                            {[1, 1.5, 2, 3, 4].map(z => (
                                <button key={z} onClick={() => setZoom(z)}
                                    className={`px-2 py-0.5 rounded text-xs border transition-colors ${zoom === z ? "border-foreground text-foreground" : "border-border text-muted hover:border-muted"}`}>{z}×</button>
                            ))}
                            {cropRect && cropRect.w > 1 && cropRect.h > 1 && (
                                <span className="text-sm text-muted ml-2 font-mono">{cropRect.w} × {cropRect.h} px at ({cropRect.x}, {cropRect.y})</span>
                            )}
                        </div>
                        {currentImageUrl && (
                            <div className="overflow-auto rounded-lg border border-border bg-black/20 max-h-[65vh]">
                                <div className="relative inline-block select-none" style={{ width: displayWidth, height: displayHeight }}>
                                    <img ref={cropImgRef} src={currentImageUrl} alt="crop source"
                                        style={{ width: displayWidth, height: displayHeight }}
                                        className="block pointer-events-none" onLoad={onCropImageLoad} draggable={false} />
                                    <div ref={overlayRef} className="absolute inset-0" style={{ cursor: overlayCursor }}
                                        onMouseDown={onOverlayMouseDown} onMouseMove={onOverlayMouseMove}
                                        onMouseUp={stopAll} onMouseLeave={stopAll}>
                                        {displayCrop && displayCrop.w > 1 && displayCrop.h > 1 && (
                                            <CropOverlayContents dc={displayCrop} onStartResize={(h, e) =>
                                                startResize(h, e, cropRect!, setActiveHandle, setResizeAnchor, setResizeBaseRect,
                                                    () => setDrawStart(null), () => setMoveState(null))} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-3 flex-wrap">
                            <button className={BTN_DISABLED} disabled={!cropRect || cropRect.w < 2 || cropRect.h < 2} onClick={() => applyCrop(false)}>Crop this image</button>
                            <button className={BTN_DISABLED} disabled={!cropRect || cropRect.w < 2 || cropRect.h < 2} onClick={() => applyCrop(true)}>Crop all images</button>
                            {selectedFrame?.croppedUrl && (
                                <button className="text-sm text-muted hover:text-foreground transition-colors" onClick={() => selectedId && resetCrop(selectedId)}>Reset this image</button>
                            )}
                            <button className={`${BTN} ml-auto`} onClick={() => setStep(3)}>Next: Stack →</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Step 3 ───────────────────────────────────────────────────── */}
            {step === 3 && (
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-muted">Drag to reorder. Images will be stacked top-to-bottom.</p>
                    <div className="flex flex-col gap-2">
                        {order.map(id => {
                            const f = frames.find(fr => fr.id === id);
                            if (!f) return null;
                            return (
                                <div key={id} draggable onDragStart={() => { dragItemId.current = id; }}
                                    onDragOver={e => onDragOver(e, id)} onDrop={() => onDrop(id)}
                                    onDragEnd={() => setDragOverId(null)}
                                    className={`flex items-center gap-3 p-2 rounded-lg border cursor-grab active:cursor-grabbing transition-colors ${dragOverId === id ? "border-foreground bg-surface-2" : "border-border bg-surface-1"}`}>
                                    <span className="text-muted select-none text-lg">⠿</span>
                                    <img src={f.croppedUrl ?? f.dataUrl} alt="" className="h-20 w-auto rounded object-contain" />
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-3">
                        <button className={BTN} onClick={downloadStack}>Download stacked PNG</button>
                        <button className={`${BTN} font-semibold`} onClick={() => goToStep(4)}>Next: Preprocess →</button>
                    </div>
                </div>
            )}

            {/* ── Step 4: Preprocess ───────────────────────────────────────── */}
            {step === 4 && (
                <div className="flex flex-col gap-4">
                    {stackBuilding && <p className="text-sm text-muted">Building stacked image…</p>}
                    {stackedUrl && (
                        <>
                            <div className="flex items-center gap-2 flex-wrap rounded-lg border border-border bg-surface-1 px-3 py-2">
                                <span className="text-xs font-medium text-muted shrink-0">Preprocess:</span>
                                {([ ['grayscale','Grayscale'], ['invert','Invert'], ['threshold','Threshold'] ] as [keyof PreprocessOpts, string][]).map(([key, label]) => (
                                    <label key={key} className="flex items-center gap-1 text-xs cursor-pointer select-none">
                                        <input type="checkbox" checked={preprocess[key] as boolean}
                                            onChange={e => setPreprocess(p => ({ ...p, [key]: e.target.checked }))} />
                                        {label}
                                    </label>
                                ))}
                                {preprocess.threshold && (
                                    <div className="flex items-center gap-1">
                                        <input type="range" min={0} max={255} value={preprocess.thresholdValue}
                                            onChange={e => setPreprocess(p => ({ ...p, thresholdValue: +e.target.value }))}
                                            className="w-24" />
                                        <span className="text-xs text-muted font-mono w-7">{preprocess.thresholdValue}</span>
                                    </div>
                                )}
                                <span className="text-xs text-muted">Brightness</span>
                                <input type="range" min={-100} max={100} value={preprocess.brightness}
                                    onChange={e => setPreprocess(p => ({ ...p, brightness: +e.target.value }))} className="w-20" />
                                <span className="text-xs text-muted font-mono w-8">{preprocess.brightness > 0 ? `+${preprocess.brightness}` : preprocess.brightness}</span>
                                <span className="text-xs text-muted">Contrast</span>
                                <input type="range" min={-100} max={100} value={preprocess.contrast}
                                    onChange={e => setPreprocess(p => ({ ...p, contrast: +e.target.value }))} className="w-20" />
                                <span className="text-xs text-muted font-mono w-8">{preprocess.contrast > 0 ? `+${preprocess.contrast}` : preprocess.contrast}</span>
                                {JSON.stringify(preprocess) !== JSON.stringify(DEFAULT_PREPROCESS) && (
                                    <button className="text-xs text-muted hover:text-foreground" onClick={() => setPreprocess(DEFAULT_PREPROCESS)}>Reset</button>
                                )}
                            </div>
                            <div className="overflow-auto rounded-lg border border-border bg-black/20 max-h-[70vh]">
                                <img src={preprocessedUrl ?? stackedUrl} alt="stacked preview"
                                    className="block h-auto" style={{ maxWidth: '100%' }} />
                            </div>
                            <div className="flex items-center gap-3">
                                <button className={BTN} onClick={() => {
                                    setStackedUrl(null); setPreprocessedUrl(null); setPreprocess(DEFAULT_PREPROCESS);
                                    setStackBuilding(true);
                                    buildStackDataUrl(frames, order).then(url => { setStackedUrl(url); setStackBuilding(false); });
                                }}>Rebuild stack</button>
                                <button className={`${BTN} font-semibold ml-auto`} onClick={goToOcr}>Apply &amp; Next: OCR →</button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* ── Step 5: OCR ──────────────────────────────────────────────── */}
            {step === 5 && (
                <div className="flex flex-col gap-4">
                    {/* Sub-step breadcrumb + phase navigation */}
                    <div className="flex items-center gap-2 text-sm flex-wrap">
                        <span className={ocrSubStep === 'select' ? "text-foreground font-medium" : "text-muted"}>Select area</span>
                        <span className="text-muted">›</span>
                        <span className={ocrSubStep === 'grid' ? "text-foreground font-medium" : "text-muted"}>Adjust grid</span>
                        <span className="text-muted">›</span>
                        <span className={ocrSubStep === 'result' ? "text-foreground font-medium" : "text-muted"}>Results</span>
                        <div className="flex items-center gap-2 ml-auto">
                            {ocrSubStep === 'grid' && (
                                <>
                                    <button className={BTN} onClick={() => setOcrSubStep('select')}>← Back</button>
                                    {ocrLoading
                                        ? <span className="text-muted">{ocrProgress || 'Running OCR…'}</span>
                                        : <button className={`${BTN} font-semibold`} onClick={runOcr}>Run OCR</button>
                                    }
                                </>
                            )}
                            {ocrSubStep === 'result' && (
                                <>
                                    <button className={BTN} onClick={() => setOcrSubStep('grid')}>← Back to grid</button>
                                    <button className={BTN} onClick={() => copyTable(',')}>Copy as CSV</button>
                                    <button className={BTN} onClick={() => copyTable('\t')}>Copy as TSV</button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* ── Select area ────────────────────────────────────── */}
                    {ocrSubStep === 'select' && (
                        <div className="flex flex-col gap-3">
                            {ocrSourceUrl && (
                                <>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-sm text-muted">Zoom:</span>
                                        {[1, 1.5, 2, 3, 4].map(z => (
                                            <button key={z} onClick={() => setOcrZoom(z)}
                                                className={`px-2 py-0.5 rounded text-xs border transition-colors ${ocrZoom === z ? "border-foreground text-foreground" : "border-border text-muted hover:border-muted"}`}>{z}×</button>
                                        ))}
                                        {ocrRect && ocrRect.w > 1 && ocrRect.h > 1 && (
                                            <span className="text-sm text-muted ml-2 font-mono">{ocrRect.w} × {ocrRect.h} px</span>
                                        )}
                                    </div>
                                    <div className="overflow-auto rounded-lg border border-border bg-black/20 max-h-[65vh]">
                                        <div className="relative inline-block select-none" style={{ width: ocrDisplayWidth, height: ocrDisplayHeight }}>
                                            <img ref={ocrImgRef} src={ocrSourceUrl} alt="stacked"
                                                style={{ width: ocrDisplayWidth, height: ocrDisplayHeight }}
                                                className="block pointer-events-none" onLoad={onOcrImageLoad} draggable={false} />
                                            <div className="absolute inset-0" style={{ cursor: ocrOverlayCursor }}
                                                onMouseDown={onOcrOverlayMouseDown} onMouseMove={onOcrOverlayMouseMove}
                                                onMouseUp={stopOcrAll} onMouseLeave={stopOcrAll}>
                                                {ocrDisplayRect && ocrDisplayRect.w > 1 && ocrDisplayRect.h > 1 && (
                                                    <CropOverlayContents dc={ocrDisplayRect} onStartResize={(h, e) =>
                                                        startResize(h, e, ocrRect!, setOcrActiveHandle, setOcrResizeAnchor, setOcrResizeBaseRect,
                                                            () => setOcrDrawStart(null), () => setOcrMoveState(null))} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <label className="text-sm text-muted">Columns:</label>
                                        <input type="number" min={1} max={20} value={ocrGridCols}
                                            onChange={e => setOcrGridCols(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="w-16 px-2 py-1 rounded border border-border bg-surface-1 text-sm text-foreground" />
                                        <label className="text-sm text-muted">Rows:</label>
                                        <input type="number" min={1} max={50} value={ocrGridRows}
                                            onChange={e => setOcrGridRows(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="w-16 px-2 py-1 rounded border border-border bg-surface-1 text-sm text-foreground" />
                                        <button className={BTN_DISABLED} disabled={!ocrRect || ocrRect.w < 2 || ocrRect.h < 2} onClick={buildGrid}>
                                            Build grid →
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* ── Adjust grid ────────────────────────────────────── */}
                    {ocrSubStep === 'grid' && (
                        <div className="flex flex-col gap-3">
                            <p className="text-sm text-muted">Drag the yellow dividers to align them with your data boundaries.</p>
                            {ocrSourceUrl && ocrDisplayRect && (
                                <div className="overflow-auto rounded-lg border border-border bg-black/20 max-h-[65vh]">
                                    <div className="relative inline-block select-none" style={{ width: ocrDisplayWidth, height: ocrDisplayHeight }}>
                                        <img src={preprocessedUrl ?? ocrSourceUrl} alt="ocr source"
                                            style={{ width: ocrDisplayWidth, height: ocrDisplayHeight }}
                                            className="block pointer-events-none" draggable={false} />
                                        <div className="absolute inset-0"
                                            style={{ cursor: draggingDivider ? (draggingDivider.axis === 'col' ? 'col-resize' : 'row-resize') : 'default' }}
                                            onMouseMove={onOcrOverlayMouseMove} onMouseUp={stopOcrAll}>
                                            {/* Dim outside selection */}
                                            <div className="absolute inset-0 bg-black/40 pointer-events-none" style={{
                                                clipPath: `polygon(0 0,100% 0,100% 100%,0 100%,0 0,${ocrDisplayRect.x}px ${ocrDisplayRect.y}px,${ocrDisplayRect.x}px ${ocrDisplayRect.y + ocrDisplayRect.h}px,${ocrDisplayRect.x + ocrDisplayRect.w}px ${ocrDisplayRect.y + ocrDisplayRect.h}px,${ocrDisplayRect.x + ocrDisplayRect.w}px ${ocrDisplayRect.y}px,${ocrDisplayRect.x}px ${ocrDisplayRect.y}px)`,
                                            }} />
                                            {/* Selection border */}
                                            <div className="absolute pointer-events-none border-2 border-yellow-400/80" style={{
                                                left: ocrDisplayRect.x, top: ocrDisplayRect.y,
                                                width: ocrDisplayRect.w, height: ocrDisplayRect.h,
                                            }} />
                                            {/* Column dividers */}
                                            {colDividers.map((d, i) => {
                                                const dx = d * ocrScale;
                                                return (
                                                    <div key={`c${i}`}>
                                                        <div className="absolute pointer-events-none" style={{ left: dx - 0.5, top: ocrDisplayRect.y, width: 1, height: ocrDisplayRect.h, background: 'rgba(255,220,50,0.9)' }} />
                                                        <div className="absolute" style={{ left: dx - 6, top: ocrDisplayRect.y, width: 12, height: ocrDisplayRect.h, cursor: 'col-resize' }}
                                                            onMouseDown={e => { e.stopPropagation(); setDraggingDivider({ axis: 'col', idx: i }); }} />
                                                    </div>
                                                );
                                            })}
                                            {/* Row dividers */}
                                            {rowDividers.map((d, i) => {
                                                const dy = d * ocrScale;
                                                return (
                                                    <div key={`r${i}`}>
                                                        <div className="absolute pointer-events-none" style={{ top: dy - 0.5, left: ocrDisplayRect.x, height: 1, width: ocrDisplayRect.w, background: 'rgba(255,220,50,0.9)' }} />
                                                        <div className="absolute" style={{ top: dy - 6, left: ocrDisplayRect.x, height: 12, width: ocrDisplayRect.w, cursor: 'row-resize' }}
                                                            onMouseDown={e => { e.stopPropagation(); setDraggingDivider({ axis: 'row', idx: i }); }} />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Results ───────────────────────────────────────── */}
                    {ocrSubStep === 'result' && ocrTable && (
                        <div className="flex gap-4 min-h-0 items-start">
                            {/* Original image */}
                            {ocrSourceUrl && (
                                <div className="shrink-0 overflow-auto rounded-lg border border-border bg-black/20 max-h-[70vh] max-w-[50%]">
                                    <img src={ocrSourceUrl} alt="stacked" className="block h-auto" style={{ maxWidth: '100%' }} />
                                </div>
                            )}
                            {/* Editable table */}
                            <div className="flex-1 overflow-auto rounded-lg border border-border min-w-0 max-h-[70vh]">
                                <table className="w-full border-collapse text-sm">
                                    <tbody>
                                        {ocrTable.map((row, r) => (
                                            <tr key={r} className={r % 2 === 0 ? "bg-surface-1" : ""}>
                                                {row.map((cell, c) => (
                                                    <td key={c} className="border border-border p-0">
                                                        <input value={cell}
                                                            onChange={e => {
                                                                const v = e.target.value;
                                                                setOcrTable(prev => prev
                                                                    ? prev.map((rw, ri) => ri === r ? rw.map((cl, ci) => ci === c ? v : cl) : rw)
                                                                    : null);
                                                            }}
                                                            className="w-full min-w-20 px-2 py-1.5 bg-transparent text-foreground focus:outline-none focus:ring-inset focus:ring-1 focus:ring-blue-500" />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
