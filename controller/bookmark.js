const Bookmark = require("../models/Bookmark");
const createError = require("../services/error");
const { getWhoSendRequest } = require("./authentication");

function existID(obj, next) {
  if (obj === null) {
    return next(createError(404, "Id not found"));
  }
}

/* ------------------------------ Add Bookmark ------------------------------ */
const addBookmark = async (req, res, next) => {
  // const {restaurantId:, username} = req.params;
  const restaurantId = req?.params?.restaurantId;
  const username = getWhoSendRequest(req).username;

  try {
    let insertBookmark = await Bookmark.create({
      restaurantId: restaurantId,
      username: username,
    });
    if (insertBookmark) {
      const bookmark = await Bookmark.findOne({ username });
      await getBookmarks(req, res, next);
    } else {
      next(createError(403, "Add Failed"));
    }
  } catch (error) {
    next(error);
  }
};

/* ----------------------------- Remove bookmark ---------------------------- */
const removeBookmark = async (req, res, next) => {
  const restaurantId = req?.params?.restaurantId;
  const username = getWhoSendRequest(req).username;

  try {
    let bookmark = await Bookmark.deleteOne({ restaurantId, username });
    if (bookmark?.deletedCount > 0) {
      await getBookmarks(req, res, next);
    } else {
      next(createError(403, "Remove Failed"));
    }
  } catch (error) {
    next(error);
  }
};

const getBookmarks = async (req, res, next) => {
  const username = getWhoSendRequest(req).username;

  try {
    let bookmarks = await Bookmark.aggregate([
      {
        $match: {
          username: username,
        },
      },
      {
        $lookup: {
          let: { restaurantObjId: { $toObjectId: "$restaurantId" } },
          from: "restaurants",
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$restaurantObjId"] } } },
          ],
          as: "restaurant",
        },
      },
      { $unwind: "$restaurant" },
    ]);
    if (bookmarks?.length > 0) {
      res.status(200).json({
        bookmarks,
      });
    } else {
      res.status(200).json({ bookmark: null });
    }
  } catch (error) {
    next(error);
  }
};

/* --------------------------- Get One Bookmark By Id --------------------------- */
const getOneBookmarkById = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
    existID(bookmark, next);
    res.status(200).json(bookmark);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addBookmark,
  removeBookmark,
  getBookmarks,
  getOneBookmarkById,
};
