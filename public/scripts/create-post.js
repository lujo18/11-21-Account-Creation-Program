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
    
    const threads = [];
    
    console.log("Thread container", threadCont)
    console.log("Thread children", threadCont.children)
    console.log("Children length", threadCont.children.length)


    if (threadCont.children.length > 0) {
        Array.from(threadCont.children).forEach(thread => {
            const threadBody = thread.querySelector('#post-content')

            console.log("Thread body", threadBody)
            console.log("Thread content", threadBody.value)
            if (threadBody.value) {
                threads.push({"text": threadBody.value});
                console.log("Thread added:", threads)
            }
        })
    }

    console.log("Threads", threads)

    const createPost = await fetch('/createPost', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({title, content, group, threads})
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

function deleteTextbox(textbox) {
    console.log("click", textbox)
    textbox.remove();
}

function createThread() {
    const cont = document.createElement('div');
    cont.classList = "thread-input"

    const pLabel = document.createElement('label');
    pLabel.for = "post-content";

    const pInput = document.createElement('textarea');
    pInput.id = "post-content";
    pInput.name = "post-content"
    pInput.required = true;
    
    const pDelete = document.createElement('button');
    const pIcon = document.createElement('i');
    pIcon.classList = "fa-solid fa-x";

    pDelete.appendChild(pIcon)
    pDelete.classList = "delete-textbox"
    pDelete.type = "button"
    pDelete.addEventListener("click", (e) => {
        e.preventDefault()
        console.log("clicked", pDelete)

        if(pInput.value == "") {
            deleteTextbox(cont)
        }

        
    });

    cont.appendChild(pDelete)
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
            temp.autocomplete = false;
            temp.spellcheck = false;
            
        }
    })
    textarea.classList.add("focusedArea")
    textarea.autocomplete = true;
    textarea.spellcheck = true;
}


postContent.addEventListener("click", () => {
    focusArea(postContent)
})
