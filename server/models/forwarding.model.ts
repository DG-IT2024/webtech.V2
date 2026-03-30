import {Schema, model} from 'mongoose';
export const ForwardedDocument = model ('ForwardedDocument', new Schema({
    documentNo : {type: String, required: true},
    sharedWith: [
        {
        userID: { type: String, required: true },
        forwardedAt: {type: Date, required: true}
        }
    ]
}, {collection: "forwarding"})); 
