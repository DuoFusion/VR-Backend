"use strict"
/**
 * @author Pramit Mangukiya
 * @description Server and REST API config
 */
import * as bodyParser from 'body-parser';
import express, { Request, Response } from 'express';  
import http from 'http';
import cors from 'cors'
import { mongooseConnection} from './database'
import * as packageInfo from '../package.json'
import { router } from './Routes'
import path from 'path';
import multer from 'multer'
import fs from  'fs';
 
const app = express();

app.use("/images", express.static(path.join(__dirname, "..", "..", "images")));

const fileStorage = multer.diskStorage({
    destination : (req,file,cb)=>{
        const dir = "images";
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        cb(null,"images");
    },

    filename: (req,file,cb)=>{
        const sanitizedOriginalName = file.originalname.replace(/\s+/g, "-");
        cb(null, `${Date.now()}_${sanitizedOriginalName}`);
    }
});

const fileFilter = (req,file,cb)=>{
    if(
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/webp" ||
        file.mimetype === "image/jpeg"
    ){
        cb(null,true);
        
    }else{
        cb(null,false);
    }
}

app.use(cors())
app.use(mongooseConnection)
app.use(bodyParser.json({ limit: '200mb' }))
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }))
app.use(express.static(path.join(__dirname,"public")))
app.use(multer({storage: fileStorage, fileFilter:fileFilter}).single("image"));

const health = (req, res) => {
    return res.status(200).json({
        message: `Project Name Server is Running, Server health is green`,
        app: packageInfo.name,
        version: packageInfo.version,
        description: packageInfo.description,   
        author: packageInfo.author,
        license: packageInfo.license
    })
}
const bad_gateway = (req, res) => { return res.status(502).json({ status: 502, message: "Project Name Backend API Bad Gateway" }) }

app.get('/', health);
app.get('/health', health);
app.get('/isServerUp', (req, res) => {
    res.send('Server is running ');
});
app.use(router)
app.use('*', bad_gateway);

let server = new http.Server(app);
export default server;
