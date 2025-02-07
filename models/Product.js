const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Please provide product name"],
        maxlength: [100, "Max length is 100 characters"]
    },
    price: {
        type: Number,
        required: [true, "Please provide a price"],
        default: 0
    },
    description: {
        type: String,
        required: [true, "Please provide product description"],
        maxlength: [1000, "Description cannot be more then 1000 characters"]
    },
    image: {
        type: String,
        default: "/uploads/example.jpeg"
    },
    category: {
        type: String,
        required: [true, "Please provide product category"],
        enum: ["office", "kitchen", "bedroom"]
    },
    company: {
        type: String,
        required: [true, "Please provide company name"],
        enum: {
            values: ["ikea", "liddy", "marcos"],
            message: `{VALUE} is not supported`,
        },
    },
    colors: {
        type: [String],
        default: ["#222"],
        required: true,
    },
    featured: {
        type: Boolean,
        required: false,
    },
    freeShipping: {
        type: Boolean,
        required: false,
    },
    inventory: {
        type: Number,
        required: true,
        default: 15
    },
    averageRating: {
        type: Number,
        default: 0,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, {timestamps: true, toJSON:{virtuals: true}, toObject:{virtuals: true}})

ProductSchema.virtual("reviews", {
    ref: "Review",
    localField: "_id",
    foreignField: "product",
    justOne: false,
})

ProductSchema.pre('remove', async function (next) {
    await this.model('Review').deleteMany({ product: this._id });
  });

module.exports = mongoose.model("Product", ProductSchema)






