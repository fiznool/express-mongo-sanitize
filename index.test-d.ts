import {expectType} from 'tsd';
import mongoSanitize from './index.js';
import * as express from "express";
import {Handler} from "express";

// middleware
const app = express()
app.use(mongoSanitize());
expectType<Handler>(mongoSanitize());
expectType<Handler>(mongoSanitize({
    dryRun: true,
    onSanitize: (req, res) => {
        // nope
    },
    replaceWith: "_"
}));
// functions
const payloadArray = [{
    $prohibited: 'key'
}];
const payloadObject = {
    nested: {
        'prohibited.key': 'value'
    }
};
expectType<typeof payloadArray>(mongoSanitize.sanitize(payloadArray));
expectType<typeof payloadObject>(mongoSanitize.sanitize(payloadObject));
expectType<boolean>(mongoSanitize.has(payloadArray));
expectType<boolean>(mongoSanitize.has(payloadObject));
