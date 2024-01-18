const express = require('express')
const multer  = require('multer')
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const uploadMiddleware = multer({ dest: 'uploads/' })
const fs = require('fs');

const salt = bcrypt.genSaltSync(10);
const secret = 'ar33w9vnb20gniur93nbauf';

const app = express()
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

app.use(cors({credentials:true , origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static(__dirname+'/uploads'));
mongoose.connect('mongodb+srv://amritpandey8076:Pc7suLPCq6h9RAhC@cluster0.xj5v4wp.mongodb.net/?retryWrites=true&w=majority')


app.post('/register', async (req, res) => {
   const {username,password} = req.body;
   try{
    const userDoc = await User.create({
        username,
        password:bcrypt.hashSync(password,salt),
       })
       res.json(userDoc);
   }catch(e){
    res.status(400).json(e);
   }
   
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userDoc = await User.findOne({ username });
        
        // Check if userDoc is null or undefined
        if (!userDoc) {
            return res.status(400).json('User not found');
        }

        // Compare passwords only if userDoc is not null or undefined
        const passOk = bcrypt.compareSync(password, userDoc.password);

        if (passOk) {
            // Logged in
            jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json({
                    id:userDoc._id,
                    username,
                });
            });
        } else {
            res.status(400).json('Wrong credentials');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json('Internal server error');
    }
});


app.get('/profile', (req, res) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, secret, {}, (err, info) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Unauthorized: Token expired' });
            } else {
                return res.status(401).json({ message: 'Unauthorized: Invalid token' });
            }
        }

        // If verification is successful, send the decoded information in the response
        res.json(info);
    });
});


app.post('/logout', (req,res) => {
    // Clear the token cookie on the server side
    res.cookie('token', '', { expires: new Date(0) }).json('ok');
});

app.post('/post',uploadMiddleware.single('file'), async(req,res) =>{
    const { originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length -1];
    const newPath = path+'.'+ext;
    fs.renameSync(path,newPath);

    const { token } = req.cookies;

    
    jwt.verify(token, secret, {}, async(err, info) => {
        if (err) throw err;
        const {title,summary,content} = req.body;
        const postDoc = await Post.create({
          title,
          summary,
          content,
          cover:newPath,
          author:info.id,
         });
        // If verification is successful, send the decoded information in the response
         res.json(postDoc);
    });

   

});
 

app.get('/post', async(req,res)=>{
    
res.json(await Post.find()
.populate('author',['username'])
.sort({createdAt:-1})
.limit(500));
});


app.get('/post/:id', async (req,res)=>{
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author',['username']);
    res.json(postDoc);
})

//serving the frontend
app.use(express.static(path.join(__dirname, "frontend/build")))

app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname, "frontend",'build','index.html')),
    function(err){
        res.status(500).send(err)
    }
})
app.listen(4000);

//
//mongodb+srv://amritpandey8076:Pc7suLPCq6h9RAhC@cluster0.xj5v4wp.mongodb.net/?retryWrites=true&w=majority