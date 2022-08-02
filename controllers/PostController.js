import Post from '../models/Post.js';

export const getAll = async (req, res) => {
  try {
    const posts = await Post.find().populate('user');
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    Post.findByIdAndUpdate(postId, { $inc: { viewsCount: 1 } }, { returnDocument: 'after' }, (err, doc) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          message: 'Не удалось получить статью',
        });
      }
      if (!doc) {
        res.status(404).json({
          message: 'Статья не найдена',
        });
      }
      res.json(doc);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статью',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new Post({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      user: req.userId,
      imageUrl: req.body.imageUrl,
    });

    const post = await doc.save();
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать статью',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.body.id;
    Post.findOneAndRemove({ _id: postId }, (err, doc) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: 'Не удалось удалить статью',
        });
      }
      if (!doc) {
        return res.status(404).json({
          message: 'Статья не найдена',
        });
      }
      res.json({ success: true });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось удалить статью',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.body.id;
    await Post.updateOne(
      { _id: postId },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags,
        user: req.userId,
        imageUrl: req.body.imageUrl,
      }
    );
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить статью',
    });
  }
};
