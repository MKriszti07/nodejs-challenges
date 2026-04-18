const { mongoose } = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, trim: true, unique: true },
        email: { type: String, required: true, trim: true, unique: true }
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual populate: User -> Reviews (without storing review ids on User)
userSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'user'
});

const User = mongoose.model('User', userSchema);

module.exports = { User };