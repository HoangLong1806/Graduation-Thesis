const mongoose = require("mongoose");

const withdrawSchema = new mongoose.Schema(
  {
    seller: {
        type: Object,

    },
    amount:{
        type: Number,
        required: true,
    },
    status:{
        type: String,
        default: "Processing",
    },
    createdAt:{
        type: Date,
        default: Date.now(),
    },
    updateAt:{
        type: Date,
    }


  }
);

module.exports = mongoose.model("Withdraw", withdrawSchema);