import mongoose from 'mongoose';

export const Key = mongoose.model('Key', {
    accessKey: { type: String, required: true },
    created_At: { type: Date, required: true },
    expiry: { type: Date, required: true },
    status: { type: String, required: true, default: 'active'}
})