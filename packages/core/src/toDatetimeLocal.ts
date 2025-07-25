import { isDate } from "./utils"

/**
 * Convert timestamp to HTML `datetime-local` compatible format.
 */
export const toDatetimeLocal = (dateStr: string | Date | number) => {
    const date = new Date(dateStr)
    if (!isDate(date)) return ''

    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    const res = `${year}-${month}-${day}T${hours}:${minutes}`
    return res as `${number}-${number}-${number}T${number}:${number}`
}
export default toDatetimeLocal