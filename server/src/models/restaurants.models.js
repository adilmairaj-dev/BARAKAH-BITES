import {Schema, model} from 'mongoose';

const restaurantSchema = new Schema({
    name: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    opening_Time: {
        type: String,
        required: false
    },
    closing_Time: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    fileId: {
        type: String,
        required: false
    },
    refreshToken: {
        type: String,
        default: null
    }
}, {timestamps: true});

const Restaurant = model('Restaurant', restaurantSchema);

export default Restaurant;