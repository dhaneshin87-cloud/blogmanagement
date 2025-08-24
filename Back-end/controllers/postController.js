import Post from "../models/Post.js";

export default {
  createPost: async (req, res) => {
    try {
      const decoded = req.user;
      const { title, content } = req.body;

      const post = await Post.create({
        title,
        content,
        authorId: decoded.id,
      });

      res.status(201).json(post);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

 getAllPosts: async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;


    let filter = {};
    if (user && user.role === "admin") {
      filter = {};
    } else if (id) {
      filter = { authorId: id };
    }


    const posts = await Post.find(filter).populate("authorId", "name email");

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
},

  

  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id).populate("authorId", "name email");
      if (!post) return res.status(404).json({ message: "Post not found" });
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  updatePost: async (req, res) => {
    try {
      const decoded = req.user;
      const { id } = req.params;
      const { title, content } = req.body;

      const post = await Post.findById(id);
      if (!post) return res.status(404).json({ message: "Post not found" });

      if (post.authorId.toString() !== decoded.id && decoded.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
      }

      post.title = title || post.title;
      post.content = content || post.content;
      await post.save();

      res.status(200).json(post);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  deletePost: async (req, res) => {
    try {
      const decoded = req.user;
      const { id } = req.params;

      const post = await Post.findById(id);
      if (!post) return res.status(404).json({ message: "Post not found" });

      if (post.authorId.toString() !== decoded.id && decoded.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
      }

      await post.deleteOne();
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};
