const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const TodoSchema = new Schema ({
    todoList: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Todo', TodoSchema);