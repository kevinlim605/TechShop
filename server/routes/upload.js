import express from 'express';
import path from 'path';
import multer from 'multer';
import { protect, admin } from '../middleware/authMiddleware.js';

const uploadRouter = express.Router();

// initialize our storage engine using multer.diskStorage(). The engine
// gives us full control on storing files to disk. Takes an object argument
// of two functions, destination and filename
const storage = multer.diskStorage({
  // first argument, destination. Takes request, file, and callback function arguments.
  // Is used to determine within which folder the uploaded files should be stored.
  destination(req, file, cb) {
    // call the callback with null meaning no error, and string 'uploads/' showing
    // where we want to upload which in our case will be a folder called 'uploads'
    cb(null, 'uploads/');
  },
  // second argument, filename. Takes request, file, and callback function arguments.
  // Is used to determine what the file should be named inside the folder. If no
  // filename is given, each file will be given a random name and no file extension
  filename(req, file, cb) {
    // call the callback with null meaning no error, and string showing what we want
    // to call our upload file. We'll use template string to construct our upload file
    // name
    cb(
      null,
      // file will be returned like this...
      //   {
      //     fieldname: 'songUpload',
      //     originalname: '04. Stairway To Heaven - Led Zeppelin.mp3',
      //     encoding: '7bit',
      //     mimetype: 'audio/mp3',
      //     destination: './uploads',
      //     filename: 'songUpload-1476677312011',
      //     path: 'uploads/songUpload-1476677312011',
      //     size: 14058414
      //   }
      // path is a core node module. It allows us to get the extension of a file name
      // using method, path.extname(). So we'll pass in the file's original name
      // to grab the extension. The returned value will be something like '.mp4'
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Our own custom middleware function for checking file type.
function checkFileType(file, cb) {
  // create an regex expression, filetypes, of the file types that we want
  const filetypes = /jpg|jpeg|png/;
  // .test is a regex method for comparing a string to a regex expression
  // it will return true or false
  // we're comparing the file's external name to the filetype regex expression
  // ex) /jpg|jpeg|png/.test('.jpg') = true
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // mimetype stands for media type (Multipurpose Internet Mail Extensions) and
  // will be a property passed in with the file object.
  // it will return true or false
  // we're comparing the file's mime type to the filetype regex expression
  // ex.) /jpg|jpeg|png/.test('image/jpg') = true
  const mimetype = filetypes.test(file.mimetype);

  // if both pass the comparison and return true, we have the matching file type we need
  // and then we'll return the call of the callback function and pass in null for no error
  // and true
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    // if the type does not match then we'll call the callback with an error message
    cb('Images only!');
  }
}

// what we'll pass as middleware to our route. We'll call multer() and pass in an object
const upload = multer({
  // We'll set the storage property to the storage engine we created above using shorthand
  storage,
  // create a middleware method we'll call fileFilter which we will set as a function
  // that takes a request, file, and callback function as arguments
  // In the function body, we'll call our own checkFileType() middleware function
  // which we created above and pass in the file and callback function.
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// .single(fieldname) accepts a single file with the name fieldname. The single
// file will be stored in req.file.
// We'll also pass in a function which will send back a response object with the
// file path.
uploadRouter
  .route('/')
  .post(protect, admin, upload.single('image'), (req, res) => {
    res.send(`/${req.file.path}`);
  });

export default uploadRouter;
