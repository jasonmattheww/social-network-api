const { Thought, User } = require('../models');

module.exports = {
  // Get All Thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Get a Thought
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v');

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that id' });
      }

      return res.status(200).json(thought);
    } catch (err) {
     return res.status(500).json(err);
    }
  },
  // Create a Thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);

      const user = await User.findByIdAndUpdate(
        req.body.userId,
        { $addToSet: { thoughts: thought._id }},
        { runValidators: true, new: true }
      );

      res.json({ thought, user });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  // Update Thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        res.status(404).json({ message: 'No thought with this id' });
      }

      res.json(thought);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  // Delete Thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that id' });
      }

      return res.status(200).json({ message: 'Thought has been deleted' });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  // Add Reaction
  async addReaction(req, res) {
    try {
      const reaction = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body }},
        { runValidators: true, new: true }
      );

      if (!reaction) {
        return res.status(404).json({ message: 'No reaction found with that id' });
      }

      res.json(reaction);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  // Delete Reaction
  async deleteReaction(req, res) {
    try {
      const reaction = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { _id: req.params.reactionId }}},
        { runValidators: true, new: true }
      );

      if (!reaction) {
        return res.status(404).json({ message: 'No reaction with that id' });
      }

      res.json(reaction);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
};