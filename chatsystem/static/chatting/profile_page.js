document.addEventListener("DOMContentLoaded", function(event) { 
    console.log("Profile page")
    const postBody = document.querySelector(".post-body")
    const userId = document.querySelector("#current-user")
    // const hereUrl = window.location.href;
    const loggedUserId = userId.dataset.userId
    console.log("user id", userId)
    console.log("user id ", userId.dataset.userId)
    // console.log("window location ", hereUrl)

    const profilePostForm = document.querySelector(".profile-post-form");

    const beforeFirstPost = document.querySelector("#before-first-post")

    const avatarForm = document.querySelector(".avatar-form")
    const deleteAvatarForm = document.querySelector(".delete-form")

    const pContent = document.createElement("p")

    function insertText(text) {
        text.raw[0]
    }

    function sanitizeString(str) {
        str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, " ");
        return str.trim();
    }

    // const insertText = (text) => {
    //     String.raw(text)
    // }
    // <p class="card-text">
    //     ${data.content}
    // </p>

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    const csrftoken = getCookie('csrftoken');

    const changeAvatar = () => {
        // const avatarForm = document.querySelector(".avatar-form")
        avatarForm.addEventListener("submit", (e) => {
            e.preventDefault()
            const avatarId = e.target.getAttribute('data-user-id');
            console.log("Avatar Id ", avatarId)

            const inputImageContent = document.querySelector("#id_avatar").files;

            let formData = new FormData()
            formData.append("avatar-image", inputImageContent[0])

            const url = `http://127.0.0.1:8000/change-avatar/`

            fetch(url, {
                method: "POST",
                headers: {
                    // "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRFToken": csrftoken,
                },
                body: formData
            })
            .then((response) => response.json())
            .then((data) => {
                console.log("Success Avatar ", data)
                const profileAvatar = document.getElementsByClassName("profile-avatar");
                console.log("profile avatar ", profileAvatar)
                // profileAvatar.src = data.new_avatar_image

                for (var i = 0; i < profileAvatar.length; i++) {
                    profileAvatar[i].src = data.new_avatar_image
                }

                avatarForm.reset()
            })
        })
    }

    const deleteAvatar = () => {
        deleteAvatarForm.addEventListener("submit", (e) => {
            e.preventDefault();

            fetch('http://127.0.0.1:8000/delete-avatar/', {
                method: "DELETE",
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRFToken": csrftoken,
                },
            })
            .then((response) => response.json())
            .then((data) => {
                console.log("Delete ", data)
                const profileAvatar = document.getElementsByClassName("profile-avatar");

                for (var i = 0; i < profileAvatar.length; i++) {
                    profileAvatar[i].src = data.default_image
                }
            })
        })
    }
    
    // if (deleteAvatarForm != null) {
    //     deleteAvatar();
    // }
    
    
    // if (avatarForm != null) {
    //     changeAvatar();
    // }
    
    // changeAvatar();

    const followUnfollow = () => {
        const followForm = document.querySelector(".follow-form");

        followForm.addEventListener("submit", (e) => {
            e.preventDefault()
            const formId = e.target.getAttribute('data-user-id')
            console.log("form id ", formId)
            const url = `http://127.0.0.1:8000/follow-unfollow/${formId}/`

            fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRFToken": csrftoken,
                },
                // body: JSON.stringify({

                // })
                })
                .then((response) => response.json())
                .then((data) => {
                    console.log("Follow Success ", data)

                    const followButton = document.querySelector(".follow-button")
                    const followersNum = document.querySelector(".followers-number")
                    console.log("Followers number ", followersNum.textContent)
                    
                    followButton.textContent = data.followers_bool ? "Unfollow" : "Follow";
                    if (data.followers_bool === false) {
                        followButton.classList.add('btn-info')
                        followButton.classList.remove('btn-danger')
                    } else {
                        followButton.classList.add('btn-danger')
                        followButton.classList.remove('btn-info')
                    }

                    followersNum.textContent = data.followers_count ? `${data.followers_count}` : `${data.followers_count}`
            })
        })
    }

    if (profilePostForm != null) {
        profilePostForm.addEventListener("submit", (e) => {
            e.preventDefault()

            const profileId = e.target.getAttribute("data-user-id")
            console.log("Profile id ", profileId)

            const url = `http://127.0.0.1:8000/profile/${profileId}/`
            
            const inputContent = document.querySelector("#id_content").value;
            const inputImageContent = document.querySelector("#id_image").files;

            let formData = new FormData()
            formData.append("image", inputImageContent[0])
            formData.append('content', sanitizeString(inputContent))

            fetch(url, {
                method: "POST",
                headers: {
                    // "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRFToken": csrftoken,
                },
                body: formData
            })
            .then((response) => response.json())
            .then((data) => {
                console.log("Success ", data)
                console.log("data image ", data.user_profile_image)

                // const insertText = (text) => {
                //     const contentP = document.querySelector(".para-content")
                //     contentP.textContent = text
                //     // contentP.insertAdjacentText("afterbegin", data)
                // }

                // const contentP = document.querySelector(".para-content")
                // const yes = contentP.textContent = `${data.content}`
                const contentString = data.content

                const contentP = document.createElement("p")

                const innerPText = () => {
                    const contentP = document.createElement("p")
                    contentP.textContent = data.content
                }

                postBody.insertAdjacentHTML("afterbegin", 
                        `   
                            <div class="card-body d-flex">
                                <img src="${data.user_profile_image}" class="rounded-circle profile-avatar" width="35px" height="35px">
                                <h5 class="card-title ms-2">
                                    ${data.user}
                                </h5>
                            </div>
                            ${data.image &&
                                `<img src="${data.image}" class="card-img-top" alt="Post Image">`
                            }
                            <div class="card-body content-body">
                                <p class="card-text">
                                    ${data.content}
                                </p>
                                <p>${data.created}</p>
                                ${(data.main_user_id == data.user_id) ?
                                    `<a href="/update-post/${data.id}">
                                        Edit Post
                                    </a>
                                    <a href="/delete-post/${data.id}">
                                        Delete Post
                                    </a>`
                                    : ``
                                }
                                <a href="/single-post/${data.id}">
                                    View Post
                                </a>
                                <div>
                                    <form       class="like-unlike-forms"
                                        data-form-id="${data.id}">
                                        ${data.likes ?
                                        `<button
                                            type="submit"
                                            id="like-unlike-${data.id}"
                                            name="post_id"
                                            value="${data.id}"
                                            class="btn btn-danger">
                                            Unlike
                                        </button>` :
                                        `<button
                                            type="submit"
                                            id="like-unlike-${data.id}"
                                            name="post_id"
                                            value="${data.id}"
                                            class="btn btn-primary">
                                            Like
                                        </button>`
                                        }
                                        <p class="render-likes-${data.id}">- ${data.likes_count} Likes - </p>
                                    </form>
                                </div>
                                <p>
                                    <a 
                                        data-bs-toggle="collapse"
                                        href="#collapseExample-${data.id}"
                                        role="button"
                                        aria-expanded="false"
                                        aria-controls="collapseExample-${data.id}"
                                    >
                                        Comments
                                    </a>
                                </p>
                                <div
                                    class="collapse"
                                    id="collapseExample-${data.id}"
                                >
                                    <div>
                                        <form
                                            class="all-comments-form"
                                            data-comment-id="${data.id}"
                                        >
                                            <div class="input-group mb-3">
                                                <button
                                                    type="submit"
                                                    class="input-group-text comment-${data.id}"
                                                    name="submit_c_form"
                                                >
                                                    Post
                                                </button>
                                                <input 
                                                    type="text"
                                                    name="body"
                                                    class="form-control comment-input-${data.id}"
                                                    required
                                                    id="id_body"
                                                >
                                            </div>
                                        </form>
                                    </div>
                                    <div class="card card-body comments-div-${data.id}">
                                        ${(data.comments.length != 0) ?
                                            data.comments.map(c =>
                                            `<div class="d-flex mb-1">
                                                <div class="flex-shrink-0">
                                                    <img src="${c.comment_user_profile}" class="rounded-circle profile-avatar" width="30px" height="30px">
                                                </div>
                                                <div class="ms-2 bd-highlight bg-secondary bg-gradient rounded-pill">
                                                    <div class="ms-3 me-5">
                                                        ${c.comment_user}
                                                    </div>
                                                    <p class="ms-3 me-5">
                                                        ${c.body}
                                                    </p>
                                                </div>
                                            </div>`).join("")
                                        :
                                        `<p class="no-comments no-comments-${data.id}">
                                            Be the first to comment
                                        </p>`
                                    }
                                    </div>
                                </div>    
                            </div>
                        `
                        )
                        followUnfollow();
                        likeUnlikePosts();
                        commentsForm();
                        profilePostForm.reset()
                        // if (document.body.contains(beforeFirstPost)){
                        //     beforeFirstPost.remove()
                        // }
            })
        })
    }

    const likeUnlikePosts = () => {
        const likeUnlikeForms = [...document.getElementsByClassName("like-unlike-forms")]
        likeUnlikeForms.forEach(form => form.addEventListener("submit", (e) => {
            e.preventDefault(); 
            const dataLikeForm = e.target.getAttribute('data-form-id');
            const clickedLikeBtn = document.getElementById(`like-unlike-${dataLikeForm}`);
            const renderLikes = document.querySelector(`.render-likes-${dataLikeForm}`);
            console.log("Data like form ", dataLikeForm)
            console.log("clicked like btn ", clickedLikeBtn)
            const url = `http://127.0.0.1:8000/like-post/${dataLikeForm}/`
            // const url = "like-post/"

            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRFToken": csrftoken,
                },
                body: JSON.stringify({"post_id": dataLikeForm})
            })
            .then((response) => response.json())
            .then((data) => {
                console.log("Like success ", data)
                // clickedLikeBtn.addEventListener("click", (e) => {
                //     console.log("clicked like btn ", clickedLikeBtn)
                //         clickedLikeBtn.classList.toggle("btn-info")
                        // clickedLikeBtn.classList.remove("btn-info")
                        // clickedLikeBtn.classList.add("btn-danger")
                    // if (clickedLikeBtn.classList.contains("btn btn-info")) {
                    //     clickedLikeBtn.classList.remove("btn btn-info")
                    //     clickedLikeBtn.classList.add("btn btn-danger")
                    // }
                // })

                // clickedLikeBtn.classList.remove('btn btn-info')

                // if (clickedLikeBtn.classList.contains("btn btn-info")) {
                //     clickedLikeBtn.classList.remove("btn btn-info")
                // }

                clickedLikeBtn.textContent = data.like_bool ? `Unlike` : `Like`;
                // clickedLikeBtn.classList.remove('btn btn-info')
                // clickedLikeBtn.classList.add('btn btn-danger')
                // const displayAjaxLikes = document.createElement("p")
                if (data.like_bool === false) {
                    clickedLikeBtn.classList.add('btn-info')
                    clickedLikeBtn.classList.remove('btn-danger')
                } else {
                    clickedLikeBtn.classList.add('btn-danger')
                    clickedLikeBtn.classList.remove('btn-info')
                }
                renderLikes.textContent = data.count ? `- ${data.count} Likes -` : `- ${data.count} Likes -`

            })
            e.stopImmediatePropagation();
            // return false;
        }))
    }

    const commentsForm = () => {
        const allCommentsForm = [...document.getElementsByClassName("all-comments-form")]
        allCommentsForm.forEach(form => form.addEventListener("submit", (e) => {
            e.preventDefault();
            const dataCommentForm = e.target.getAttribute("data-comment-id");
            const clickedCommentBtn = document.querySelector(`.comment-${dataCommentForm}`)
            const commentInput = document.querySelector(`.comment-input-${dataCommentForm}`).value
            console.log("Comment input id", dataCommentForm)
            console.log("Comment input ", commentInput)
            
            const data = {body: sanitizeString(commentInput)}

            fetch(`http://127.0.0.1:8000/comments/${dataCommentForm}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrftoken
                },
                body: JSON.stringify(data)
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("Success ", data)

                    const noCommentsP = document.querySelector(`.no-comments-${dataCommentForm}`);

                    const commentsDiv = document.querySelector(`.comments-div-${dataCommentForm}`)

                    const divFlex = document.createElement("div");
                    divFlex.classList.add("d-flex", "mb-1")

                    const shrinkDiv = document.createElement("div")
                    shrinkDiv.classList.add("flex-shrink-0");
                    divFlex.append(shrinkDiv)

                    const commentProfileImg = document.createElement("img");
                    commentProfileImg.src= data.profile_image;
                    commentProfileImg.classList.add("rounded-circle, profile-avatar");
                    commentProfileImg.style.width = "30px";
                    commentProfileImg.style.height = "30px";
                    shrinkDiv.append(commentProfileImg)


                    const commentDiv = document.createElement("div");
                    commentDiv.classList.add("ms-2", "bd-highlight", "bg-secondary", "bg-gradient", "rounded-pill")
                    divFlex.append(commentDiv)

                    const nameDiv = document.createElement("div")
                    nameDiv.classList.add("ms-3", "me-5")
                    nameDiv.textContent = data.user;
                    commentDiv.append(nameDiv)

                    const bodyP = document.createElement("p");
                    bodyP.classList.add("ms-3", "me-5");
                    bodyP.textContent = data.body;
                    commentDiv.append(bodyP)

                    commentsDiv.prepend(divFlex);
                    
                    form.reset();
                    
                    if (document.body.contains(noCommentsP)){
                        noCommentsP.remove()
                    }


                })
                e.stopImmediatePropagation();
        }))
    }
    
    followUnfollow();
    commentsForm();
    likeUnlikePosts();
    
    var page = 1;
    var blockRequest = false;
    var endPagination = false;

    window.addEventListener("scroll", (e) => {
        // console.log("Scrolling")
        // console.log("Document height ", document.body.clientHeight)
        const margin = document.body.clientHeight - window.innerHeight - 200;
        // console.log("Margin ", margin)

        if (window.scrollY > margin && endPagination === false && blockRequest === false) {
            blockRequest = true;
            page += 1;
            console.log("Page inside block ", page)

            var url  = new URL(`http://127.0.0.1:8000/profile/${loggedUserId}/`),
                params = {page:page}
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

            fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application-json",
                    "X-Requested-With": "XMLHttpRequest"
                },
                data: JSON.stringify({"page": page}),
            })
            .then((response) => response.json())
            .then((data) => {
                console.log("data ", data)
                console.log("end pagination ", data.end_pagination)

                if (data.end_pagination === true) {
                    endPagination = true;
                } else {
                    blockRequest = false;
                }
                // https://stackoverflow.com/questions/44488434/inserting-if-statement-inside-es6-template-literal
                for (let i of data.data) {
                    postBody.insertAdjacentHTML("beforeend", 
                    `   
                        <div class="card-body d-flex">
                            <img src="${i.user_profile_img}" class="rounded-circle profile-avatar" width="35px" height="35px">
                            <h5 class="card-title ms-2">
                                ${i.user}
                            </h5>
                        </div>
                        ${i.image &&
                            `<img src="${i.image}" class="card-img-top" alt="Post Image">`
                        }
                        <div class="card-body">
                            <p class="card-text">
                                ${i.content}
                            </p>
                            <p>${i.created}</p>
                            ${(data.user == i.user_id) ?
                                `<a href="/update-post/${i.id}">
                                    Edit Post
                                </a>
                                <a href="/delete-post/${i.id}">
                                    Delete Post
                                </a>`
                                : ``
                            }
                            <a href="/single-post/${i.id}">
                                View Post
                            </a>
                            <div>
                                <form       class="like-unlike-forms"
                                    data-form-id="${i.id}">
                                    ${i.likes ?
                                    `<button
                                        type="submit"
                                        id="like-unlike-${i.id}"
                                        name="post_id"
                                        value="${i.id}"
                                        class="btn btn-danger">
                                        Unlike
                                    </button>` :
                                    `<button
                                        type="submit"
                                        id="like-unlike-${i.id}"
                                        name="post_id"
                                        value="${i.id}"
                                        class="btn btn-primary">
                                        Like
                                    </button>`
                                    }
                                    <p class="render-likes-${i.id}">- ${i.likes_count} Likes - </p>
                                </form>
                            </div>
                            <p>
                                <a 
                                    data-bs-toggle="collapse"
                                    href="#collapseExample-${i.id}"
                                    role="button"
                                    aria-expanded="false"
                                    aria-controls="collapseExample-${i.id}"
                                >
                                    Comments
                                </a>
                            </p>
                            <div
                                class="collapse"
                                id="collapseExample-${i.id}"
                            >
                                <div>
                                    <form
                                        class="all-comments-form"
                                        data-comment-id="${i.id}"
                                    >
                                        <div class="input-group mb-3">
                                            <button
                                                type="submit"
                                                class="input-group-text comment-${i.id}"
                                                name="submit_c_form"
                                            >
                                                Post
                                            </button>
                                            <input 
                                                type="text"
                                                name="body"
                                                class="form-control comment-input-${i.id}"
                                                required
                                                id="id_body"
                                            >
                                        </div>
                                    </form>
                                </div>
                                <div class="card card-body comments-div-${i.id}">
                                    ${(i.comments.length != 0) ?
                                        i.comments.map(c =>
                                        `<div class="d-flex mb-1">
                                            <div class="flex-shrink-0">
                                                <img src="${c.comment_user_profile}" class="rounded-circle profile-avatar" width="30px" height="30px">
                                            </div>
                                            <div class="ms-2 bd-highlight bg-secondary bg-gradient rounded-pill">
                                                <div class="ms-3 me-5">
                                                    ${c.comment_user}
                                                </div>
                                                <p class="ms-3 me-5">
                                                    ${c.body}
                                                </p>
                                            </div>
                                        </div>`).join("")
                                    :
                                    `<p class="no-comments no-comments-${i.id}">
                                        Be the first to comment
                                    </p>`
                                }
                                </div>
                            </div>    
                        </div>
                    `
                    )

                    commentsForm();
                    likeUnlikePosts();
                }
            })
        }
    })

    if (avatarForm != null) {
        changeAvatar();
    }

    if (deleteAvatarForm != null) {
        deleteAvatar();
    }
})