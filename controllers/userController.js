const { User, Thought } = require('../models');

module.exports = {
  // Get All Users
  async getUsers(req, res) {
    try {
      const users = await User.find()

      .populate({ path: 'thoughts', select: '-__v' })
      .populate({ path: 'friends', select: '-__v' });
      
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Get a User
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })

      .populate({ path: 'thoughts', select: '-__v' })
      .populate({ path: 'friends', select: '-__v' });

      if (!user) {
        return res.status(404).json({ message: 'No user with that id' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Create User
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Update User
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!user) {
        res.status(404).json({ message: 'No user with that id' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete User
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if (!user) {
        res.status(404).json({ message: 'No user with that id' });
      }

      await Thought.deleteMany({ _id: { $in: user.thoughts }});
      res.json({ message: 'User has been deleted' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Add Friend
  async addFriend(req, res) {
    try {
      const friend = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId }},
        { runValidators: true, new: true }
      );

      if (!friend) {
        return res.status(404).json({ message: 'No friend with that id' });
      }

      return res.status(200).json(friend);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete Friend
  async deleteFriend(req, res) {
    try {
      const friend = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId }},
        { runValidators: true, new: true }
      );

      if (!friend) {
        return res.status(404).json({ message: 'No friend wit that id' });
      }

      res.json(friend);
    } catch (err) {
      res.status(500).json(err);
    }
  }
};