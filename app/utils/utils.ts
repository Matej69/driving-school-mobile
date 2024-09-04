export const deepCopy = <T>(obj: T) => {
    return JSON.parse(JSON.stringify(obj)) as T
}


const dateOptions = {
    'eu': {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }
} satisfies Record<string, Intl.DateTimeFormatOptions>

type DateFormat = keyof typeof dateOptions


export const formatDate = (date: Date, format: DateFormat = 'eu') => {
    const time = date?.getTime()
    if (!time || isNaN(time))
        return null
  
    const formatter = new Intl.DateTimeFormat('en-GB', dateOptions[format]);
    return formatter.format(date).replace(',', '').replaceAll('/', '.');
  };