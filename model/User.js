import mongoose from 'mongoose';

export const User = mongoose.model('User', {
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'personnel'], default: 'personnel' },
    status: { type: String, required: true, default: 'inactive' },
    activation_token: { type: String, required: true },
    reset_OTP: { type: String },
    key: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Key'
    }]
})