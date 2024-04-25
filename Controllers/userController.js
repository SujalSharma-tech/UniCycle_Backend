import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../Models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

export const register = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length == 0) {
    return next(new ErrorHandler("Please Upload a profile Picture!", 400));
  }
  const { avatar } = req.files;
  const allowedFormats = ["image/jpeg", "image/jpg", "image/webp", "image/png"];
  if (!allowedFormats.includes(avatar.mimetype)) {
    return next(
      new ErrorHandler(
        "Upload picture only in [.jpg, .png, .webp] formats",
        400
      )
    );
  }
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password || !phone || !avatar) {
    return next(new ErrorHandler("Please Provide Full details", 400));
  }

  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler("User already exists!", 400));
  }
  const cloudinaryResp = await cloudinary.uploader.upload(avatar.tempFilePath);
  if (!cloudinaryResp || cloudinaryResp.error) {
    console.error(
      "Cloudinary Error",
      cloudinaryResp.error || "Unknown Cloudinary error"
    );
  }
  user = await User.create({
    name,
    email,
    password,
    phone,
    user_icon: {
      public_id: cloudinaryResp.public_id,
      url: cloudinaryResp.secure_url,
    },
  });
  sendToken(user, 200, "User Successfully Registered", res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Provide Full Details!", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 400));
  }
  sendToken(user, 200, "User Successfully LoggedIn!", res);
});

export const logout = catchAsyncErrors((req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "User LoggedOut!",
    });
});

export const getMyProfile = catchAsyncErrors((req, res, next) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    user,
  });
});
