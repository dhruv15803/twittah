import { Request, Response } from "express";
import { prisma } from "../index.js";

const createPost = async (req: Request, res: Response) => {
  try {
    const {
      post_text,
      post_images,
    }: { post_text: string; post_images: string[] } = req.body;
    let parent_post_id: string;
    if (!req.query.parent_id) {
      parent_post_id = "";
    } else {
      parent_post_id = req.query.parent_id as string;
    }
    const userId = req.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid user id" });

    const parentPost = await prisma.post.findUnique({
      where: { id: parent_post_id },
    });
    const newPost = await prisma.post.create({
      data: {
        post_text: post_text,
        post_images: post_images,
        post_author_id: user.id,
        parent_post_id: parentPost ? parentPost.id : null,
      },
      include: {
        _count:{select:{Post:true,Likes:true}},
        post_author: {
          select: {
            id: true,
            profile_picture: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return res
      .status(201)
      .json({ success: true, message: "created post", newPost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong when creating post",
    });
  }
};

const getPost = async (req: Request, res: Response) => {
  try {
    const { post_id } = req.params;
    const post = await prisma.post.findUnique({
      where: { id: post_id },
      include: {
        _count:{select:{Post:true,Likes:true}},
        post_author: {
          select: {
            id: true,
            profile_picture: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    if (!post)
      return res
        .status(400)
        .json({ success: false, message: "Invalid post id" });
    return res.status(200).json({ success: true, post });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong when getting post",
    });
  }
};

const getPostsByParent = async (req: Request, res: Response) => {
  try {
    const { parent_id } = req.params;
    let posts;
    if(!req.query.page || !req.query.pageLimit) {
      posts = await prisma.post.findMany({
        where: { parent_post_id: parent_id },
        include: {
          _count:{select:{Post:true,Likes:true}},
          post_author: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              username: true,
              profile_picture: true,
            },
          },
        },
        orderBy:{createdAt:"desc"}
      });
    } else {
      const page = parseInt(req.query.page as string);
      const pageLimit = parseInt(req.query.pageLimit as string);
      const skip = page * pageLimit - pageLimit;
      posts = await prisma.post.findMany({
        where:{parent_post_id:parent_id},
        include:{
          _count:{select:{Post:true,Likes:true}},
          post_author:{
            select:{
              id:true,
              email:true,
              username:true,
              firstName:true,
              lastName:true,
              profile_picture:true,
            }
          }
        },
        skip:skip,
        take:pageLimit,
        orderBy:{createdAt:"desc"}
      });
    }
    return res.status(200).json({ success: true, posts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong when getting posts by parent",
    });
  }
};

const getAllPosts = async (req: Request, res: Response) => {
  try {
    let posts = [];
    if (!req.query?.page || !req.query?.pageLimit) {
      posts = await prisma.post.findMany({
        where: { parent_post_id: null },
        include: {
          _count: { select: { Post: true,Likes:true}},
          post_author: {
            select: {
              id: true,
              email: true,
              username: true,
              profile_picture: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      const page = parseInt(req.query.page as string);
      const pageLimit = parseInt(req.query.pageLimit as string);
      const skip = page * pageLimit - pageLimit;
      posts = await prisma.post.findMany({
        skip: skip,
        take: pageLimit,
        where: { parent_post_id: null },
        include: {
          _count:{select:{Post:true,Likes:true}},
          post_author: {
            select: {
              id: true,
              email: true,
              username: true,
              profile_picture: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }
    return res.status(200).json({ success: true, posts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong when fetching posts",
    });
  }
};


const createOrDeleteLike = async (req:Request,res:Response) => {
  try {
    const {post_id} = req.body;
    const userId = req.userId;
    const post = await prisma.post.findUnique({where:{id:post_id}});
    const user = await prisma.user.findUnique({where:{id:userId}});
    if(!post || !user) return res.status(400).json({"success":false,"message":"No user or post available"});
    let responseMsg;
    // check if like already exists on post by user
    const like = await prisma.likes.findFirst({where:{AND:[{liked_by_id:user.id},{liked_post_id:post.id}]}});
    if(like) {
      await prisma.likes.delete({where:{liked_by_id_liked_post_id:{
        liked_by_id:like.liked_by_id,
        liked_post_id:like.liked_post_id,
      }}});
      responseMsg = "removed like from post"
    } else {
      const newLike = await prisma.likes.create({data:{liked_by_id:user.id,liked_post_id:post.id}});
      responseMsg = "liked post"
    }
    return res.status(201).json({"success":true,"message":responseMsg});
  } catch (e) {
    console.log(e);
    return res.status(500).json({"success":false,"message":"Something went wrong when liking a post"});
  }
}



export { createPost, getPost, getPostsByParent, getAllPosts,createOrDeleteLike };
