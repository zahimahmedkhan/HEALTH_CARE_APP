import mongoose from 'mongoose';

const accessGrantSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'revoked'],
        default: 'pending',
    },
    grantedAt: {
        type: Date,
        default: null,
    },
    revokedAt: {
        type: Date,
        default: null,
    },
    scope: {
        type: [String],
        default: ['vitals', 'reports'],
    },
}, { timestamps: true });

const AccessGrant = mongoose.model('AccessGrant', accessGrantSchema);

export default AccessGrant;
