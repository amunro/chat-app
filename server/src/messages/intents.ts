import { GenericInterface } from "./types";

// A structure to categorize and define key words.
// The categories act as actions that are defined 
// in the controller. 
const intents: GenericInterface = {
    "greet": {
        keywords: [ "hello", "hi", "hey" ]
    },
    "thank": {
        keywords: [ "thanks", "thank", "arigato" ]
    },
    "help": {
        keywords: [ "help", "omg" ]
    },
    "add": {
        keywords: [ "add", "remind", "tell" ]
    },
    "list": {
        keywords: [ "list", "show" ]
    },
    "order":  {
        keywords: [ "order", "get" ]
    },
    "delete": {
        keywords: [ 
            "delete",
            "clear",
            "remove",
            "forget",
            "cancel" 
        ]
    }
}

// A mechanism to flatten and associate keywords with their category
// keyword1:category,keyworld2:category
export let intentIndex = '';

// Flatten the object from the keyworlds in a 1 dimensional array
// for the parser
const intentCategories = (
    Object
        .keys(intents)
        .map(function(key) {
            const intentKey = key as keyof GenericInterface
            const intentSet = intents[intentKey];
            intentIndex += intentSet.keywords.join(':'+ key +',') +':'+ key +','
            return intentSet.keywords;
        })
);
export const allIntents = [].concat.apply([], intentCategories);