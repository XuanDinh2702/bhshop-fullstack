const Blog = require('../models/blog.model');

// Lấy danh sách bài viết cẩm nang (có phân trang hoặc lấy mới nhất)
exports.getBlogs = async (req, res) => {
  try {
    const { limit } = req.query;
    let blogsQuery = Blog.find().sort({ createdAt: -1 });

    if (limit && !isNaN(limit)) {
      blogsQuery = blogsQuery.limit(parseInt(limit));
    }

    const blogs = await blogsQuery;
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy bài viết', error: error.message });
  }
};

// Lấy chi tiết bài viết theo slug
exports.getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    }
    // Tăng lượt xem
    blog.views = (blog.views || 0) + 1;
    await blog.save();
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
