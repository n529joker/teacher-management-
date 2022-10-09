const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const ejs =  require('ejs');
const app = express();
const teacherModel = require('./model')
require('dotenv/config');
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URL, console.log('DB connected!'))

global.__basedir = __dirname 

//creates and uploads folder and store images in
let storage = multer.diskStorage({ 
    destination:(req, file, cb)=>{
        //632fa647ec241c11de149005
        cb(null, 'uploads')
    },
    filename:(req, file, cb)=>{ 
        cb(null, file.fieldname +'njr'+file.originalname)
    }
})
let upload = multer({storage:storage})

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'ejs');
app.listen(port,console.log(`Live on ${port}`));
app.get('/',(req, res, next)=>{
    res.render('index.ejs');
    next();
})
app.get('/register',(req, res,next)=>{
    res.render('register.ejs');
    next();
})
app.get('/login',(req, res, next)=>{
    res.render('login.ejs')
    next()
})

app.post('/login',async(req, res, next)=>{
    if(req.body.username == process.env.NAME && req.body.password == process.env.PASSWORD){
        let numstud = await teacherModel.countDocuments({})       
    let data = await teacherModel.find({}).sort({name: 1}) 
    let obj = {
        num: numstud,
        teachers: data
    }
    console.log(obj.teachers);
    res.render('teachers.ejs',{obj: obj})
    }else{
        res.redirect('/login?error='+encodeURIComponent('Err'))
    }
    next()
})
app.get('/teachers/deleteid',async(req, res)=>{
    let id = req.query;
    await teacherModel.deleteOne({_id: id})
   res.redirect('/login')
})
app.get('/teachers/editid',async(req, res)=>{
    let id = req.query.editid;
    console.log(id) 
    teacherModel.findById(id, (err, docs)=>{
        err?console.log(err): res.render('edit.ejs',{docs: docs});
    })
})
app.post('/edit',upload.single('image'), async (req, res, next)=>{
    let info = {
        name: req.body.name.toUpperCase(),
        dob: req.body.dob,
        pob:req.body.pob,
        sdo:req.body.sdo,
        do:req.body.do, 
        ro:req.body.ro,
        mat:req.body.mat,
        subj:req.body.subj,
        grade:req.body.grade,
        dops:req.body.dops,
        num:req.body.num,
        email:req.body.email
        // es:{
        //     data: fs.readFileSync(path.join(__dirname + '/uploads/'+ req.file.filename)),
        //     contentType:match 
        // }
    }
    teacherModel.create(info, (err, item)=>{ 
        if(err){
            console.log(err) 
        }else{
            item.save() 
            res.redirect('/register?error='+encodeURIComponent('ok'))
        }
    })
})

let obj;
let match = ['image/jpeg','image/jpg', 'image/png']
app.post('/register', upload.single('image'), async (req, res, next)=>{
    let info = {
        name: req.body.name.toUpperCase(),
        dob: req.body.dob,
        pob:req.body.pob,
        sdo:req.body.sdo,
        do:req.body.do, 
        ro:req.body.ro,
        mat:req.body.mat,
        subj:req.body.subj,
        grade:req.body.grade,
        dops:req.body.dops,
        num:req.body.num,
        email:req.body.email
        // es:{
        //     data: fs.readFileSync(path.join(__dirname + '/uploads/'+ req.file.filename)),
        //     contentType:match 
        // }
    }
    teacherModel.create(info, (err, item)=>{ 
        if(err){
            console.log(err) 
        }else{
            item.save() 
            res.redirect('/register?error='+encodeURIComponent('ok'))
        }
    })
})


