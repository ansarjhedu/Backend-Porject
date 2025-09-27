import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from '../utils/apiError.js'
import { User } from "../models/user.js";
import { uploadContent } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
    // step1: get user data from front end
    const { username, email, fullname, password } = req.body;

    //step2: validation of data- non empty data

    if ([username, email, fullname, password].some((field) => field?.trim() === " ")) {
        throw new apiError(400, "All fileds are required")
    }
    //step3: check if the user already exists
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existingUser) {
        throw new apiError(409, "User already exists with this email or username")
    }

    //step4: check avatar and cover images
    const avatarLocalPath = req.files?.avatar[0]?.path;

    let coverImgLocalPath;
    if (req.files && Array.isArray(req.files.coverImg) && req.files.coverImg.length > 0) {
        coverImgLocalPath = req.files.coverImg[0].path
    }
    if (!avatarLocalPath) {
        throw new apiError(400, "avatar file is required")
    }
    const avatar = await uploadContent(avatarLocalPath);
    const coverImg = await uploadContent(coverImgLocalPath);
    if (!avatar) {
        throw new apiError(400, "Avatar is required")
    }

    //step5:  create a user on database
    const user = await User.create({
        username: username.toLowerCase(),
        fullname,
        avatar: avatar.url,
        coverImg: coverImg?.url || "",
        email,
        password
    })
    //step6: select the fileds that you don't want to display to the user 
    const createUser = await User.findById(user._id).select(
        "-password -refreshTokens"
    )

    //step7: check if the user is created successfully
    if (!createUser) {
        throw new apiError(500, "Something went wrong while creating the user")
    }

    //step8: send a response 
    return res.status(201).json(
        new apiResponse(200, createUser, "User is registered successfully")
    )
})
export { registerUser }