import { intentIndex } from './../messages/intents'
import { MessageInterface } from './../messages/types'
import MooConfig from './moo.config'

const moo = require('moo');
const lexer = moo.compile(MooConfig);

export default function( input: string ): MessageInterface {

    let token;
    const model: MessageInterface = {
        source: input,
        action: 'unknown',
        object: 'reminder'
    };

    lexer.reset(input)

    while (token = lexer.next()) {
        if (token.type.match(/word|WS|NL/)){
            continue;
        }
        if (token.type === 'action') {
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
