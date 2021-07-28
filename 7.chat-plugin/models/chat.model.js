const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const messageSchema = new mongoose.Schema(
    {

        room: {
            type: Schema.Types.String,
            required: true,
        },
        isFromCrm: {
            type: Schema.Types.Boolean,
            required: true
        },
        msgData: {
            type: Schema.Types.String,
            required: true,
            // unique: true /**works only when db isn't created yet. (auto-index) */
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        deleted: {
            type: Schema.Types.Boolean, default: false,
            required: true,
            //  unique: true /**works only when db isn't created yet. (auto-index) */
        },
    },
    { _id: true, timestamps: true, collection: 'Chat', autoIndex: true }
);

/**In Mongoose, a virtual is a property that is not stored in MongoDB. Virtual are typically used for computed properties on documents. */

messageSchema.methods = {
    UnDelete: function () {
        return this.deleted = false;
    },

    Delete: function () {
        return this.deleted = true;
    }
};



// export WorkizRule model
module.exports = mongoose.model('Chat', messageSchema);