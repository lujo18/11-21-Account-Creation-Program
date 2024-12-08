import { compareSync } from "bcrypt"
import supabase from "./supabaseClient.js"

async function likePost(postId, sessionId) {

    
    const postLiked = await getLike(postId, sessionId) // Determines if post is already liked

    if (postLiked != -1) {
        console.log("deleted like", postLiked)
        const {data, error} = await supabase  // If it is, then remove like
            .from("Likes")
            .delete()
            .eq("id", postLiked)
            .select()

        console.log("deleted like", "")
        return false
    }
    else {
        console.log("added like")
        const {data, error} = await supabase  // If it isn't then add like
            .from("Likes")
            .insert([
                {"post_id": postId, "user_id": sessionId}
            ])
            .select()
        
        console.log("added like", true)
        return true
    }
}

async function getLike(postId, sessionId) {
    const {data, error} = await supabase
        .from("Likes")
        .select("id")
        .eq("user_id", sessionId)
        .eq("post_id", postId)
        .single()

    console.log(error)
    console.log(data)
    if (data) {
        return data.id;
    }
    else {
        return -1;
    }
}

export default {likePost}

