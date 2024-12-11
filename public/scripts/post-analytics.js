async function likePost (id, like, count) {
    const likePost = await fetch("/likePost", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({postId: id})
    })
    .then(async response => {
        
        return await response.json()
    })
    .then(async data => {

        console.log("LIKE DATA", data)
        
        like.dataset.userLiked = data.state;

        count.innerHTML = data.likes == 0 ? "" : data.likes;


        await changeLikeState(like)

    })
}

async function changeLikeState(like) {
    const liked = (like.dataset.userLiked === 'true');

    console.log("LIKE STATUS:", liked)
    console.log(like)

    if (liked) {
        like.classList.remove("fa-regular")
        like.classList.add("fa-solid")
    }
    else {
        like.classList.remove("fa-solid")
        like.classList.add("fa-regular")
    }
} 


const allPosts = document.querySelectorAll(".post");

allPosts.forEach(post => {
    const likeCont = post.querySelector(".like-cont")
    const likeBtn = post.querySelector(".like-cont > i");
    const likeNum = post.querySelector(".like-cont > .likes")

    changeLikeState(likeBtn)

    post.addEventListener("click", async (e) => {
        let postId = post.dataset.href

        if (Array.from(likeCont.childNodes).includes(e.target) || e.target == likeCont) {
            await likePost(postId, likeBtn, likeNum);
        }
    })
})