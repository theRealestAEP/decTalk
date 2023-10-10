import express from "express";
import { exec } from "child_process";
import fs from "fs";
import multer from "multer";
import cors from "cors"

const app = express();
const port = 8080;
const storage = multer.memoryStorage(); // Store the text in memory
const upload = multer({ storage: storage });

// This is used to parse JSON bodies
app.use(express.json());

// This is used to parse bodies from URL-encoded forms
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post('/say', upload.none(), (req, res) => {
    const text = req.body.text || '';
    const encoding = req.body.encoding || '1';
    const rate = req.body.rate || '100';
    const volume = req.body.volume || '100';
    const speaker = req.body.speaker || '0';
    const language = req.body.language || 'us';
    const mode = req.body.mode || '-';

    const outputFile = "dtmemory.wav";

    const cmd = `./say -e ${encoding} -r ${rate} -v ${volume} -s ${speaker} -l ${language} -a "${text}" -fo ${outputFile}`;

    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send('Error generating speech.');
        }

        res.download(outputFile, (err) => {
            if (err) throw err;
            fs.unlink(outputFile, (err) => {
                if (err) console.error(`Error deleting file: ${err}`);
            });
        });
    });
});


app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});