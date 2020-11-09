import { allIntents } from '../messages/intents'
import { objects } from '../messages/objects'

export default {
    object: objects,
    action: new RegExp('(?:'+ allIntents.join('|') +')'),
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
    }
}