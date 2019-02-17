const controllers = {};
const path = require('path');
const fs = require('fs-extra');
const md5 = require('md5');
const sidebar = require('../helpers/sidebar');
const { randomAlphaNum } = require('../helpers/libs');

// Models
const { Image, Comment } = require('../models');

controllers.index = async (req, res) => {
    let viewModel = { image: {}, comments: {} };
    const image_id = req.params.image_id;
    const image = await Image.findOne({ filename: {$regex: image_id} });
    
    if ( image ) {
        image.views = image.views + 1;
        await image.save();
        viewModel.image = image;
        const comments = await Comment.find({ image_id: image._id });
        viewModel.comments = comments
        viewModel = await sidebar(viewModel);
        res.render('image', viewModel);
    }else{
        res.redirect('/');
    }    
};

controllers.create = (req, res) => {
    
    const saveImge = async () => {
        const imgUrl = randomAlphaNum();
        const images = await Image.find({filename: imgUrl});
        if ( images.length > 0 ) {
            saveImge();
        } else {
            const { title, description } = req.body;
            const imageTempPath = req.file.path;
            const ext = path.extname(req.file.originalname).toLowerCase();
            const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`);
            
            if ( ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif' ) {
                // Save IMG
                await fs.rename(imageTempPath, targetPath);
                const newImg = new Image({
                    title: title,
                    description: description,
                    filename: imgUrl + ext,
                });

                const imageSaved = await newImg.save();
                
                res.redirect('/images/' + imgUrl);
            } else {
                // Remove IMG
                await fs.unlink(imageTempPath);
                res.status(500).json({ message: 'Only Images are allowed' });
            }
        }
    };

    saveImge();    
};

controllers.like = async (req, res) => {
    const image_id = req.params.image_id;

    const image = await Image.findOne({ filename: {$regex: image_id} });

    if ( image ) {
        image.likes = image.likes + 1;
        await image.save();

        res.json({likes: image.likes});
    } else {
        res.status(500).json({ error: 'Internal Error' });
    }

};

controllers.comment = async (req, res) => {
    const image_id = req.params.image_id;
    const image = await Image.findOne({ filename: {$regex: image_id} });

    if ( image ) {
        const newComment = new Comment(req.body);
        newComment.gravatar = md5(newComment.email);
        newComment.image_id = image._id
        await newComment.save()
        res.redirect('/images/'+ image.uniqueId);
    } else {
        res.redirect('/');
    }
};

controllers.delete = async (req, res) => {

    const image_id = req.params.image_id;
    const image = await Image.findOne({ filename: {$regex: image_id} });

    if ( image ) {
        await fs.unlink(path.resolve('./src/public/upload/'+image.filename));
        await Comment.deleteOne({ image_id: image._id });
        await image.remove();

        res.json(true);
    } else {
        res.status(500).json({ error: 'Internal Error' });
    }
    
};


module.exports = controllers;