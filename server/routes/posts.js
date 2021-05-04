const { Router } = require("express");
const { requireUser } = require("../middleware/auth");
const {
  createPost,
  getAllPost,
  updatePost,
  deletePost,
} = require("../services/post");

const Post = require("../model/Post");

const postRouter = Router({ mergeParams: true });

postRouter
  .get("/", requireUser, (req, res, next) => {
    const userID = req.user._id;
    getAllPost(userID)
      .then((posts) => {
        res.json({ success: true, posts: posts });
      })
      .catch((error) => {
        console.log(error);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      });
  })
  .post("/", requireUser, async (req, res, next) => {
    console.log(req.body);
    const { title, description, url, status } = req.body;
    const userID = req.user._id;

    if (!title)
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });

    await createPost(title, description, url, status, userID)
      .then((createdPost) => {
        return res.json({ success: true, message: createdPost });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal error" });
      });
  })
  .put("/:id", requireUser, (req, res, next) => {
    const { title, description, url, status } = req.body;
    if (!title)
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    const userID = req.user._id;
    let updatedPost = {
      title,
      description: description || "",
      url: (url.startsWith("https://") ? url : `https://${url}`) || "",
      status: status || "TO LEARN",
    };
    const updateCondition = { _id: req.params.id, user: userID };
    updatePost(updatedPost, updateCondition)
      .then((updatedPost) => {
        res.json({ success: true, updatedPost: updatedPost });
      })
      .catch((error) => {
        console.log(error);
        res.status(401).json({
          success: false,
          message: "Post not found or user not authorised",
        });
      });
  })
  .delete("/:id", requireUser, (req, res, next) => {
    const userID = req.user._id;
    const deleteCondition = { _id: req.params.id, user: userID };
    deletePost(deleteCondition)
      .then(() => {
        res.json({ success: true, message: "Delete successfully" });
      })
      .catch((error) => {
        console.log(error);
        res
          .status(500)
          .json({ success: false, message: "Something went wrong" });
      });
  });

module.exports = postRouter;
