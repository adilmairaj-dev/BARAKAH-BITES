import {Schema, model} from 'mongoose';

const foodSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['starters', 'main', 'desserts', 'beverages'],
        default: 'main'
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    fileId: {
        type: String,
        required: true
    },
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    }
}, {timestamps: true});

const Food = model('Food', foodSchema);

export default Food;