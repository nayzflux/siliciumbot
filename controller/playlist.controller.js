const PlaylistModel = require("../models/playlist.model");
const userHelper = require(`../helpers/user.helper`);

const createPlaylist = async (name, creatorId, callback) => {
    if (await PlaylistModel.exists({ name: name })) return callback(true);

    const playlist = await PlaylistModel.create({ name: name, creator_id: creatorId, songs: [] });
    const creator = await userHelper.getUserById(playlist.creator_id);

    return callback(false, { name: playlist.name, creator: creator, songs: playlist.songs });
}

const deletePlaylist = async (name, deletorId, callback) => {
    if (!await PlaylistModel.exists({ name: name })) return callback(true);

    const playlist = await PlaylistModel.findOne({ name: name });

    if (playlist.creator_id !== deletorId) return callback(true);

    const deletedPlaylist = await PlaylistModel.findOneAndRemove({ name: name });
    const creator = await userHelper.getUserById(deletedPlaylist.creator_id);

    return callback(false, { name: deletedPlaylist.name, creator: creator, songs: deletedPlaylist.songs });
}

const getPlaylist = async (name, callback) => {
    if (!await PlaylistModel.exists({ name: name })) return callback(true);

    const playlist = await PlaylistModel.findOne({ name: name });
    const creator = await userHelper.getUserById(playlist.creator_id);

    return callback(false, { name: playlist.name, creator: creator, songs: playlist.songs });
}

const getPlaylists = async (callback) => {
    const playlists = await PlaylistModel.find();

    const playlistsResolved = [];

    for (const playlist of playlists) {
        const creator = await userHelper.getUserById(playlist.creator_id);
        playlistsResolved.push({ name: playlist.name, creator: creator, songs: playlist.songs });
      }

    return callback(false, playlistsResolved);
}

const updatePlaylist = async (name, updaterId, data, callback) => {
    if (!await PlaylistModel.exists({ name: name })) return callback(true);

    const playlist = await PlaylistModel.findOne({ name: name });

    if (playlist.creator_id !== updaterId) return callback(true);

    const updatedPlaylist = await PlaylistModel.findOneAndUpdate({ name: name }, data, { new: true });
    const creator = await userHelper.getUserById(updatedPlaylist.creator_id);

    return callback(false, { name: updatedPlaylist.name, creator: creator, songs: updatedPlaylist.songs });
}

const addSong = async (name, updaterId, song, callback) => {
    if (!await PlaylistModel.exists({ name: name })) return callback(true);

    const playlist = await PlaylistModel.findOne({ name: name });

    if (playlist.creator_id !== updaterId) return callback(true);

    const updatedPlaylist = await PlaylistModel.findOneAndUpdate({ name: name }, { $addToSet: { songs: song } }, { new: true });
    const creator = await userHelper.getUserById(updatedPlaylist.creator_id);

    return callback(false, { name: updatedPlaylist.name, creator: creator, songs: updatedPlaylist.songs });
}

const removeSong = async (name, updaterId, song, callback) => {
    if (!await PlaylistModel.exists({ name: name })) return callback(true);

    const playlist = await PlaylistModel.findOne({ name: name });

    if (playlist.creator_id !== updaterId) return callback(true);

    const updatedPlaylist = await PlaylistModel.findOneAndUpdate({ name: name }, { $pull: { songs: song } }, { new: true });
    const creator = await userHelper.getUserById(updatedPlaylist.creator_id);

    return callback(false, { name: updatedPlaylist.name, creator: creator, songs: updatedPlaylist.songs });
}

module.exports = {
    createPlaylist,
    deletePlaylist,
    getPlaylist,
    getPlaylists,
    updatePlaylist,
    addSong,
    removeSong
}