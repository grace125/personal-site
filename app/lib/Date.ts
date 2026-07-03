

const yearMonthFormat = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
})

export const YearMonth: (date: Date) => string = yearMonthFormat.format 