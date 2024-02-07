const express = require('express');
const date = require('date-and-time');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 8000;

// Set the current working directory
const Direct = process.cwd();

// Define the output folder name
const folderName = 'dateTime';

// Create the output folder if it doesn't exist
const folderPath = path.join(Direct, folderName);
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}

// Define a route to create a text file with current date and time
app.get('/', (req, res) => {
  const now = new Date();
  const value = date.format(now, 'DD-MM-YYYY,HH-mm-ss');

  if (!value) {
    return res.status(500).send('Error generating date and time');
  }

  // Modify the filePath to include the output folder
  const filePath = path.join(folderPath, `${value}.txt`);

  fs.writeFile(filePath, `${value}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    res.status(200).send(`<h1>File ${value}.txt created successfully in the '${folderName}' folder</h1>`);
  });
});

// Define a route to read all files from the directory
app.get('/getreadFiles', (req, res) => {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    if (files.length === 0) {
      return res.status(404).send('No files found in the "dateTime" folder');
    }

    const fileContents = [];

    files.forEach((filename, index, array) => {
      const filePath = path.join(folderPath, filename);

      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }

        fileContents.push({ filename, data });

        if (index === array.length - 1) {
          // Send the response once all files have been read
          res.status(200).json(fileContents);
        }
      });
    });
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
