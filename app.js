const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mysql = require('mysql');

const app = express();

app.use(cookieParser());


app.use(session({
secret:'secret',
resave:false,
saveUninitialized:false,
cookie:{
maxAge:null
}}));


const port = 6789;


app.use(function(req, res, next) {
  res.locals.loggedName = req.session.loggedName;
  next();
});



// VARIABILE


const fs = require('fs');

const Qlist = [
	{
		question: 'Question 1',
		answer: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
		correct: 0
	},
	{
		question: 'Question 2',
		answer: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
		correct: 0
	},
	{
		question: 'Question 3',
		answer: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
		correct: 0
	},
	{
		question: 'Question 4',
		answer: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
		correct: 0
	}
];


var Alist=[];


//APP STUFF


// directorul 'views' va conține fișierele .ejs (html + js executat la server)
app.set('view engine', 'ejs');
// suport pentru layout-uri - implicit fișierul care reprezintă template-ul site-ului este views/layout.ejs
app.use(expressLayouts);
// directorul 'public' va conține toate resursele accesibile direct de către client (e.g., fișiere css, javascript, imagini)
app.use(express.static('public'))
// corpul mesajului poate fi interpretat ca json; datele de la formular se găsesc în format json în req.body
app.use(bodyParser.json());
// utilizarea unui algoritm de deep parsing care suportă obiecte în obiecte
app.use(bodyParser.urlencoded({ extended: true }));

// la accesarea din browser adresei http://localhost:6789/ se va returna textul 'Hello World'
// proprietățile obiectului Request - req - https://expressjs.com/en/api.html#req
// proprietățile obiectului Response - res - https://expressjs.com/en/api.html#res

// LABORATOR 10!!
//app.get('/', (req, res) => res.send('Hello World! :) '));



// la accesarea din browser adresei http://localhost:6789/chestionar se va apela funcția specificată



// RUTE PROIECT: 



app.get('/quiz', (req, res) => {


	console.log("QUIZ PAGE");
	res.render('quiz', {Qlist: Qlist});
});



app.post('/quizResult', (req, res) => {
	

	console.log("QUIZ RESULT PAGE");
	fs.readFile('quizQA.json',(err,data) => {
		//if(err) throw err;
		var nur=0;
		var nr=0;
		var i=0;
		for(i in req.body)
		{
			console.log(Qlist[parseInt(i.substring(1))].correct);
			//console.log(intrebari[0].corect)
			if(req.body[i]== Qlist[parseInt(i.substring(1))].correct){
				nr++;

			}
		}

		console.log(Alist);
		console.log(nr);
		
		res.render('quizResult', {answers: nr});
	});
});





app.get('/', (req,res) => {

	console.log("HOME");
	res.render('index',{user:req.cookies.user});
	//console.log('Cookies: ', req.cookies)
});


app.get('/login', (req, res) => {
	res.clearCookie("errorMsg");
	console.log("LOGIN");	
	res.render('login',{errorMsg:req.cookies.errorMsg});
});



app.get('/lostPass', (req, res) => {
	
	console.log("LOST PASS");	
	res.render('lostPass');
});



app.post('/login-verif', (req, res) => {
	


	fs.readFile('users.json',(err,data) => {
		
		if(err) throw err;

		console.log("AUTHENTICATION VERIFICATION");

		console.log("REQ BODY"+ req.body);

		var udata=JSON.parse(data);
		var i=0;
		let ok=0;
		var raspuns=0;
		
		for(i in udata.users) {
			
			//console.log("UTILIZATOR"+req.body.user);
			//console.log("ELEM"+udata.users[i].user);
			//console.log(udata.users[i].password);
			if(req.body.user==udata.users[i].user && req.body.password==udata.users[i].password)
			{
				ok=1;
				
			}

			console.log(ok);
		}

			if(ok ==0)
			{
			

				console.log("Username or password is incorrect!");	

				res.cookie('errorMsg' ,"Username or password is incorrect!",{ maxAge: 1 * 60 * 1000, httpOnly: true });
				res.redirect('/login');
				//res.render('autentificare');
			
			}
			else
			{	
				console.log("Login successfully!!");
				req.session.loggedName = req.body.user;
				res.cookie("user", req.body.user,{ maxAge: 2 * 60 * 1000, httpOnly: true });
				res.redirect('/');
				//res.render('index',{user:req.body.user});
			}
	});
	
});

app.get('/logout',  function (req, res, next)  {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});





app.get('/creare-bd', (req,res) => {

var mysql = require('mysql');
var con = mysql.createConnection({
 host:"localhost",
 user:"admin",
 password:"admin"
});

	con.connect(function(err) {
  		
  		if (err) throw err;
  		console.log("CONECTAT la MYSQL!");
  	
  		con.query("CREATE DATABASE cumparaturi", function (err, result) {
    	
    		if (err) throw err;
    		console.log("BAZA DE DATE cumparaturi CREATA");
  		});


  		var sql = "CREATE TABLE produse (nume VARCHAR(255))";
  		
  		con.query(sql, function (err, result) {
    
    		if (err) throw err;
    		console.log("TABEL produse CREAT");

		});
	});

	res.redirect('/');
	
});


/*

app.put('/inserare-bd', (req,res) => {

	
	con.connect(function(err) {
  		
  		if (err) throw err;
  		console.log("CONECTAT la MYSQL!");
  	
  	
  		var sql = "INSERT INTO produse (name) VALUES ('produs1')";
  		
  		con.query(sql, function (err, result) {
    
    		if (err) throw err;
    		console.log("produs1 ADAUGAT");

		});
	
  	});
	res.redirect('/');
	
});


app.get('/afisare-bd', (req,res) => {

	
	con.connect(function(err) {
  		
  		if (err) throw err;
  		console.log("CONECTAT la MYSQL!");
  	
  	
  		var sql = "SELECT * FROM produse";
  		
  		con.query(sql, function (err, result,fields) {
    
    		if (err) throw err;
    		console.log("Baza de date AFISATA");

		});
	
  	});
	res.render('/');
	
});

*/

app.listen(port, () => console.log(`Serverul rulează la adresa http://localhost:`));