import { allIntents } from '../messages/intents'
import { objects } from '../messages/controller'

export default {
    object: objects, // A single dimensional array of root-level keys defined in the messages controller
    action: new RegExp('(?:'+ allIntents.join('|') +')'), // All of the keywords defined in the intents file
    text: {
        match: /me to (?:.+?(?= in|$))/, 
        value: (s: string) => { 
            return s.replace('me to ', '') 
        }
    },
    quantity: {
        match: /in (?:\d+|an|a)/, 
        value: (s: string): number => {
            return Number(s.replace('in ', '').replace('an', '1').replace('a', '1'))
        }
    },
    unit: /(?:second|minute|hour)/,
    modifier: /(?:all|[0-9]+)/,
    word: /[a-z0-9]+/,
    WS: /[ \t]+/,
    NL: { 
        match: /\n/, 
        lineBreaks: true 
    },
    CHAR: /.+/
}