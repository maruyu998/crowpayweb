import express from "express";
import path from "path";
import "dotenv/config";

import apiRouter from "./api/index";

import * as authClient from "./utils/auth";

import app from "./utils/init";
import { requireSignin } from "./utils/middleware";
import * as pushUtils from "maruyu-webcommons/node/push";
import register from "./register";

const IS_PRODUCTION_MODE = process.env.NODE_ENV==="production";
const PORT = Number(process.env.PORT) || (IS_PRODUCTION_MODE ? Number(process.env.PRODUCTION_PORT) : 3000);
if(!IS_PRODUCTION_MODE && Number(process.env.PORT) === Number(process.env.PRODUCTION_PORT)) throw new Error("PORT determines the same as PRODUCTION_PORT.");

app.use('/manifest.json', express.static(path.join(__dirname, '..', 'client', 'public', 'manifest.json')));
app.use("/api", apiRouter);
app.get("/push", requireSignin, pushUtils.sendPublicVapidKey);
app.post("/push", requireSignin, pushUtils.registerSubscription);
app.delete("/push", requireSignin, pushUtils.unregisterSubscription);
app.use(express.static(path.join(__dirname, "..", "_dist", "public")));
app.get('*', (req, res)=>res.sendFile(path.join(__dirname, "..", "_dist", "public", "index.html")));

app.listen(PORT, ()=>{
  console.log(`starting: listening port ${PORT}`)
});

register();
pushUtils.register();