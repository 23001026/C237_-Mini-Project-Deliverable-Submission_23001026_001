const express = require('express');
const mysql = require("mysql2");
const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Republic_C207',
    database: 'c237_miniprojectapp',
    host: 'freedb.tech',
    user: 'freedb_ashton',
    password: 'n2vWFfP$?HwyP2z',
    database: 'freedb_c237_miniprojectapp',
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Set up view engine
app.set('view engine', 'ejs');
// enable static files
app.use(express.static('public'));
// enable form processing
app.use(express.urlencoded({
    extended: false
}));

//define routes
app.get('/', (req, res)=> {
    const sql = 'SELECT * FROM martial_art_category;'
    //Fetch data from MySQL
    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error Retrieving views');
        }
      // Render HTML page with data  
      res.render('homepage', { martial_art_category: results });
    });
});

//retrieve martial art webpage
app.get('/category/:id', (req, res) => {
    const category_Id = req.params.id;
    const sql = 'SELECT * FROM martial_arts WHERE category_Id = ?';
    //Fetch data from MySQL
    connection.query(sql, [category_Id], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error Retrieving views');
        } 
        if (results.length > 0) {
            // Render HTML page with data 
            res.render('martialart', { martial_arts: results });
        } 
        else {
            res.status(404).send('Martial arts not found');
        } 
    });
});

//retrieve moveset page
app.get('/martialart/:id', (req, res) => {
    const martial_art_Id = req.params.id;
    const sql = 'SELECT * FROM martial_art_techniques WHERE martial_art_Id = ?';
    connection.query( sql, [martial_art_Id], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error Retrieving moves by ID');
        }
        if (results.length > 0) {
            res.render('techniques', {martial_art_techniques: results});
        } else{
            res.status(404).send('Moves not found');
        }
    });
});

//add a new technique
app.get('/addTech', (req, res) => {
    res.render('addtechnique');
});

app.post('/addTech', (req,res) => {
    const {martial_art, name, steps, image} = req.body;
    const sql ='INSERT INTO martial_art_techniques (martial_art_id, technique_name, technique_step, image) VALUES (?, ?, ?, ?)';
    console.log(sql)
    //Insert the new technique into the database
    connection.query(sql, [martial_art, name, steps, image], (error, results) => {
        if (error) {
            //Handle any error that occurs during the database operation
            console.error("Error adding technique:", error);
            res.status(500).send('Error adding technique');
        } else {
            //Send a success response
            res.redirect('/')  
        }
    });
});

//update martial art
app.get('/editMA/:id', (req, res) => {
    const martial_art_Id = req.params.id;
    const sql = 'SELECT * FROM martial_arts WHERE martial_art_Id = ?'
    //Fetch data from MySQL based on martial art ID
    connection.query(sql, [martial_art_Id], (error, results) => {
        if (error)  {
            console.error("Error retrieving martial art:", error);
            res.status(500).send('Error retrieving martial art');
        }

        //check if there is any martial art with the given ID
        if(results.length > 0)
        {
            res.render("editMA", {martial_art: results[0]});
        } else {
            //If no martial art with the given ID was found, render a 404 page or handle it accodingly
            res.status(404).send('Martial Art not found');
        }
    })
})

app.post('/editMA/:id', (req, res) => {
    const martial_art_Id = req.params.id;
    const {name, description, image} = req.body;
    const sql = 'UPDATE martial_arts SET martial_art_name = ?, description = ?, image = ? WHERE martial_art_Id = ?';

    connection.query(sql, [name, description, image, martial_art_Id], (error, results) => {
        if (error) {
            console.error("Error updating martial art:", error);
            res.status(500).send('Error updating martial art');
        } else {
            //Send a success response
            res.redirect('/');
        }
    });
});

//update technique
app.get('/editTech/:id', (req, res) => {
    const technique_Id = req.params.id;
    const sql = 'SELECT * FROM martial_art_techniques WHERE technique_Id = ?';
    //Fetch data from MySQL based on martial art ID
    connection.query(sql, [technique_Id], (error, results) => {
        if (error)  {
            console.error("Error retrieving technique:", error);
            res.status(500).send('Error retrieving technique');
        }

        //check if there is any martial art with the given ID
        if (results.length > 0) {
            res.render("editTech", { techniques: results[0] }); // Pass the first result directly
        } else {
            //If no martial art with the given ID was found, render a 404 page or handle it accordingly
            res.status(404).send('Technique not found');
        }
    });
});


app.post('/editTech/:id', (req, res) => {
    const technique_Id = req.params.id;
    const { name, step, image } = req.body;
    const sql = 'UPDATE martial_art_techniques SET technique_name = ?, technique_step = ?, image = ? WHERE technique_Id = ?';

    connection.query(sql, [name, step, image, technique_Id], (error, results) => {
        if (error) {
            console.error("Error updating technique:", error);
            res.status(500).send('Error updating technique');
        } else {
            //Send a success response
            res.redirect('/');
        }
    });
});

//delete technique
app.get('/deleteTech/:id', (req,res) => {
    const technique_Id = req.params.id;
    const sql = 'DELETE FROM martial_art_techniques WHERE technique_Id = ?';
    connection.query(sql, [technique_Id], (error, results) => {
        if (error) {
            //Handle any error that occurs during the database operation
            console.error("Error deleting technique:", error);
            res.status(500).send('Error deleting technique');
        } else {
            res.redirect('/')
        }
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));