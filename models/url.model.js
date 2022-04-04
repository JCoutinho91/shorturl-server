const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const shortId = require("shortid")

//! Models for DB, userId ref to "User"
const urlSchema = new Schema({
    fullUrl: {
        type: String,
        required: true,
    },
    shortUrl: {
        type: String,
        required: true,
        default: shortId.generate
    },
    views: {
        type: Number,
        required: true,
        default: 0,
    },
    shortCount: {
        type: Number,
        required: true,
        default: 0,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = model("Url", urlSchema);
