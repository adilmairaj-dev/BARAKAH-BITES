import {Schema, model} from 'mongoose';

const tableSchema = new Schema({
    tableNumber: {
        type: Number,
        required: true,
    },
    capacity: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'reserved'],
        default: 'available'
    },
    image: {
        type: String,
        required: true
    },
    fileId: {
        type: String,
        required: true
    },
    floor: {
        type: Number,
        required: true
    },
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    }
}, {timestamps: true});

const Table = model('Table', tableSchema);

export default Table;