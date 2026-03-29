const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const addressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      default: ""
    },
    phone: {
      type: String,
      trim: true,
      default: ""
    },
    street: {
      type: String,
      trim: true,
      default: ""
    },
    ward: {
      type: String,
      trim: true,
      default: ""
    },
    district: {
      type: String,
      trim: true,
      default: ""
    },
    city: {
      type: String,
      trim: true,
      default: ""
    },
    country: {
      type: String,
      trim: true,
      default: "Viet Nam"
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  },
  {
    _id: false
  }
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, "Password is required"]
    },
    fullName: {
      type: String,
      trim: true,
      default: ""
    },
    phone: {
      type: String,
      trim: true,
      default: ""
    },
    avatarUrl: {
      type: String,
      default: "https://i.sstatic.net/l60Hf.png"
    },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer"
    },
    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active"
    },
    addresses: {
      type: [addressSchema],
      default: []
    },
    loginCount: {
      type: Number,
      default: 0,
      min: [0, "Login count cannot be negative"]
    },
    lastLoginAt: Date,
    forgotPasswordToken: String,
    forgotPasswordTokenExp: Date,
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
  }

  next();
});

userSchema.pre("findOneAndUpdate", function (next) {
  if (this._update.password) {
    const salt = bcrypt.genSaltSync(10);
    this._update.password = bcrypt.hashSync(this._update.password, salt);
  }

  next();
});

module.exports = mongoose.model("user", userSchema);
