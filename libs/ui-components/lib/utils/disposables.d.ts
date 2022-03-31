export declare function disposables(): {
    enqueue(fn: Function): void;
    requestAnimationFrame(callback: FrameRequestCallback): void;
    nextFrame(callback: FrameRequestCallback): void;
    setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): void;
    add(cb: () => void): void;
    dispose(): void;
    workQueue(): Promise<void>;
};
