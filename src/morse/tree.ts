export type MorseSymbol = '.' | '-'

export type MorseNode = {
  letter: string
  code: string
  position: { x: number; y: number }
}

export const MORSE_NODES: MorseNode[] = [
  { letter: 'O', code: '---', position: { x: -5, y: 0 } },
  { letter: 'M', code: '--', position: { x: -4, y: 0 } },
  { letter: 'T', code: '-', position: { x: -1, y: 0 } },
  { letter: 'E', code: '.', position: { x: 2, y: 0 } },
  { letter: 'I', code: '..', position: { x: 3, y: 0 } },
  { letter: 'S', code: '...', position: { x: 4, y: 0 } },
  { letter: 'H', code: '....', position: { x: 5, y: 0 } },

  { letter: 'Q', code: '--.-', position: { x: -5, y: 1 } },
  { letter: 'G', code: '--.', position: { x: -4, y: 1 } },
  { letter: 'Z', code: '--..', position: { x: -4, y: 2 } },

  { letter: 'Y', code: '-.--', position: { x: -3, y: 1 } },
  { letter: 'K', code: '-.-', position: { x: -2, y: 1 } },
  { letter: 'C', code: '-.-.', position: { x: -2, y: 2 } },
  { letter: 'N', code: '-.', position: { x: -1, y: 1 } },
  { letter: 'X', code: '-..-', position: { x: -2, y: 3 } },
  { letter: 'D', code: '-..', position: { x: -1, y: 3 } },
  { letter: 'B', code: '-...', position: { x: -1, y: 4 } },

  { letter: 'J', code: '.---', position: { x: 0, y: 1 } },
  { letter: 'W', code: '.--', position: { x: 1, y: 1 } },
  { letter: 'P', code: '.--.', position: { x: 1, y: 2 } },
  { letter: 'A', code: '.-', position: { x: 2, y: 1 } },
  { letter: 'R', code: '.-.', position: { x: 2, y: 3 } },
  { letter: 'L', code: '.-..', position: { x: 2, y: 4 } },

  { letter: 'U', code: '..-', position: { x: 3, y: 1 } },
  { letter: 'F', code: '..-.', position: { x: 3, y: 2 } },

  { letter: 'V', code: '...-', position: { x: 4, y: 1 } },
]

export const ROOT_POSITION = { x: 0, y: 0 }

export const CODE_TO_LETTER: Record<string, string> = MORSE_NODES.reduce(
  (acc, node) => {
    acc[node.code] = node.letter
    return acc
  },
  {} as Record<string, string>,
)

export const LETTER_TO_CODE: Record<string, string> = MORSE_NODES.reduce(
  (acc, node) => {
    acc[node.letter] = node.code
    return acc
  },
  {} as Record<string, string>,
)

export const textToMorse = (text: string): string =>
  text
    .toUpperCase()
    .split('')
    .map((char) => {
      if (char === ' ') return '/'
      return LETTER_TO_CODE[char] ?? '?'
    })
    .join(' ')

export const getNodeByCode = (code: string): MorseNode | undefined =>
  MORSE_NODES.find((node) => node.code === code)

export const getParentCode = (code: string): string => code.slice(0, -1)

export const getPathCodes = (code: string): string[] => {
  const codes: string[] = []
  for (let i = 1; i <= code.length; i++) {
    codes.push(code.slice(0, i))
  }
  return codes
}
