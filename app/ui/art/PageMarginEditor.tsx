'use client';

import { useState, Fragment, InputHTMLAttributes, DetailedHTMLProps } from "react";

type PageMarginProps = { 
    units: "in" | "cm" | "m", 
    paperW: number, 
    paperH: number, 
    finalW: number,
    finalH: number,
    scale: number,
    bleedX: number, 
    bleedY: number,  
    safeX: number, 
    safeY: number,
    gutters?: { dir: "vertical" | "horizontal", size: number, ratio: number, color: string }[],
    showInsideLines?: boolean,
    hideOutsideLines?: boolean
}

function PageMargin({ paperW, paperH, finalW, finalH, scale, bleedX, bleedY, safeX, safeY, hideOutsideLines, showInsideLines, gutters }: PageMarginProps) {
    const strokeWidth = paperW * 0.00125
    const cutX1 = (paperW - finalW * scale) / 2
    const cutX2 = paperW - cutX1
    const cutY1 = (paperH - finalH * scale) / 2
    const cutY2 = paperH - cutY1 
    const bleedX1 = cutX1 - bleedX
    const bleedX2 = cutX2 + bleedX
    const bleedY1 = cutY1 - bleedY
    const bleedY2 = cutY2 + bleedY
    const safeX1 = cutX1 + safeX
    const safeX2 = cutX2 - safeX
    const safeY1 = cutY1 + safeY
    const safeY2 = cutY2 - safeY

    const safe = <Fragment key="safe">
        <line x1={safeX1} x2={safeX1} y1={hideOutsideLines ? safeY1 : 0} y2={hideOutsideLines ? safeY2 : paperH} strokeWidth={strokeWidth} stroke="blue" />
        <line x1={safeX2} x2={safeX2} y1={hideOutsideLines ? safeY1 : 0} y2={hideOutsideLines ? safeY2 : paperH} strokeWidth={strokeWidth} stroke="blue" />
        <line x1={hideOutsideLines ? safeX1 : 0} x2={hideOutsideLines ? safeX2 : paperW} y1={safeY1} y2={safeY1} strokeWidth={strokeWidth} stroke="blue" />
        <line x1={hideOutsideLines ? safeX1 : 0} x2={hideOutsideLines ? safeX2 : paperW} y1={safeY2} y2={safeY2} strokeWidth={strokeWidth} stroke="blue" />
    </Fragment>

    const cut = <Fragment key="cut">
        <line x1={cutX1} x2={cutX1} y1={hideOutsideLines ? cutY1 : 0} y2={hideOutsideLines ? cutY2 : paperH} strokeWidth={strokeWidth} stroke="black" />
        <line x1={cutX2} x2={cutX2} y1={hideOutsideLines ? cutY1 : 0} y2={hideOutsideLines ? cutY2 : paperH} strokeWidth={strokeWidth} stroke="black" />
        <line x1={hideOutsideLines ? cutX1 : 0} x2={hideOutsideLines ? cutX2 : paperW} y1={cutY1} y2={cutY1} strokeWidth={strokeWidth} stroke="black" />
        <line x1={hideOutsideLines ? cutX1 : 0} x2={hideOutsideLines ? cutX2 : paperW} y1={cutY2} y2={cutY2} strokeWidth={strokeWidth} stroke="black" />
    </Fragment>

    const displayGutters = (gutters ?? []).map(({ dir, size, ratio, color }) => {
        switch (dir) {
            case "horizontal":
                const lineX = (safeX2 - safeX1 + size) * ratio + safeX1
                const startY = hideOutsideLines ? safeY1 : 0
                const endY = hideOutsideLines ? safeY2 : paperH
                return <Fragment key={`${dir}-${ratio}-${size}`}>
                    <line x1={lineX       } x2={lineX       } y1={startY} y2={endY} strokeWidth={strokeWidth} stroke={color} />
                    <line x1={lineX - size} x2={lineX - size} y1={startY} y2={endY} strokeWidth={strokeWidth} stroke={color} />
                </Fragment>
            case "vertical":
                const lineY = (safeY2 - safeY1 + size) * ratio + safeY1
                const startX = hideOutsideLines ? safeX1 : 0
                const endX = hideOutsideLines ? safeX2 : paperW
                return <Fragment key={`${dir}-${ratio}-${size}`}>
                    <line x1={startX} x2={endX} y1={lineY       } y2={lineY       } strokeWidth={strokeWidth} stroke={color} />
                    <line x1={startX} x2={endX} y1={lineY - size} y2={lineY - size} strokeWidth={strokeWidth} stroke={color} />
                </Fragment>
            default:
                return dir
        }
    })
    
    return <svg preserveAspectRatio="xMidYMid meet" viewBox={`0 0 ${paperW} ${paperH}`} className="w-full h-auto">
        <polyline points={`0,0 ${paperW},0 ${paperW},${paperH} 0,${paperH} 0,0`} stroke="black" strokeWidth={strokeWidth * 4} fill="white" />

        {showInsideLines ? <Fragment key="fake-cut"></Fragment> : cut}
        {showInsideLines ? <Fragment key="fake-safe"></Fragment> : safe}
        {showInsideLines ? <Fragment key="fake-gutter"></Fragment> : displayGutters}

        <polyline key="bleed" points={`
            ${bleedX1},${hideOutsideLines ? bleedY1 : 0}
            ${bleedX1},${hideOutsideLines ? bleedY2 : paperH} 
            ${bleedX1},${bleedY2}
            ${hideOutsideLines ? bleedX1 : 0},${bleedY2}
            ${hideOutsideLines ? bleedX2 : paperW},${bleedY2}
            ${bleedX2},${bleedY2}
            ${bleedX2},${hideOutsideLines ? bleedY2 : paperH}
            ${bleedX2},${hideOutsideLines ? bleedY1 : 0}
            ${bleedX2},${bleedY1}
            ${hideOutsideLines ? bleedX2 : paperW},${bleedY1} 
            ${hideOutsideLines ? bleedX1 : 0},${bleedY1}         
            ${bleedX1},${bleedY1}
            ${bleedX1},${hideOutsideLines ? bleedY1 : 0}
        `} stroke="red" strokeWidth={strokeWidth} fill="white" />

        {showInsideLines ? cut : <Fragment key="fake-cut"></Fragment>}
        {showInsideLines ? safe : <Fragment key="fake-safe"></Fragment>}
        {showInsideLines ? displayGutters : <Fragment key="fake-gutter"></Fragment>}
    </svg>
}

export function PageMarginEditor() {
    const [paperW, setPaperW] = useState(11)
    const [paperH, setPaperH] = useState(17)
    const [finalW, setFinalW] = useState(2)
    const [finalH, setFinalH] = useState(3)
    const [scale, setScale] = useState(1)
    const [units, setUnits] = useState<PageMarginProps["units"]>("in")
    const [bleedX, setBleedX] = useState(0.5)
    const [bleedY, setBleedY] = useState(0.5)
    const [safeX, setSafeX] = useState(0.5)
    const [safeY, setSafeY] = useState(0.5)
    
    return <div>

        <form>
            <NumberInput min="0.01" name="Paper Width" value={paperW} 
                onChange={(event) => { setPaperW(Number.parseFloat(event.target.value)) }} 
            />
            <NumberInput min="0.01" name="Paper Height" value={paperH} 
                onChange={(event) => { setPaperH(Number.parseFloat(event.target.value)) }} 
            />
            <br/>
            <NumberInput min="0.01" name="Final Width" value={finalW} 
                onChange={(event) => { setFinalW(Number.parseFloat(event.target.value)) }} 
            />
            <NumberInput min="0.01" name="Final Height" value={finalH} 
                onChange={(event) => { setFinalH(Number.parseFloat(event.target.value)) }} 
            />
            <br/>
            <NumberInput min="0.01" name="Scale" value={scale} 
                onChange={(event) => { setScale(Number.parseFloat(event.target.value)) }} 
            />
            <br/>
            <NumberInput min="0.01" name="Bleed X" value={bleedX} 
                onChange={(event) => { setBleedX(Number.parseFloat(event.target.value)) }} 
            />
            <NumberInput min="0.01" name="Bleed Y" value={bleedY} 
                onChange={(event) => { setBleedY(Number.parseFloat(event.target.value)) }} 
            />
            <br/>
            <NumberInput min="0.01" name="Safe X" value={safeX} 
                onChange={(event) => { setSafeX(Number.parseFloat(event.target.value)) }} 
            />
            <NumberInput min="0.01" name="Safe Y" value={safeY} 
                onChange={(event) => { setSafeY(Number.parseFloat(event.target.value)) }} 
            />

        </form>
        <PageMargin paperW={paperW} paperH={paperH} finalW={finalW} finalH={finalH} scale={scale} units={units} bleedX={bleedX} bleedY={bleedY} safeX={safeX} safeY={safeY} 
            gutters={[
                { dir: "vertical", size: 0.25, ratio: 0.5, color: "green" },
                { dir: "vertical", size: 0.25, ratio: 1.0/3.0, color: "black" },
                { dir: "vertical", size: 0.25, ratio: 2.0/3.0, color: "black" },
                { dir: "horizontal", size: 0.25, ratio: 0.5, color: "green" },
                { dir: "horizontal", size: 0.25, ratio: 1.0/3.0, color: "black" },
                { dir: "horizontal", size: 0.25, ratio: 2.0/3.0, color: "black" },
            ]}
            showInsideLines hideOutsideLines
        />
        
    </div>
}

type NumberInputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & { name: string }

const NumberInput = (props: NumberInputProps) => {
    return <>
        <span>{props.name} </span>
        <input {...props} className="bg-background-2 border-2 border-foreground-2 border-dashed rounded-sm w-30" type="number" />
    </>
}