const postTitle = document.querySelector('#post-title')
const postContent = document.querySelector('#post-content')
const postGroup = document.querySelector('#post-group')

const newPostForm = document.querySelector('#new-post')

const newPostCont = document.querySelector('.post-cont')
const backgroundCover = document.querySelector('.cover')

const postBtn = document.querySelector("#create-post")


const groups = await fetch("/user-groups")
    .then(response => response.json())
    .then(data => {
        console.log("ALL GROUPS", data)
        for (let group of data.groups) {
            console.log(group)
            console.log(group.Groups)

            const option = document.createElement('option')
            option.value = group.group_id
            option.innerHTML = group.Groups.group_name
            postGroup.appendChild(option)
        }
    }
)


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

const addThread = document.querySelector("#add-thread");
const threadCont = document.querySelector("#thread-content")

function createThread() {
    const cont = document.createElement('div');

    const pLabel = document.createElement('label');
    pLabel.for = "post-content";

    const pInput = document.createElement('textarea');
    pInput.id = "post-content";
    pInput.name = "post-content"
    pInput.required = true;
    
    cont.appendChild(pLabel)
    cont.appendChild(pInput)

    pInput.addEventListener("click", () => {
        focusArea(pInput);
    })

    return [cont, pInput];
}

addThread.addEventListener('click', async (e) => {
    const [newThread, threadInput] = await createThread()

    threadCont.appendChild(newThread)

    setTimeout(()=>{focusArea(threadInput)}, 50)
    
})


function focusArea(textarea) {
    const textAreas = newPostForm.querySelectorAll("textarea")

    textAreas.forEach(temp => {
        if (temp != textarea) {
            temp.classList.remove("focusedArea")
        }
    })
    textarea.classList.add("focusedArea")
}


postContent.addEventListener("click", () => {
    focusArea(postContent)
})
