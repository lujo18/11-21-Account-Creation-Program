const postTitle = document.querySelector('#post-title')
const postContent = document.querySelector('#post-content')
const postGroup = document.querySelector('#post-group')

const newPostForm = document.querySelector('#new-post')

const newPostCont = document.querySelector('.post-cont')
const backgroundCover = document.querySelector('.cover')

const postBtn = document.querySelector("#create-post")


newPostForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    newPostCont.classList.add("hidden")
    backgroundCover.style.display = "none"

    const title = postTitle.value;
    const content = postContent.value;
    const group = postGroup.value;

    const createPost = await fetch('/createPost', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({title, content, group})
    })
    .then(() => { 
        window.location.reload()
    })
    
})

backgroundCover.addEventListener('click', (e) => {
    console.log("click", e.target)
    if (!newPostCont.classList.contains("hidden")) {
        newPostCont.classList.add("hidden")
        backgroundCover.style.display = "none";
    }
})

postBtn.addEventListener('click', () => {
    console.log('click')
    if (newPostCont.classList.contains("hidden")) {
        newPostCont.classList.remove("hidden")
        backgroundCover.style.display = "block";
    }
})



