import { Message, Reminder, State } from './types'
import { parseMessage, executeMessage, clearAllReminders } from './controller'

// TODO: This isn't an explicit thing. VSCode isn't recognizing these as globals...
import { jest, describe, expect, test, beforeEach } from '@jest/globals'

describe('Messages', function(){

    describe('parseMessage', function(){

        describe.each([

            ['help', 'help'],
            ['remind me to eat in 60 seconds', 'add-reminder'],
            ['in 60 seconds tell me to eat', 'add-reminder'],
            ['list my reminders', 'list-reminders'],
            ['delete all my reminders', 'clear-all-reminders'],
            ['delete reminder 2', 'clear-reminder'],
            ['tacoz 4 dayz', 'unknown']

        ])('%s', function(message, expected){
            test(`returns a message kind of ${expected}`, () => {
                const result = parseMessage(message.toString());
                expect(result.kind).toBe(expected);
            });
        });

    })
    describe('executeMessage', function(){

        let reminder: Reminder, state: State;

        beforeEach(function(){

            reminder = {
                id: 1,
                date: new Date(),
                text: 'Hello',
                timeout: setTimeout(function(){ return true}, 100)
            };

            state = {
                reminders: [],
                nextId: 1,
            }
            
        })

        test('help -> returns a message', () => {

            const message: Message = {
                kind: "help"
            }

            let result = executeMessage(state, message)
            expect(result).toContain("I am a reminder bot");

        });

        test('add-reminder -> returns a message', () => {

            const message: Message = {
                kind: "add-reminder",
                text: "my me",
                seconds: 120
            }
            let result = executeMessage(state, message)
            expect(result).toContain("Ok, I will remind you to");
            expect(result).toContain("you ");
            expect(result).toContain("your");
            expect(state.reminders.length).toBe(1);

        });

        describe('list-reminders', function(){

            test('returns a message for 0 reminders', () => {

                const message: Message = {
                    kind: "list-reminders",
                }
                let result = executeMessage(state, message)
                expect(result).toContain("You have no reminders.");

            });
            test('returns a message for >0 reminders', () => {

                const message: Message = {
                    kind: "list-reminders",
                }
                state.reminders.push(reminder);
                let result = executeMessage(state, message)
                expect(result).toContain("<table");
                expect(result).toContain(reminder.text);

            });

        })

        test('clear-all-reminders -> returns a message AND calls `clearAllReminders`', () => {

            const message: Message = {
                kind: "clear-all-reminders",
            }
            state.reminders.push(reminder);
            let result = executeMessage(state, message)
            expect(result).toBe("Ok, I have cleared all of your reminders.");
            expect(state.reminders.length).toBe(0);       

        });

        test('clear-reminder -> returns a message AND calls `clearAllReminders`', () => {

            const message: Message = {
                kind: "clear-all-reminders",
            }
            state.reminders.push(reminder);
            let result = executeMessage(state, message)
            expect(result).toBe("Ok, I have cleared all of your reminders.");
            expect(state.reminders.length).toBe(0);       

        });

        describe('clear-reminder', function(){
            test('returns a message if none is found', () => {

                const message: Message = {
                    kind: "clear-reminder",
                    id: 2
                }
                state.reminders.push(reminder);
                let result = executeMessage(state, message)
                expect(result).toContain("There is no reminder with id");
                expect(state.reminders.length).toBe(1);       

            });

            test('returns a message and clears if a reminder is found', () => {

                const message: Message = {
                    kind: "clear-reminder",
                    id: 1
                }
                state.reminders.push(reminder);
                let result = executeMessage(state, message)
                expect(result).toContain("Ok, I will not remind you to");
                expect(result).toContain(reminder.text);
                expect(state.reminders.length).toBe(0);       

            });

        });

        test('unknown -> returns a general friendly error', () => {

            const message: Message = {
                kind: "unknown"
            }
            let result = executeMessage(state, message)
            expect(result).toBe("I'm sorry, I don't understand what you mean.");

        });

    });

    describe('clearAllReminders', function(){

        let reminder: Reminder, state: State;

        beforeEach(function(){

            reminder = {
                id: 1,
                date: new Date(),
                text: 'Hello',
                timeout: setTimeout(function(){ return true}, 100)
            };

            state = {
                reminders: [reminder],
                nextId: 1,
            }
            
        });

        test('should remove all existing reminders', function(){

            jest.useFakeTimers();
            expect(state.reminders.length).toBe(1)
            clearAllReminders(state);
            expect(state.reminders.length).toBe(0)
            expect(clearTimeout).toHaveBeenCalled()

        });

    });

});