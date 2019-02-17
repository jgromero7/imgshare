const controllers = {};
const { Image } = require('../models');
const sidebar = require('../helpers/sidebar');

controllers.index = async (req, res) => {

    const images = await Image.find().sort({ timestamp: -1 });
    let viewModel = {images: []}
    viewModel.images = images
    viewModel = await sidebar(viewModel);
    res.render('index', viewModel);
}

module.exports = controllers;