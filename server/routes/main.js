const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

/** 
 * GET /
 * NOTES
 */
router.get('', async (req, res) => {
    try {
        const locals = {
            title: "My Note",
            description: "Simple Notes created with NodeJS, Express & MongoDB."
        }

        let perPage = 5;
        let page = req.query.page || 1;
        // console.log(Post);
        const data = await Post.aggregate([{
                $sort: {
                    createAt: -1
                }
            }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        // console.log(Post.count());
        const count = await Post.estimatedDocumentCount();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null
        });
    } catch (error) {
        console.log(error);
    }


});

// router.get('', async (req, res) => {
//     const locals = {
//         title: "My Note",
//         description: "Simple Notes created with NodeJS, Express & MongoDB."
//     }

//     try {
//         const data = await Post.find();
//         res.render('index', {locals, data});
//         // console.log(data);
//     } catch (error) {
//         console.log(error);
//     }


// });


/** 
 * GET /
 * Post :id
 */
router.get('/note/:id', async (req, res) => {

    try {

        let slug = req.params.id;

        const data = await Post.findById({
            _id: slug
        });
        const locals = {
            title: data.title,
            description: "Simple Notes created with NodeJS, Express & MongoDB."
        }

        res.render('note', {
            locals,
            data
        });
        // console.log(data);
    } catch (error) {
        console.log(error);
    }


});

/** 
 * POST /
 * Post - searchTerm
 */
router.post('/search', async (req, res) => {

    try {
        const locals = {
            title: "Search",
            description: "Simple Notes created with NodeJS, Express & MongoDB."
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "")

        const data = await Post.find({
            $or: [{
                    title: {
                        $regex: new RegExp(searchNoSpecialChar, 'i')
                    }
                },
                {
                    body: {
                        $regex: new RegExp(searchNoSpecialChar, 'i')
                    }
                }
            ]
        });

        res.render("search", {
            data,
            locals
        });
        // console.log(data);
    } catch (error) {
        console.log(error);
    }
});

/** 
 * GET /
 * Post - Create New Note
 */
router.get('/add-note', async (req, res) => {

    try {
        const locals = {
            title: "Add Note",
            description: "Simple Notes created with NodeJS, Express & MongoDB."
        }

        const data = await Post.find();
        res.render('note/add-note', {
            locals
        });
        // console.log(data);
    } catch (error) {
        console.log(error);
    }
});

/** 
 * POST /
 * Post - Create New Note
 */
router.post('/add-note', async (req, res) => {

    try {

        try {
            const newPost = new Post({
                title: req.body.title,
                body: req.body.body
            });

            await Post.create(newPost);
            res.redirect('/');

        } catch (error) {
            console.log(error);
        }

        // console.log(data);
    } catch (error) {
        console.log(error);
    }

});

/** 
 * GET /
 * Post - Edit Note
 */
router.get('/edit-note/:id', async (req, res) => {

    try {
        
        const locals = {
            title: "Edit Note",
            description: "Simple Notes created with NodeJS, Express & MongoDB."
        }

        const data = await Post.findOne({ _id: req.params.id });

        res.render('note/edit-note', {
            locals,
            data,
        });

        // console.log(data);
    } catch (error) {
        console.log(error);
    }
});

/** 
 * PUT /
 * Post - Edit Note
 */
router.put('/edit-note/:id', async (req, res) => {

    try {
        
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });

        res.redirect('/');

        // console.log(data);
    } catch (error) {
        console.log(error);
    }
});

/** 
 * DELETE /
 * Post - Delete Note
 */
router.delete('/delete-note/:id', async (req, res) => {
    try {
        await Post.deleteOne( { _id: req.params.id } );
        res.redirect('/')
    } catch (error) {
        console.log(error);
    }
});

/** 
 * GET /
 * TODO
 */
router.get('/todo', (req, res) => {
    res.render('todo/index');
});


// function insertPostData () {
//     Post.insertMany([
//         {
//             title: "Building a Note",
//             body: "This is the body text"
//         },
//         {
//             title: "Make a Note with Node JS",
//             body: "Install Node JS"
//         },
//         {
//             title: "Make a UI with Express",
//             body: "Install Express adn use EJS"
//         },
//         {
//             title: "Make a Connection with Database",
//             body: "Use databse with MongoDB and install it"
//         },
//         {
//             title: "Make a UIIIIIII",
//             body: "learn on google for make a UI with EJS"
//         },
//     ])
// }
// insertPostData();

module.exports = router;