import {Schema, model} from 'mongoose';

export const Document = model ('Document', new Schema({
    documentNo : {type: String, required: false},
    issuanceType: {type: String, required: true},
    series: {type: String, required: false},
    date: {type: Date, required: true},
    subject: {type: String, required: false},
    keyword: {type: String, required: false},
    file: {type: String, required: true},
    uploadDate: {type: Date, required: false},
    employeeID: {type: String, require: true},
}, {collection: "document"}));
