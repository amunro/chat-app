interface IntentInterface {
  [propName: string]: any;
}

const intents: IntentInterface = {
    "greet": {
        keywords: [ "hello", "hi", "hey" ]
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

export let intentIndex = '';
const intentCategories = (
    Object
        .keys(intents)
        .map(function(key) {
            const intentKey = key as keyof IntentInterface
            const intentSet = intents[intentKey];
            intentIndex += intentSet.keywords.join(':'+ key +',') +':'+ key +','
            return intentSet.keywords;
        })
);

export const allIntents = [].concat.apply([], intentCategories);