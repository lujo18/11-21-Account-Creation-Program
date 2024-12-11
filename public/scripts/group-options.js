const groups = document.querySelectorAll(".post")

function changeJoinState(button) {
    const joined = (button.dataset.userJoined === "true");

    if(joined) {
        button.disabled = true;
        button.innerHTML = "Group Joined"
    }
    else {
        button.disabled = false;
        button.innerHTML = "Join"
    }
}


groups.forEach(group => {
    const joinGroup = group.querySelector('#join-group')

    changeJoinState(joinGroup)

    joinGroup.addEventListener("click", async (e) => {

        const join = await fetch("/join-group", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({groupId: joinGroup.dataset.groupId})
        })

        if (join.ok) {
            joinGroup.dataset.userJoined = true;
            changeJoinState(joinGroup)
        }
    })
})