import Parser from './controller'

// TODO: This isn't an explicit thing. VSCode isn't recognizing these as globals...
import { describe, expect, test } from '@jest/globals'
import { MessageInterface } from '../messages/types';

describe('Parser', function(){
    describe('tokenizeInput', function(){
        describe.each([
                ['help', ['action']],
                ['remind me to eat in 60 seconds', ['action','text', 'quantity', 'unit']],
                ['remind me to eat in a minute', ['action','text', 'quantity', 'unit']],
                ['remind me to eat in an hour', ['action','text', 'quantity', 'unit']],
                ['in an hour tell me to eat', ['action','text', 'quantity', 'unit']],
                ['in a minute tell me to eat', ['action','text', 'quantity', 'unit']],
                ['in 60 seconds tell me to eat', ['action','text', 'quantity', 'unit']],
                ['list my reminders', ['action', 'object']],
                ['show all of my reminders', ['action', 'object', 'modifier']],
                ['clear my reminders', ['action', 'object']],
                ['remove reminders', ['action', 'object']],
                ['delete all reminders', ['action', 'object', 'modifier']],
                ['delete reminder 1', ['action', 'object', 'modifier']],
                ['remove reminder 22', ['action', 'object', 'modifier']],
                ['forget reminder 333', ['action', 'object', 'modifier']],
                ['clear reminder 444', ['action', 'object', 'modifier']],
                ['get 4 tacoz', ['action', 'object', 'modifier']],
                ['this should come up with nothing', ['action']],

        ])('%s', function(message, expected) {
            test(`returns an object with keys: ${expected}`, () => {
                const result = Parser(message);
                expected.forEach((key: string) => {
                    const interfaceKey = key as keyof MessageInterface
                    expect(result[interfaceKey]).toBeDefined()
                });
            });
        }); 
    });
}); 
