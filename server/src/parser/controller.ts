import { intentIndex } from './../messages/intents'
import { MessageInterface } from './../messages/types'
import MooConfig from './moo.config'

const moo = require('moo');
const lexer = moo.compile(MooConfig);

// While I've been refering this to a parser, moo is technically a lexer
// Playing with both nearley js and moo (together and separately)
// Moo offered considerable flexibility on it's own that 
export default function( input: string ): MessageInterface {

    let token;
    const model: MessageInterface = {
        source: input,
        action: 'unknown',
        object: 'reminder'
    };

    lexer.reset(input)

    while (token = lexer.next()) {
        if (token.type.match(/word|WS|CHAR|NL/)){
            continue;
        }
        if (token.type === 'action') {

            // Normalize any of the keywords to their associated category for
            // the sake of simplifity. 
            // As an example "hello" becomes "greet" which is then used as an 
            // action key in the callbacks.
            const action = token.toString();
            const rootActionSearch = new RegExp(action +':([a-z]+),');
            const rootAction = intentIndex.match(rootActionSearch);

            if (rootAction && rootAction[1]) {
                model.action = rootAction[1];
            }

        } else if (token.type === 'object') {
            model.object = token.toString()
        } else if (token.type === 'text') {
            model.text = token.toString()
        } else if (token.type === 'quantity') {
            model.quantity = token.toString()
        } else if (token.type === 'modifier') {
            model.modifier = token.toString()
        } else if (token.type === 'unit') {
            model.unit = token.toString()
        } 
    }

    return model;
}
