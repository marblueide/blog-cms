import emojiRegex  from 'emoji-regex'

export const encodeEmoji = (str: string) => {
  const regex = emojiRegex()
  return str.replace(regex, p => `emoji(${p.codePointAt(0)})`)
}

export const deCodeEmoji = (str: string) => {
  const emojiDecodeRegex = /emoji\(\d+\)/g
  return str.replace(emojiDecodeRegex, p => {
    const filterP = p.replace(/[^\d]/g, '')
    return String.fromCodePoint(Number(filterP))
  })
}