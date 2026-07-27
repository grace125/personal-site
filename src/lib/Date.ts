

const monthShortFormat = new Intl.DateTimeFormat(undefined, {
    month: "short"
})

const yearMonthFormat = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
})

export const ShortMonthStr: (date: Date) => string = monthShortFormat.format
export const YearMonthStr: (date: Date) => string = yearMonthFormat.format 