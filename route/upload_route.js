//import { initializeApp } from "firebase/app";
//import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
const {initializeApp} = require("firebase/app")
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require("firebase/storage")
const path = require("path")
const express = require("express")
const route = express.Router()
const multer = require("multer")
const Topic = require("../model/topic.js")
initializeApp({
    apiKey: "AIzaSyDBY3h-59d1LB8U_W54QveIEANAs3o3ZUU",
    authDomain: "skillexchange-62da0.firebaseapp.com",
    projectId: "skillexchange-62da0",
    storageBucket: "skillexchange-62da0.appspot.com",
    messagingSenderId: "620499387371",
    appId: "1:620499387371:web:1d9a5bb2834406ee53cfae",
    measurementId: "G-NP63D4FV2Y"
})

const storage = getStorage();



const uploadOptions = multer({storage: multer.memoryStorage()})

route.post("/image", uploadOptions.single("image"),async (req,res)=>{
    
    const file = req.file;
    if(!file) return res.status(400).send('No image in the request')

    const storageRef = ref(storage, `files/${req.file.originalname}`)

    const metaData= {
        contentType: req.file.mimetype
    }

    const snapShot = await uploadBytesResumable(storageRef,req.file.buffer,metaData)

    const downloadURL = await getDownloadURL(snapShot.ref)
    return res.json({
        image: downloadURL
    })
})

route.post("/file", uploadOptions.single("file"),async(req,res)=>{
    const file = req.file;
    if(!file) return res.status(400).send('No file in the request')
    const curDate = new Date();
    const curMili = curDate.getMilliseconds();
    const fileName = path.basename(req.file.originalname, path.extname(req.file.originalname))
    const extension = path.extname(req.file.originalname)
    const storageRef = ref(storage, `files/${fileName}${extension}`)

    const metaData= {
        contentType: req.file.mimetype
    }

    const snapShot = await uploadBytesResumable(storageRef,req.file.buffer,metaData)
    const downloadURL = await getDownloadURL(snapShot.ref)
    return res.json({
        image: downloadURL,
        fileName: fileName,
        extension: extension
    })
})

route.post("/files", uploadOptions.array("files", 100),async(req,res)=>{
    const files = req.files
    const responseData = []
    await Promise.all(files.map(async (file)=>{
        const curDate = new Date();
    const curMili = curDate.getMilliseconds();
    const fileName = path.basename(file.originalname, path.extname(file.originalname))
    const extension = path.extname(file.originalname)
    const storageRef = ref(storage, `files/${fileName}${extension}`)

    const metaData= {
        contentType: file.mimetype
    }

    const snapShot = await uploadBytesResumable(storageRef,file.buffer,metaData)
    const downloadURL = await getDownloadURL(snapShot.ref)
    responseData.push({
        url: downloadURL,
        name: fileName,
        extension: extension
    })
    }))
    res.json({
        data: responseData
    })
})
module.exports = route