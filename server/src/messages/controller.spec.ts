import { MessageInterface, Reminder, State } from './types'
import { executeMessage, clearAllReminders } from './controller'
// TODO: This isn't an explicit thing. VSCode isn't recognizing these as globals...
import { jest, describe, expect, test, beforeEach } from '@jest/globals'

describe.only('Messages', function(){

    describe('executeMessage', function(){

        let reminder: Reminder, state: State, message: MessageInterface;

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
                tacos: 0
            }

            message = {
                source: 'remind me to blah',
                action: 'unknown',
                object: 'reminder',
            }
            
        });

        test('help -> returns a message', () => {

            message.action = 'help';
            const result = executeMessage(state, message)
            expect(result).toContain("I am a reminder bot");

        });

        test('add-reminder -> returns a message', () => {

            message.action = 'add';
            message.text = 'me my';
            message.quantity = 60;
            message.unit = 'seconds';

            const result = executeMessage(state, message)

            expect(result).toContain("Ok, I will remind you to");
            expect(result).toContain("you ");
            expect(result).toContain("your");
            expect(state.reminders.length).toBe(1);

        });

        describe('list-reminders', function(){

            test('returns a message for 0 reminders', () => {

                message.action = 'list';
                const result = executeMessage(state, message)
                expect(result).toContain("You have no reminders.");

            });
            test('returns a message for >0 reminders', () => {

                message.action = 'list';
                state.reminders.push(reminder);

                const result = executeMessage(state, message)
               
                expect(result).toContain("<table");
                expect(result).toContain(reminder.text);

            });

        })

        test('clear-all-reminders -> returns a message AND calls `clearAllReminders`', () => {

            message.action = 'delete';
            message.modifier = 'all';
            state.reminders.push(reminder);

            const result = executeMessage(state, message)

            expect(result).toBe("Ok, I have cleared all of your reminders.");
            expect(state.reminders.length).toBe(0);       

        });

        describe('clear-reminder', function(){
            test('returns a message if none is found', () => {

                message.action = 'delete';
                message.modifier = 2;
                state.reminders.push(reminder);

                const result = executeMessage(state, message)

                expect(result).toContain("There is no reminder with id");
                expect(state.reminders.length).toBe(1);       

            });

            test('returns a message and clears if a reminder is found', () => {

                message.action = 'delete';
                message.modifier = 1;
                state.reminders.push(reminder);

                const result = executeMessage(state, message)

                expect(result).toContain("Ok, I will not remind you to");
                expect(result).toContain(reminder.text);
                expect(state.reminders.length).toBe(0);       

            });

        });

        test('unknown -> returns a general friendly error', () => {

            message.action = 'unknown';
            const result = executeMessage(state, message)
            expect(result).toBe("Sorry! I don't understand what you mean.");

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
                tacos: 0
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