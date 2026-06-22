import { Id } from "@/app/lib/datatypes/Id"
import { Z, z } from "@/app/lib/Z"
import React, { ChangeEvent, DetailedHTMLProps, Dispatch, InputHTMLAttributes, SetStateAction, useState } from "react"

export type NumberInputProps = Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "onChange" | "value" > & { 
    name: string,
    value: [number, Dispatch<SetStateAction<number>>],
    parse?: z.ZodType<number, string>,
    validate: z.ZodType<number, number>
}

export const NumberInput = (p: NumberInputProps) => {
    const [value, setValue] = p.value
    const parse = p.parse ?? z.coerce.number()

    const [innerValue, setInnerValue] = useState(value.toString())
    const [err, setErrValue] = useState(<React.Fragment key="error"></React.Fragment>)

    const onChange = (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        Z.parse(parse, event.target.value)
            .tapOk(ok => setInnerValue(ok.toString()))
            .bind((n) => Z.parse(p.validate, n))
            .match(
                ok => {
                    setValue(ok)
                    return Id(<React.Fragment key="error"></React.Fragment>)
                },
                err => {
                    return Id(<React.Fragment key="error">
                        <span className="text-err">{z.treeifyError(err).errors[0]}</span>
                    </React.Fragment>)
                }
            )
            .map(setErrValue)
    }
    const newProps = {...p, value: innerValue, onChange }
    return <div className="min-w-fit">
        <label className="block text-contrast-3 text-nowrap min-w-30">{p.name}</label>
        <input {...newProps} className={`bg-mode-1 border-b-2 border-contrast-2 rounded-sm w-full`} type="number" />
        {err}
    </div>
}