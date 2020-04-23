const express = require('express');
const router = express.Router();
const pool = require('../database');

const { isLoggedIn } = require('../lib/auth') ;

router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    console.log(req.body);
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url, 
        description,
        user_id: req.user.id
    };
    console.log(newLink);
    await pool.query('INSERT INTO links set ?', [newLink]);
    req.flash('success', 'Link saved successfully');
    // pool.query('INSERT INTO links set ?', [newLink], function (err, result) {
    //     if (!err) {
    //         //console.log(err);
    //         console.log(res);
    //         console.log(result);
    //     } else {
    //     }
    // });
    //res.send('recibido');
    res.redirect('/links');
});

router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    //console.log(links);
    //res.send('listas a mostrar');
    res.render('links/list', { links });
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    console.log(req.params.id);
    console.log(req.params);
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE id = ?', [id]);
    // pool.query('DELETE FROM links WHERE id = ?', [id], (err, result) => {
    // });
    //res.send('DELETED')
    req.flash('success', 'Link Removed successfully!');
    res.redirect('/links');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => { 
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ? ', [id]);
    res.render('links/edit', { link: links[0] });
    //console.log(id);
    //res.send('id recibido');
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description
    };
    console.log(newLink);
    //res.send('UPDATED');
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Link Updated Successfully');
    res.redirect('/links');
 });

module.exports = router;