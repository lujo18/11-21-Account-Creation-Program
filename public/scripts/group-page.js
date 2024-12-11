const posts = document.querySelectorAll(".post");

posts.forEach(post => {

    const postData = post.querySelector(".post-data")

    post.addEventListener("click", async (e) => {

        if (!postData.contains(e.target)) {
            window.location.href = `/post/${post.dataset.href}`;
        }
    })
})