const newComment = document.querySelector('#new-comment');
const commentContent = newComment.querySelector("#comment");

const parentPost = document.querySelector(".post");
const parentId = parentPost.dataset.href;


newComment.addEventListener("submit", async (e) => {
    e.preventDefault();

    const content = commentContent.value;

    commentContent.value = ""

    const createComment = await fetch("/createComment", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({content, parentId})
    })

    if (createComment) {
        window.location.reload()
    }

    
})