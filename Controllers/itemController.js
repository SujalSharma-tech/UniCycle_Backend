import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Item } from "../Models/itemSchema.js";
import cloudinary from "cloudinary";

export const ItemPost = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length == 0) {
    return next(new ErrorHandler("Atleast one image is Required!", 400));
  }

  let { images } = req.files;

  const imageIds = [];
  for (const img of Array.isArray(images) ? images : [images]) {
    const result = await cloudinary.uploader.upload(img.tempFilePath);
    if (!result) {
      return next(new ErrorHandler("Error uploading", 400));
    }
    imageIds.push({ url: result.public_id });
  }

  const { title, price, Description, Category } = req.body;
  const createdBy = req.user._id;

  const username = req.user.name;

  const user_icon = req.user.user_icon.url;

  if (!title || !Description || !price || !Category) {
    return next(
      new ErrorHandler(
        "Title, Description, price and category are required fields!",
        400
      )
    );
  }
  images = imageIds;

  const itemData = {
    title,
    Description,
    Category,
    price,
    createdBy,
    user_icon,
    username,
    images,
  };

  const item = await Item.create(itemData);
  res.status(201).json({
    success: true,
    message: "Item Uploaded",
    item,
  });
});

export const DeletePost = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const item = await Item.findById(id);
  if (!item) {
    return next(new ErrorHandler("Item not found", 400));
  }
  await item.deleteOne();
  res.status(200).json({
    success: true,
    message: "Item deleted!",
  });
});

export const GetAllItems = catchAsyncErrors(async (req, res, next) => {
  const items = await Item.find();
  res.status(200).json({
    success: true,
    items,
  });
});

export const getSingleItem = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const item = await Item.findById(id);
  res.status(200).json({
    success: true,
    item,
  });
});
export const getMyItems = catchAsyncErrors(async (req, res, next) => {
  const createdBy = req.user._id;
  const items = await Item.find({ createdBy });
  res.status(200).json({
    success: true,
    items,
  });
});

export const updatePost = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let item = await Item.findById(id);
  if (!item) {
    return next(new ErrorHandler("Post not Found!", 400));
  }
  const newPostData = {
    title: req.body.title,
    Description: req.body.Description,
    Category: req.body.Category,
    price: req.body.price,
  };

  item = await Item.findByIdAndUpdate(id, newPostData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Post Successfully Updated!",
    item,
  });
});
