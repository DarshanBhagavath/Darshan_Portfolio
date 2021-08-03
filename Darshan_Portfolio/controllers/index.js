var express = require('express');
var router = express.Router();

const fs = require('fs');

router.get('/', (req, res) => {
    res.render('home');
});

router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/projects', (req, res) => {
    res.render('projects');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});


router.get('/CV', (req, res) => {
    const File = "./public/images/Resume.pdf";
    fs.readFile(File, (err, data) => {
        res.contentType("application/pdf");
        res.send(data);
    });
});

module.exports = router;
//app.listen(process.env.PORT || 1000, () => console.log('Server Started...'));