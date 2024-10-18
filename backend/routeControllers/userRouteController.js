import User from "../Models/userModel.js";
import Conversation from "../Models/conversationModel.js";

export const getUserBySearch = async (req, res) => {
  try {
    const search = req.query.search || "";
    const currentUserID = req.user._id;
    const user = await User.find({
      $and: [
        {
          $or: [
            { username: { $regex: ".*" + search + ".*", $options: "i" } },
            { fullname: { $regex: ".*" + search + ".*", $options: "i" } },
          ],
        },
        {
          _id: { $ne: currentUserID },
        },
      ],
    })
      .select("-password")
      .select("email");

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error,
    });
    console.log(error);
  }
};

export const getCurrentChatters = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const currentChatters = await Conversation.find({
      participants: currentUserId,
    }).sort({
      updatedAt: -1,
    });

    if (!currentChatters || currentChatters.length === 0)
      return res.status(200).send([]);

    const participantsIDS = currentChatters.reduce((ids, conversation) => {
      const otherparticipants = conversation.participants.filter(
        (id) => id !== currentUserId
      );
      return [...ids, ...otherparticipants];
    }, []);

    const otherparticipantsIDS = participantsIDS.filter(
      (id) => id.toString() !== currentUserId.toString()
    );

    const user = await User.find({ _id: { $in: otherparticipantsIDS } })
      .select("-password")
      .select("-email");

    const users = otherparticipantsIDS.map((id) =>
      user.find((user) => user._id.toString() === id.toString())
    );

    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
    console.log(error);
  }
};
