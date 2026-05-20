const form = document.getElementById("new-post-form")
const baseURL = `https://megaphone-server.onrender.com`
const deleteEnabled = false

const getPosts = async () => {
    const response = await fetch(`${baseURL}/posts`)
    const posts = await response.json()

    addPostsToPage(posts)
    return posts
}

// This function takes in an array of post objects and adds them to the page. Each post object has the following properties: _id, body, author, timecreated.
//we can view the post body, the author, and how long ago the post was created. If deleteEnabled is true, a delete button will be added to each post that allows you to delete the post.
const addPostsToPage = (posts) => {
    const allPosts = document.getElementById("all-posts")
    allPosts.innerHTML = ""

    posts.reverse().forEach(post => {
        const newListItem = document.createElement("li")
        newListItem.className = "post"
        const postBody = document.createElement("p")
        postBody.className = "post-body"
        const postMeta = document.createElement("div")
        postMeta.className = "post-meta"
        const deleteButton = document.createElement("a")
        deleteButton.className = "delete-button"
        deleteButton.innerText = "❌"

        postBody.innerText = post.body
        
        usernameLabel = document.createElement("p")
        usernameLabel.innerText = post.author
        postMeta.appendChild(usernameLabel)

        const secondsSincePosted = Math.round((Date.now() - post.timecreated) / 1000)
        let unitOfTime = "second"
        let numberOfUnits = secondsSincePosted

        if (numberOfUnits >= 60) {
            unitOfTime = "minute"
            numberOfUnits = Math.round(numberOfUnits / 60)
        }

        if (numberOfUnits >= 60) {
            unitOfTime = "hour"
            numberOfUnits = Math.round(numberOfUnits / 60)
        }

        if (numberOfUnits >= 24) {
            unitOfTime = "day"
            numberOfUnits = Math.round(numberOfUnits / 24)
        }

        timeLabel = document.createElement("p")
        timeLabel.innerText = `posted ${numberOfUnits} ${unitOfTime}${numberOfUnits !== 1 ? "s" : ""} ago.`
        postMeta.appendChild(timeLabel)

        deleteButton.addEventListener("click", async () => {
            await fetch(
                `${baseURL}/posts/${post._id}`,
                { method: "DELETE" }
            )

            getPosts()
        })

        newListItem.appendChild(postBody)
        newListItem.appendChild(postMeta)

        if (deleteEnabled) {
            postMeta.appendChild(deleteButton)
        }

        allPosts.appendChild(newListItem)
    })
}

getPosts()

form.addEventListener("submit", async (event) => {
    event.preventDefault()

    await fetch(
        `${baseURL}/posts`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                body: form.elements.body.value,
                author: form.elements.user.value
            })
        }
    ).then((response) => {
        return response.json()
    })

    getPosts()
    form.reset()
})
