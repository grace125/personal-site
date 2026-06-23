'use client';

import { Opt } from "@/app/lib/datatypes/Option";
import { Result } from "@/app/lib/datatypes/Result";
import { mod } from "@/app/lib/Math";
import { useState, ReactNode, } from "react";
import { Z , z } from "@/app/lib/Z"
import { NumberInput } from "../form/NumberInput";
import { List } from "@/app/lib/datatypes/List";
import React from "react";

type ZineFromGridProps = {
    paperW: number,
    paperH: number,
    marginX: number,
    marginY: number,
    strokeWidth?: number,
    table: List<List<Opt<number>>>,
    lastEntry: number
}

type ZineProps = {
    paperW: number,
    paperH: number,
    marginX: number,
    marginY: number,
    strokeWidth?: number, 
    rowCount: number,
    colCount: number,
    take: number,
}

type ZineComputedProps = ZineFromGridProps & {
    strokeWidth: number,
    rowCount: number,
    colCount: number,
    rowStep: number,
    colStep: number,
    Line: (l: LineProps) => ReactNode
}

type LineProps = { x1: number, x2: number, y1: number, y2: number, kind: "cut" | "valley" | "mountain" }

type ZineGridError = "RowCountError" | "ColCountError" | "TooFewColumns" | "FourColumnError" | "TwoColumnError"

const strokeMultiplier = 0.00125

export function ZineEditor() {
    const paperW = useState(11)
    const paperH = useState(8.5)
    const marginX = useState(0)
    const marginY = useState(0)
    const rowCount = useState(2)
    const colCount = useState(4)
    const take = useState(0)

    // TODO: add download buttons
    // TODO: display size of each page
    // TODO: fix validation
    return <div>
        <form noValidate className="grid grid-cols-2 grid-rows gap-x-12 mx-16 gap-y-4 mt-[3.5em] mb-[1.4em]">
            <NumberInput name="Paper Width" min={0.0} step={0.5} value={paperW} validate={z.number().min(0.001) }/>
            <NumberInput name="Paper Height" min={0.0} step={0.5} value={paperH} validate={z.number().min(0.001)}/> 
            <NumberInput name="Margin X" min={0} value={marginX} step={0.5} validate={z.number().min(0)} />
            <NumberInput name="Margin Y" min={0} value={marginY} step={0.5} validate={z.number().min(0)} /> 
            <NumberInput name="Rows" min={2} step={2} value={rowCount} validate={z.int().min(2).multipleOf(2)} />
            <NumberInput name="Columns" min={2} step={2} value={colCount}  validate={z.int().min(2).multipleOf(2)} />
            <NumberInput name="Remove Pages" min={0} step={4} value={take} validate={z.int().multipleOf(4).min(0).max(rowCount[0] * colCount[0])} /> 
        </form>
        <br/>
        <ZineOfSize 
            paperW={paperW[0]}     paperH={paperH[0]} 
            marginX={marginX[0]}   marginY={marginY[0]} 
            rowCount={rowCount[0]} colCount={colCount[0]} 
            take={take[0]} 
        />
    </div>
}

export function ZineOfSize(p: ZineProps) {
    const table = generateGrid(p.rowCount, p.colCount, p.take)
    
    return table.match(
        ok => ZineFromGrid({ ...p, table: ok, lastEntry: p.rowCount * p.colCount - p.take }),
        () => <Svg paperW={p.paperW} paperH={p.paperH} strokeWidth={p.strokeWidth ?? (p.paperW * strokeMultiplier)}></Svg>
    ) 
}

function ZineFromGrid({ paperW, paperH, marginX, marginY, table, lastEntry, strokeWidth: sw }: ZineFromGridProps) {
    const strokeWidth = sw ?? paperW * strokeMultiplier
    const rowCount = table.length
    const colCount = table[0]?.length ?? 0
    const rowStep = (paperH - 2 * marginY) / rowCount
    const colStep = (paperW - 2 * marginX) / colCount

    const Line = (p: LineProps) => {
        switch (p.kind) {
            case "cut":
                return <line shapeRendering="geometricPrecision" x1={p.x1} x2={p.x2} y1={p.y1} y2={p.y2} stroke="black" strokeWidth={strokeWidth * 4} />
            case "valley":
                return <line shapeRendering="geometricPrecision" x1={p.x1} x2={p.x2} y1={p.y1} y2={p.y2} stroke="green" strokeWidth={strokeWidth} />
            case "mountain":
                return <line shapeRendering="geometricPrecision" x1={p.x1} x2={p.x2} y1={p.y1} y2={p.y2} stroke="red" strokeWidth={strokeWidth} />
            default:
                return p.kind
        }
    }

    const computedProps = { paperW, paperH, marginX, marginY, table, lastEntry, strokeWidth, rowCount, colCount, rowStep, colStep, Line }

    return <Svg paperW={paperW} paperH={paperH} strokeWidth={strokeWidth}>
        {columnLines(computedProps)}
        {rowLines(computedProps)}
        {cellText(computedProps)}
    </Svg>
}

const Svg = (p: { children?: ReactNode, paperW: number, paperH: number, strokeWidth: number }) => 
    <svg preserveAspectRatio="xMidYMid meet" viewBox={`0 0 ${p.paperW} ${p.paperH}`} className="w-full h-auto">
        <polyline points={`0,0 ${p.paperW},0 ${p.paperW},${p.paperH} 0,${p.paperH} 0,0`} stroke="black" strokeWidth={p.strokeWidth * 4} fill="white" />
        {p.children}
    </svg>

const columnLines = (p: ZineComputedProps) => {
    const elements = []

    for (var r = 0; r < p.rowCount; r++) {
        const y1 = p.rowStep * r + p.marginY
        const y2 = y1 + p.rowStep
        for (var c = -1; c < p.colCount; c++) {
            const x = p.colStep * (c + 1) + p.marginX
            const left = p.table.get2(r, c).flat()
            const right = p.table.get2(r, c + 1).flat()
            const key = `in-h-${r}-${c}`
            const coords = { x1: x, x2: x, y1, y2 }

            let line = left.match2Either(right, {
                some: (left, right) => 
                    Math.abs(left - right) === 1 
                        ? mod(Math.min(left, right), 2) === 1 
                            ? <p.Line {...coords} key={key} kind="mountain" />
                            : <p.Line {...coords} key={key} kind="valley" />
                        : Math.min(left, right) === 1 && Math.max(left, right) == p.lastEntry
                            ? <p.Line {...coords} key={key} kind="mountain" />
                            : <p.Line {...coords} key={key} kind="cut" />,
                either: (cell) => <p.Line {...coords} key={key} kind="cut" />,
                none: () => <React.Fragment key={`in-h-${r}-${c}`} />
            })
            elements.push(line)
        }
    }

    return elements
}

const rowLines = (p: ZineComputedProps) => {
    const elements: ReactNode[] = []

    for (var c = 0; c < p.colCount; c++) {
        const x1 = p.colStep * c + p.marginX
        const x2 = x1 + p.colStep
        for (var r = -1; r < p.rowCount; r++) {
            const y = p.rowStep * (r + 1) + p.marginY
            const top = p.table.get2(r, c).flat()
            const bottom = p.table.get2(r + 1, c).flat()
            const key = `in-h-${r}-${c}`
            const coords = { x1, x2, y1: y, y2: y }

            const line = top.match2Either(bottom, {
                some: (t, b) => 
                    Math.abs(t - b) === 1 
                        ? mod(Math.min(t, b), 2) === 1 
                            ? <p.Line {...coords} key={key} kind="mountain"  />
                            : <p.Line {...coords} key={key} kind="valley" />
                        : Math.min(t, b) === 1 && Math.max(t, b) == p.lastEntry
                            ? <p.Line {...coords} key={key} kind="mountain" />
                            : <p.Line {...coords} key={key} kind="cut" />,
                either: () => <p.Line {...coords} key={key} kind="cut" />,
                none: () => <React.Fragment key={key} />
            })
            elements.push(line)
        }
    }

    return elements
}

const cellText = (p: ZineComputedProps) => {
    const elements: ReactNode[] = []
    const size = p.strokeWidth * Math.min(p.colStep, p.rowStep) * 0.5

    for (var c = 0; c < p.colCount; c++) {
        const x = p.colStep * (c + 0.5) + p.marginX
        for (var r = 0; r < p.rowCount; r++) {
            const y = p.rowStep * (r + 0.5) + p.marginY
            const cell = p.table.get2(r, c).flat()
            const key = `text-${r}-${c}`
            cell.tapSome(cell => elements.push(
                <g key={key} transform={`
                    translate(${x}, ${y}) 
                    scale(${size} ${size})
                    rotate(${r % 2 === 0 ? 180 : 0})
                `}>
                    <text className={`underline text-4xl [text-anchor:middle] [dominant-baseline:middle]`}>{cell}</text>
                </g>
            ))
        }
    }

    return elements
}

const repeat = <T,>(item: T, length: number) => {
    const array: T[] = []
    array.length = length
    array.fill(item, 0, length)
    return array
}

const generate = <T,>(item: (i: number) => T, length: number) => {
    if (length === 0) return []
    else {
        const array: T[] = []
        array.length = length
        for (var i = 0; i < length; i++) {
            array[i] = item(i)
        }
        return array
    }
}

const generateGrid = (rowCount: number, colCount: number, take: number): Result<List<List<Opt<number>>>, ZineGridError> => {
    if (rowCount % 2 !== 0 || rowCount <= 0)        return Result.err("RowCountError")
    else if (colCount % 2 !== 0 || rowCount <= 0)   return Result.err("ColCountError")
    else if (take >= rowCount * colCount)           return Result.err("TooFewColumns")
    else if (colCount === 4 && take % 4 === 2)      return Result.err("FourColumnError")
    else if (colCount === 2 && rowCount !== 2)      return Result.err("TwoColumnError")

    const noneRowCount = Math.floor(take / (colCount * 2)) * 2
    const restRowCount = rowCount - noneRowCount 
    const noneColCount = Math.floor((take - noneRowCount * colCount) / (restRowCount * 2)) * 2
    const restColCount = colCount - noneColCount

    let innerGrid = generateGridInner(restRowCount, restColCount, take - noneRowCount * colCount - noneColCount * restRowCount)

    return Result.ok(List.of(
        ...List.repeat(noneRowCount, List.repeat(colCount, Opt.none())), 
        ...innerGrid.map(row => List.of(...List.repeat(noneColCount, Opt.none()), ...row)) 
    ))
}

const generateGridInner = (rowCount: number, colCount: number, take: number): List<List<Opt<number>>> => {
    let total = rowCount * colCount - take
    
    return makePathArray(rowCount, colCount / 2, take / 2)
        .map((arr, r) => 
            arr.flatMap((v) => v.match(
                (index) => r % 2 === 0 
                    ? [Opt.some(mod(index * 2, total) + 1), Opt.some(mod(index * 2 - 1, total) + 1)] 
                    : [Opt.some(mod(index * 2 - 1, total) + 1), Opt.some(mod(index * 2, total) + 1)],
                () => [Opt.none(), Opt.none()]
            )), 
        )
}

const makePathArray = (rowCount: number, colCount: number, take: number) => {
    let path = makePathFn(rowCount, colCount, take)
    return List.gen(rowCount, (r) => List.gen(colCount, (c) => path(r, c)))
}
    
/* invariants: rowCount and take are even, take < rowCount, take > rowCount * colCount, !(colCount === 2 && take === 1), and (colCount === 1 => rowCount - t) */
const makePathFn = (rowCount: number, colCount: number, take: number) => {
    let cutoff = colCount % 2 == 1 
        ? 2 
        : take > 0 
            ? 3 
            : 1
    let section1Height = (rowCount - 1)
    let section1Area = (rowCount - 1) * (colCount - cutoff)
    let section2Area = (cutoff - 1) * take
    let total = rowCount * colCount - take

    return (r: number, c: number) => {
        // Areas in maze that are wrong
        // Section 4 (and first tile of Section 1)
        if (r === rowCount - 1) {
            return Opt.some((total - colCount + c + 1) % total )
        }
        // Section 1
        else if (c >= cutoff) {
            const cReverse = colCount - c - 1
            const section1AreaToRight = cReverse * section1Height
            return Opt.some(section1AreaToRight + (cReverse % 2 === 0 ? rowCount - r - 1 : r + 1))
        }
        // Section 2
        else if (r < take) {
            if (c === 0) return Opt.none()
            const section2AreaAbove = r * (cutoff - 1)
            return Opt.some(section1Area + section2AreaAbove + (r % 2 === 0 ? (cutoff - c) : c))
        }
        // Section 3
        else {
            const section3AreaAbove = (r - take) * cutoff
            return Opt.some(section1Area + section2Area + section3AreaAbove + (r % 2 === 0 ? (cutoff - c) : c + 1))
        }
    }
}