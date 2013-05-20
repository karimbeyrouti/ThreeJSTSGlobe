//Extend the window object with cross Browser callbacks so TS will not complain
//Also add the (non-standard) Canvas Element parameter for performance improvement
interface WindowAnimationTiming {
    requestAnimationFrame(callback: FrameRequestCallback, canvas ?: HTMLCanvasElement): number;
    //msRequestAnimationFrame(callback: FrameRequestCallback, canvas ?: HTMLCanvasElement): number;
    mozRequestAnimationFrame(callback: FrameRequestCallback, canvas ?: HTMLCanvasElement): number;
    webkitRequestAnimationFrame(callback: FrameRequestCallback, canvas ?: HTMLCanvasElement): number;
    oRequestAnimationFrame(callback: FrameRequestCallback, canvas ?: HTMLCanvasElement): number;

    cancelRequestAnimationFrame(handle: number): void;
    //msCancelRequestAnimationFrame(handle: number): void;
    mozCancelRequestAnimationFrame(handle: number): void;
    webkitCancelRequestAnimationFrame(handle: number): void;
    oCancelRequestAnimationFrame(handle: number): void;
}

//To make WebGL work
interface HTMLCanvasElement {
    getContext(contextId: string ): WebGLRenderingContext;
    //getContext(contextId: string, params : {}): WebGLRenderingContext;
}