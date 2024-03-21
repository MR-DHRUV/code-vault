const connectToMongo = require('./db')
const express = require("express");
const app = express();
const port = 5000;
const cors = require('cors')
const bodyparser = require('body-parser');
const { body, validationResult } = require('express-validator');
const RecordStore = require('./models/record');
const redis = require('redis');

app.use(bodyparser.json()); // support json encoded bodies
app.use(bodyparser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors()); // support cross-origin requests

// connect to database
connectToMongo();

// Redis client
const redisCache = redis.createClient({
    url: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD
});

redisCache.connect();
redisCache.on('connect', () => {
    console.log('Connected to Redis');
});

app.get('/', async (req, res) => {

    // check if cache is dirty
    const dirty = await redisCache.get('dirty');
    let record = [], cache;

    try {
        // fetch from database
        if (!dirty || dirty === '1') {
            cache = false;
            record = await RecordStore.find({});

            // set the cache
            redisCache.set('records', JSON.stringify(record));
            redisCache.set('dirty', '0'); // Reset dirty bit to 0
        } else {
            cache = true;
            record = await redisCache.get('records');
        }

        return res.status(200).json({ success: true, data: cache ? JSON.parse(record) : record, cache: cache });

    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
})

app.post('/record', [
    body('username', 'Invalid username').isLength({ min: 2, max: 64 }),
    body('codeLanguage', 'Invalid codeLanguage').isLength({ min: 3, max: 64 }),
    body('input', 'Invalid input').isString(),
    body('sourceCode', 'Invalid sourceCode').isString(),
    body('id', 'Invalid id').isNumeric(),

], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array() });
    }

    try {

        let output;
        try {

            // fetch output from judge0 api
            const response = await fetch("https://judge0-ce.p.rapidapi.com/submissions?wait=true", {
                method: 'POST',
                params: {
                    base64_encoded: 'false',
                    fields: '*'
                },
                headers: {
                    'content-type': 'application/json',
                    'Content-Type': 'application/json',
                    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                    'X-RapidAPI-Host': process.env.RAPIDAPI_HOST,
                },
                body: JSON.stringify({
                    source_code: req.body.sourceCode,
                    language_id: req.body.id,
                    stdin: req.body.input
                })
            });

            const data = await response.json();
            
            if (data.error) {
                output = data.error;
            }
            else {
                output = data.stdout || "";
            }
        }
        catch (error) {
            console.error(error)
            output = "Error fetching output";
        }

        // create a new record
        const newRecord = await RecordStore.create({
            username: req.body.username,
            codeLanguage: req.body.codeLanguage,
            input: req.body.input,
            output: output,
            sourceCode: req.body.sourceCode,
        });

        // mark the cache dirty
        redisCache.set('dirty', '1');
        return res.status(200).json({ success: true, message: "Record created successfully" });

    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
})


app.listen(process.env.PORT || port, () => {
    console.log(`Server started on  port ${port}`);
})