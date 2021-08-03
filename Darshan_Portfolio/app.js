const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const fs = require('fs');

var indexRouter = require('./controllers/index');

const app = express();

//View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');

//Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.post('/send', (req, res) => {

    const output = `

        		<p>You have a new contact request!</p>
        		<h3>Contact Details:</h3>
        		<ul>
        			<li>Email: ${req.body.email}</li>
        			<li>Name : ${req.body.name}</li>
        			<li>Phone: ${req.body.phone}</li>
        		</ul>
        		<h3>Message</h3>
        		<p>${req.body.message}</p>
        	`;

    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    nodemailer.createTestAccount((err, account) => {

        // Explained as 3 steps process as I explaned in tutorial

        //Step: 1 Create transporter
        let smtpConfig = {
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports. For TLS use port 465
            service: 'gmail',
            auth: {
                user: 'testmailnodejs2@gmail.com', //  user
                pass: 'Test@123' // password
            }
        };

        let transporter = nodemailer.createTransport(smtpConfig);

        //Step: 2 Setup message options
        let mailOptions = {
            from: req.body.email,   // sender address
            to: 'testmailnodejs2@gmail.com', // list of receivers i.e [sneder1, sender2, sender3, ....]
            subject: 'Node Contact Request', // Subject line
            text: 'Hello world?', // plain text body
            html: output // html body
        };
    
        //Step: 3 Send mail using created transport
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.render('contact', { msg: 'Message not sent...Please try again!', val: 'alert alert-danger' });
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            res.render('contact', { msg: 'Message sent..Will get back to you soon!', val: 'alert alert-success' });

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            
        });
    });   

});

app.listen(process.env.PORT || 1000, () => console.log('Server Started...'));   