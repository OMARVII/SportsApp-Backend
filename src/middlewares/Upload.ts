import * as aws from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import * as multer from 'multer';
import * as path from 'path';

const s3 = new aws.S3({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey
   });

export const deleteFile = (key:string) =>{
  return s3.deleteObject({
    Bucket: 'sports-app-bucket',
    Key: key
  },function (err,data){
    err? false:true
  })
} 
export const ImgUpload = multer({
    storage: multerS3({
     s3: s3,
     bucket: 'sports-app-bucket',
     acl: 'public-read',
     key: function (req, file, cb) {
      cb(null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
     }
    }),
    limits:{ fileSize: 2000000000000 }, // In bytes: 2000000 bytes = 2 MB
    fileFilter: function( req, file, cb ){
     checkFileType( file, cb );
    }
   });
   
   function checkFileType( file:Express.Multer.File, cb:any ){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test( path.extname( file.originalname ).toLowerCase());
    // Check mime
    const mimetype = filetypes.test( file.mimetype );
   if( mimetype && extname ){
     return cb( null, true );
    } else {
     cb( 'Error: Images Only!' );
    }
   }