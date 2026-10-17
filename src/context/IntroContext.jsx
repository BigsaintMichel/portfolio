import { createContext, useContext } from 'react'

/**
 * Indique si l'intro (préloader) est terminée.
 * Le Hero attend `introDone` pour lancer sa timeline, afin que l'entrée
 * du titre se joue pendant la levée du rideau et non derrière lui.
 */
export const IntroContext = createContext({ introDone: false })

export const useIntro = () => useContext(IntroContext)
