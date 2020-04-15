const express = require('express')
const url = require('url')
const mysql = require('mysql')
const app = express()
const router = express.Router()

const key = require('./key.js')
console.log(key)
//0b1bb709-8bff-41ed-a609-2ab238cd3cfc
const credentials = require('./credentials.js')

app.use(express.json())

//Tom sträng som fylls med queries beroende på metod
let query = ''

//Här etablerar jag anslutning till min MySQL-databas, gräns på 5 anslutningar.
const pool = mysql.createPool({
  user: credentials.user,
  password: credentials.password,
  connectionLimit: 5,
  host: 'localhost',
  database: 'movietheater'
})


router.param('apikey', (req, res, next, apikey) => {
  if (apikey == key) {
      req.hasAccess = true
      console.log(req.hasAccess)
  } else req.hasAccess = false
  next()
})


//Min route för URI "movies"
router.route('/movies/:apikey/')

  .all((req, res, next) => {

    if (req.hasAccess == false) {
      res.status(401)
      res.send('Access Denied')
      return
    }
    next()
  })

  //Get movies
  .get((req, res) => {
    query = `SELECT * FROM movies`
    pool.getConnection((err, connection) => {
      if (err) throw err
      connection.query(query, (err, result, fields) => {
        connection.release()
        if (err) throw err
        console.log(result)
        res.json(result)
      })
    })
  })

//Add movie
  .post((req, res) => {
    query = `INSERT INTO movies (title, genre, length, ageLimit, releaseDate) VALUES (?, ?, ?, ?, ?)`
    values = [req.body.title, req.body.genre, req.body.length, req.body.ageLimit, req.body.releaseDate]

    pool.getConnection((err, connection) => {
      if (err) throw err
      connection.query(query, values, (err, result, field) => {
          connection.release()
          if (err) throw err
          console.log(result)
          res.json(result)
      })
  })
  })

//Update movie
  .put((req, res) => {
    query = `UPDATE movies SET title = ?, genre = ?, length = ?, ageLimit = ?, releaseDate = ? WHERE id = ?`
    values = [req.body.title, req.body.genre, req.body.length, req.body.ageLimit, req.body.releaseDate, req.body.id]

    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query(query, values, (err, result, field) => {
            connection.release()
            if (err) throw err
            console.log(result)
            res.json(result)
        })
    })
})

//Delete movie (id query)
.delete((req, res) => {
  query = `DELETE FROM movies WHERE id = ?`
  values = [req.query.id]

  pool.getConnection((err, connection) => {
      if (err) throw err
      connection.query(query, values, (err, result, field) => {
          connection.release()
          if (err) throw err
          console.log(result)
          res.json(result)
      })
  })
})

//Get movie by id
router.route('/movies/:apikey/:id')
    .get((req, res) => {
        console.log(req.params.apikey)

        query = `SELECT * FROM movies WHERE id = ?`
        pool.getConnection((err, connection) => {
            if (err) throw err
            connection.query(query, [req.params.id], (err, result, fields) => {
                connection.release()
                if (err) throw err
                console.log(result)
                res.json(result)
            })
        })

    })

    router.route('/actors/:apikey/')

    
  .all((req, res, next) => {

    if (req.hasAccess == false) {
      res.status(401)
      res.send('Access Denied')
      return
    }
    next()
  })

    //Get actors
  .get((req, res) => {
    query = `SELECT * FROM actors`
    pool.getConnection((err, connection) => {
      if (err) throw err
      connection.query(query, (err, result, fields) => {
        connection.release()
        if (err) throw err
        console.log(result)
        res.json(result)
      })
    })
  })

//Add movie
  .post((req, res) => {
    query = `INSERT INTO actors (firstName, lastName, gender, birthDate) VALUES (?, ?, ?, ?)`
    values = [req.body.firstName, req.body.lastName, req.body.gender, req.body.birthDate]

    pool.getConnection((err, connection) => {
      if (err) throw err
      connection.query(query, values, (err, result, field) => {
          connection.release()
          if (err) throw err
          console.log(result)
          res.json(result)
      })
  })
  })

//Update movie
  .put((req, res) => {
    query = `UPDATE actors SET firstName = ?, lastName = ?, gender = ?, birthDate = ? WHERE id = ?`
    values = [req.body.firstName, req.body.lastName, req.body.gender, req.body.birthDate, req.body.id]

    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query(query, values, (err, result, field) => {
            connection.release()
            if (err) throw err
            console.log(result)
            res.json(result)
        })
    })
})

//Delete movie (id query)
.delete((req, res) => {
  query = `DELETE FROM actors WHERE id = ?`
  values = [req.query.id]

  pool.getConnection((err, connection) => {
      if (err) throw err
      connection.query(query, values, (err, result, field) => {
          connection.release()
          if (err) throw err
          console.log(result)
          res.json(result)
      })
  })
})

//Get movie by id
router.route('/actors/:apikey/:id')
    .get((req, res) => {
        console.log(req.params.apikey)

        query = `SELECT * FROM actors WHERE id = ?`
        pool.getConnection((err, connection) => {
            if (err) throw err
            connection.query(query, [req.params.id], (err, result, fields) => {
                connection.release()
                if (err) throw err
                console.log(result)
                res.json(result)
            })
        })

    })

  //Kopplar min router här
  app.use('/', router)


app.listen(3000, () => {
  console.log('Listening to port 3000......................')
})