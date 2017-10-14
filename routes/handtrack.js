const express = require('express'),
    router = express.Router(),
    fs = require('fs');
// const csv = require('csv');
const json2csv = require('json2csv');
//const app = express();
//const bp = require('body-parser')
//const fs = require('fs');
console.log(__dirname);
//app.use('/',express.static(__dirname+'/public'));
console.log('works ri');

//app.use(bp.urlencoded({extended: true}));
//app.use(bp.json());
router.get('/handtrack', isLoggedIn, (req,res)=>{
    res.render('seq',{
        page:'hand'
    });
});

router.post('/receivejson',(req,res)=>{

    let objRead = JSON.parse(fs.readFileSync(__dirname+'/../public/jshggamify/savedJSON/sample.json').toString());
    console.log("Read",objRead);
    var k;
    if(req.body.data <= 20){
        k = 0;
    } else if(req.body.data <= 35){
        k = 1;
    } else if(req.body.data <= 65){
        k = 2;
    } else {
        k = 3;
    }
    var obj = {day:objRead["deviations"].length+1,dev: req.body.data,stage: k};
    // console.log("Print working directory:"+__dirname);
   console.log(obj);
   console.log("xyxyxyx");
    objRead["deviations"].push(obj);
    console.log("now",objRead);
    fs.writeFileSync(__dirname+'/../public/jshggamify/savedJSON/sample.json',JSON.stringify(objRead),'utf8',()=>{
        console.log('success');
    });
    var fields = ['day', 'dev', 'stage'];

    try {
        var result = json2csv({ data: objRead["deviations"], fields: fields });
        console.log(result);
        fs.writeFileSync(__dirname+'/../public/jshggamify/savedJSON/sample.csv', result, function(err) {
            if (err) throw err;
            console.log('file saved');
        });
    } catch (err) {
        // Errors are thrown for bad options, or if the data is empty and no fields are provided.
        // Be sure to provide fields if it is possible that your data array will be empty.
        console.error(err);
    }
    res.send(true);
    //res.render('/public/cs3282/redirected',{root: __dirname});
});

function isLoggedIn(req,res,next) {
   if(req.isAuthenticated()){
      return next();
   }
   req.flash('error', 'You must login first');
   res.redirect('/login');
}

module.exports = router;