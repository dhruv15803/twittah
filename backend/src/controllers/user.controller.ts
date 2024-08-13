import { Request, Response } from "express";
import { prisma } from "../index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

type registerRequestType = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  dateOfBirth: string;
};

const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, username, firstName, lastName, password, dateOfBirth } =
      req.body as registerRequestType;

    if (req.cookies?.auth_token)
      return res
        .status(400)
        .json({ success: false, message: "auth_token already exists" });
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.trim().toLowerCase() },
          { username: username.trim() },
        ],
      },
    });
    if (user)
      return res.status(400).json({
        success: false,
        message: "Account with email or username already exists",
      });

    //   check if user's age is >=18
    let age;
    //   age  = current date - date of birth
    age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
    if (age < 18)
      return res.status(400).json({
        success: false,
        message: "Only 18 and above can access this site",
      });
    const salts = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salts);

    const newUser = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        username: username.trim(),
        password: hashedPassword,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        Date_of_birth: new Date(dateOfBirth),
      },
      include:{
        Likes:true,
      }
    });

    const token = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );
    return res
      .cookie("auth_token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        secure: process.env.NODE_ENV === "production",
      })
      .status(201)
      .json({ success: true, message: "successfully registered", newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong when registering",
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;
    if (req.cookies?.auth_token)
      return res
        .status(400)
        .json({ success: false, message: "auth_token already exists" });
    let user;
    let noUserMsg;
    if (email.trim() === "") {
      // login with username
      user = await prisma.user.findUnique({
        where: { username: username.trim() },
        include:{Likes:true}
      });
      noUserMsg = "Incorrect username or password";
    } else {
      // login with email
      user = await prisma.user.findUnique({
        where: { email: email.trim().toLowerCase() },
        include:{Likes:true}
      });
      noUserMsg = "Incorrect email or password";
    }
    if (!user)
      return res.status(400).json({ success: false, message: noUserMsg });

    // check passwords
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword)
      return res.status(400).json({ success: false, message: noUserMsg });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );
    return res
      .cookie("auth_token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({ success: true, message: "User logged in succesfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong when logging in",
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({include:{Likes:true}});
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong when getting all users",
    });
  }
};

const getLoggedInUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } , include:{Likes:true}});
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid user id" });
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong when getting authenticated user",
    });
  }
};

const logoutUser = async (req:Request,res:Response) => {
  try {
    const userId = req.userId;
    const user = await prisma.user.findUnique({where:{id:userId}});
    if(!user) return res.status(400).json({"success":false,"message":"userid not valid"});
    res.status(200).clearCookie('auth_token').json({"success":true,"message":"user logged out"});
  } catch (error) {
    console.log(error);
    return res.status(500).json({"success":false,"message":"Something went wrong when logging out"});
  }

}


export { registerUser, getAllUsers, loginUser, getLoggedInUser,logoutUser};
