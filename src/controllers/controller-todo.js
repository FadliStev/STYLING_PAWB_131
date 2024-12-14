const config = require('../configs/database');
let mysql = require('mysql');
let pool = mysql.createPool(config);

pool.on('error', (err) => {
    console.error(err);
});

module.exports = {
    getTodoList(req, res) {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query('SELECT * FROM todo;', function (error, results) {
                if (error) throw error;
    
                if (results.length > 0) {
                    res.render('todo', {
                        url: 'http://localhost:5050/',
                        todos: results,
                        showNavbar: true,
                        currentPage: 'todo'
                    });
                } else {
                    res.render('todo', {
                        url: 'http://localhost:5050/',
                        todos: [],
                        showNavbar: true,
                        currentPage: 'todo'
                    });
                }
            });
            connection.release();
        });
    },
    
    formTodo(req, res) {
        res.render("addTodo", {
            url: 'http://localhost:5050/',
        });
    },
    
    saveTodo(req, res) {
        let { title, description } = req.body;

        if (title && description) {
            pool.getConnection(function (err, connection) {
                if (err) throw err;
                connection.query(
                    `INSERT INTO todo (judul, deskripsi) VALUES (?, ?);`,
                    [title, description],
                    function (error, results) {
                        if (error) {
                            console.error(error);
                            res.send('Failed to save data');
                            return;
                        }
                        req.flash('color', 'success');
                        req.flash('status', 'Yes..');
                        req.flash('message', 'Data successfully saved');
                        res.redirect('/todo');
                    }
                );
                connection.release();
            });
        } else {
            res.send('Incomplete data');
        }
    },

    editTodo(req, res) {
        const { id } = req.params;
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query('SELECT * FROM todo WHERE id = ?', [id], function (error, results) {
                if (error) throw error;
                if (results.length > 0) {
                    res.render('editTodo', {
                        url: 'http://localhost:5050/',
                        todo: results[0]
                    });
                } else {
                    res.redirect('/todo');
                }
            });
            connection.release();
        });
    },

    updateTodo(req, res) {
        const { id } = req.params;
        const { title, description } = req.body;
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(
                'UPDATE todo SET judul = ?, deskripsi = ? WHERE id = ?',
                [title, description, id],
                function (error, results) {
                    if (error) throw error;
                    res.redirect('/todo');
                }
            );
            connection.release();
        });
    },

    deleteTodo(req, res) {
        const { id } = req.params;
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query('DELETE FROM todo WHERE id = ?', [id], function (error, results) {
                if (error) throw error;
                res.redirect('/todo');
            });
            connection.release();
        });
    },
};