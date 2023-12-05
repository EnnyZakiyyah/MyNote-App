const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Todo = require('../models/Todo');

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

        const count = await Post.estimatedDocumentCount();
        const nextPage = parseInt(page) + 1;
        const prevPage = parseInt(page) - 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);
        const hasPrevPage = prevPage <= Math.ceil(count / perPage);

        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            prevPage: hasPrevPage ? prevPage : null
        });
    } catch (error) {
        console.log(error);
    }


});


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
router.get('/todo', async (req, res) => {
    try {

        let perPage = 10;
        let page = req.query.page || 1;
        const data = await Todo.aggregate([{
                $sort: {
                    createAt: -1
                }
            }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        const count = await Todo.estimatedDocumentCount();
        const nextPage = parseInt(page) + 1;
        const prevPage = parseInt(page) - 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);
        const hasPrevPage = prevPage <= Math.ceil(count / perPage);

        res.render('todo/index', {
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            prevPage: hasPrevPage ? prevPage : null
    });
    } catch (error) {
        console.log(error);
    }
});

/** 
 * POST /
 * TODO
 */
router.post('/todo', async (req, res) => {

    try {

        try {
            const newTodo = new Todo({
                todoList: req.body.todoList
            });
            await Todo.create(newTodo);
            res.redirect('/todo');

        } catch (error) {
            console.log(error);
        }

    } catch (error) {
        console.log(error);
    }
});

/** 
 * GET /
 * Todo - Edit Todo
 */
router.get('/edit-todo/:id', async (req, res) => {

    try {
        
        const locals = {
            title: "Edit Todo"
        }

        const data = await Todo.findOne({ _id: req.params.id });

        res.render('todo/edit-todo', {
            locals,
            data,
        });

    } catch (error) {
        console.log(error);
    }
});

/** 
 * PUT /
 * Todo - Edit Todo
 */
router.put('/edit-todo/:id', async (req, res) => {

    try {
        
        await Todo.findByIdAndUpdate(req.params.id, {
            todoList: req.body.todoList,
            updatedAt: Date.now()
        });

        res.redirect('/todo');

    } catch (error) {
        console.log(error);
    }
});

/** 
 * DELETE /
 * Todo - Delete Todo
 */
router.delete('/delete-todo/:id', async (req, res) => {
    try {
        await Todo.deleteOne( { _id: req.params.id } );
        res.redirect('/todo')
    } catch (error) {
        console.log(error);
    }
});


module.exports = router;