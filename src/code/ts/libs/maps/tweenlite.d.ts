

interface ITweenLiteProperties {
    delay?: number;
    ease?: Function;
    onComplete: Function;
    onCompleteParams: Array;
    useFrames: bool;
    immediateRender: bool;
    onStart: Function;
    onStartParams: Array;
    onUpdate: Function;
    onUpdateParams: Array;
    onReverseCompleteParams: Array;
    paused: bool;

    overwrite: any; // string / number

    width?: number;
    height?: number;

}

class TweenLiteStandard {
    public pause():void;
    public resume():void;
    public restart(): void;
    public reverse(): void;
    public play(): void;
    public seek(time:number): void;
    public timeScale(time:number): void;
    public kill(): void;
}

interface Easing {
    easeIn: Function;
    easeInOut: Function;
    easeOut: Function;
}

class Back { }

declare class TweenLite extends TweenLiteStandard {

    static defaultOverwrite(overwrite:string):void;
    static defaultOverwrite(overwrite:bool):void;

    static to(el: Object, time: number, css?: Object, ease?: any): TweenLite;
    static to(el: Object[], time: number, css?: Object, ease?: any): TweenLite;

    static killTweensOf(el : Object );

    static activate(plugin:any): void;
    static activate(plugin:any[]): void;

    constructor (el: HTMLElement[], time: number, css?: ITweenLiteProperties, ease?: any);
}

declare class TimelineLite extends TweenLiteStandard {
    constructor ();
    public to();
    public staggerTo();
    public call(fn: Function);

}