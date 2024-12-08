import express from "express";
const app = express();
import session from "express-session"
import http from "http"

import { Server } from "socket.io";
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:8080", // Replace with your client origin
        methods: ["GET", "POST"],
    }
});

import dotenv from "dotenv"
dotenv.config()

import supabase from "./supabaseClient.js"

import hashing from "./hashing.js"

import likeFunctions from "./likeFunctions.js"

import path from "path";
import { fileURLToPath } from "url";
import e from "express";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const port = process.env.PORT || 3000;


const storeAccount = async (username, email, password) => {
    const { data, error } = await supabase
        .from('Accounts')  // Replace 'items' with any table you know exists
        .insert([
            {email: email, username: username, password: password}
        ])
    
    if (error) {
        console.log("Failed to locate items: ", error)
    }
    else {
        console.log("Successfully located items", data)
    }
}

const verifyPasswordDb = async (username, email, password) => {
    const {data, error} = await supabase
        .from('Accounts')
        .select("*")
        .eq('username', username)
        
    if (error) {
        console.log("Failed to locate items: ", error)
    }
    else {
        return await hashing.verifyPassword(password, data[0].password)
    }
}

const getAccountData = async (username) => {
    const {data, error} = await supabase
        .from('Accounts')
        .select("*")
        .eq('username', username)
        
    if (error) {
        console.log("Failed to locate items: ", error)
    }
    else {
        return data[0];
    }
}

const usernameExists = async (username) => {
    const {data, error} = await supabase
        .from('Accounts')
        .select("*")
        .eq('username', username)
        
    if (error) {
        console.log(error)
        return false
    }
    else {
        if (data[0]) {
            console.log("exits")
            return true;
        }
        else {
            console.log("doesn't exist")
            return false;
        }
        
    }
}

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use("/static", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.use(session({
    secret: "keyboard kat",
    resave: false,
    saveUninitialized: true,
}))

app.use((req, res, next) => {
    if (req.session && req.session.user) {
        res.locals.session = req.session.user;
    }
    else {
        res.locals.session = null;
    }
    next();
})

io.on('connection', async (socket) => {
    console.log("Socket connected")
    socket.on('checkUsername', async (username) => {

        const exists = await usernameExists(username);

        socket.emit("verifiedUser", exists)
    })

    socket.on('disconnect', () => {
        console.log("Socket disconnected")
    })
})

async function retrieveMessages(req, groupId, offset, limit) {
    const {data, error} = await supabase
        .from("Posts")
        .select(`
            id,
            created_at,
            title,
            content,
            Accounts(id, username),
            user_liked: Likes(user_id),
            total_likes: Likes(post_id)`)
        .eq("group_id", groupId)
        .eq("user_liked.user_id", req.session.user.id)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1)
        
    

    if (error) {
        console.error("Failed to locate messages", error)
        return -1;
    } 
    return data;
}

async function retrieveGroupData(groupId) {
    const {data, error} = await supabase
        .from("Groups")
        .select("*")
        .eq("id", groupId)

    if (error) {
        console.error("Failed to locate group", error)
        return -1;
    } 
    return data;
}

app.get("/", async (req, res) => {
    if (!req.session.user) {
        res.render("home");
        return
    }

    const groupMessages = await retrieveMessages(req, 1, 0, 50);

    console.log(groupMessages)
    
    const groupData = await retrieveGroupData(1);

    res.render("group", {group: groupData[0], post: groupMessages})
    
})

app.get("/signup", (req, res) => {
    res.render("signup")
})

app.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = await hashing.hashPassword(req.body.password);
    
    console.log("Password to be added: " + password)

    await storeAccount(username, null, password)

    const data = await getAccountData(username)

    req.session.user = {username: username, id: data.id}

    res.redirect(`user/${req.session.user.username}`)
    
    
})

app.post("/change-pass", async (req, res) => {
    const newPass = req.body.password;

    console.log("Session user", req.session.user.username)

    const {data, error} = await supabase
        .from('Accounts')
        .update({password: newPass})
        .eq('id', req.session.user.id)
        .select()
 
    console.log('Data:', data);
    console.log('Error:', error);

    if (error) {
        console.log("Failed to locate items: ", error)
    }
    else {
        res.send("Password Change Successful:")
        console.log("Password change successful", data)
    }
}) 


app.post("/edit-account", async (req, res) => {
    const {username, description} = req.body;
    
    console.log(req.body)
    console.log("username: " + username)
    console.log(req.session.user.username)

    const {data, error} = await supabase
        .from('Accounts')
        .update({"username": username, "description": description})
        .eq("id", req.session.user.id)
        
        

    if (error) {
        console.error("Failed to change items: ", error)
    }
    else {
        console.log(data)

        req.session.user.username = username
        res.redirect(`user/${req.session.user.username}`)
    }

    console.log(req.session.user.username)

    
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/login", async (req, res) => {
    const {username, password} = req.body;

    try {

        console.log(username + " " + password)

        const matches = await verifyPasswordDb(username, null, password)
        console.log("matches: " + matches)
        if (matches) {
            const data = await getAccountData(username)

            req.session.user = {username: username, id: data.id}

            
            console.log("SESSION ID", req.session.user.id)
            res.json({ redirect: `user/${req.session.user.username}`})
            
        } 
        else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (e) {
        console.log("Error in log in route: ", e)
        return res.status(500).json({ message: 'Internal server error' })
    }
})

app.post("/createPost", async (req, res) => {
    const {title, content, group} = req.body;

    const {data, error} = await supabase
        .from("Posts")
        .insert([
            {"title": title, "content": content, "user_id": req.session.user.id, "group_id":1}
        ])

    if (error) {
        console.error("Failed to create new post", error)
    }
    
})

app.get("/user", async (req, res) => {
    if (!req.session.user) {
        res.redirect("/")
        return
    }
    res.redirect(`/user/${req.session.user.username}`)
})

app.get("/user/:username", async (req, res) => {

    console.log(req.session.user)
    // Redirect if the user isn't even logged in
    if (!req.session.user) {
        res.redirect("/login")
        return
    }
    

    // Get the username that is transitioned from the login redirect
    const {username} = req.params;

    if (!(await usernameExists(username))) {
        res.render("userDoesn'tExist")
    }

    // Check if the route username is equal to the session username
    if (username !== req.session.user.username) {
        res.render("accountViewer", {
            data: await getAccountData(username)
        })
        return// res.status(404).send("Forbidden")
    }

    console.log("USER DATA BEFORE CHANGING PAGE: ", await getAccountData(req.session.user.username))

    res.render("accountOwner", {
        data: await getAccountData(req.session.user.username)
    })
})

async function retrievePostData(postId) {
    const {data, error} = await supabase
        .from("Posts")
        .select(`
            id,
            created_at,
            title,
            content,
            Accounts(id, username),
            Groups(id, group_name),
            likes: Likes(id)`)
        .eq("id", postId)

    if (error) {
        console.error("Failed to locate this post", error)
        return -1;
    } 
    return data;
}

app.get("/post/:postId", async (req,res) => {
    const {postId} = req.params

    

    const postData = await retrievePostData(postId);

    console.log(postData)


    if (postData) {
        res.render("post", {data: postData[0]})
    }
    else {
        req.redirect("/")
    }

    
})

app.post("/likePost", async (req, res) => {
    console.log("Liked post")
    const {postId} = req.body;

    const state = await likeFunctions.likePost(postId, req.session.user.id)

    let likes = await retrievePostData(postId)
    likes = likes[0].likes.length

    
    console.log("LIKES AMOUNT\n", likes)

    res.status(201).json({message: "Like changed successfully", state, likes})

})

server.listen(8080, (err) => {
    if (err) {
        console.log("Failed to run on " + port, err)
    }

    console.log("App is listening on port: " + port);
})

export default app; 