document.addEventListener("DOMContentLoaded", function(event) { 
    const windowLocation = window.location.href
    // console.log("Window location ", windowLocation)
    // console.log("Profile page")
    const postBody = document.querySelector(".post-body")
    const userId = document.querySelector("#current-user")
    // const hereUrl = window.location.href;
    const loggedUserId = userId.dataset.userId
    // console.log("user id", userId)
    // console.log("user id ", userId.dataset.userId)
    // console.log("window location ", hereUrl)

    const profilePostForm = document.querySelector(".profile-post-form");

    const beforeFirstPost = document.querySelector("#before-first-post")

    const avatarForm = document.querySelector(".avatar-form")
    const deleteAvatarForm = document.querySelector(".delete-form")

    const pContent = document.createElement("p")

    const avatarDiv = document.querySelector(".now");
    const deleteAvatarDiv = document.querySelector(".delete-avatar-div")
    const changeAvatarBtnDiv = document.querySelector(".change-btn-div")
    // console.log("delete avatar div ", deleteAvatarDiv)

    // inputIContent.length = null ? changeBtn.disabled = true : changeBtn.disabled = false

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

    const inputIContent = document.querySelector("#id_avatar");
    // console.log("IMage input length ", inputIContent.value.length)

    const changeBtn = document.querySelector(".change-btn")
    // if (changeBtn != null) {
    //     changeBtn.disabled = true
    // }
    // if (changeBtn != null) {
    //     console.log("CHnage btn ", changeBtn)
    //     changeBtn.addEventListener("click", () => {
    //         changeAvatarBtnDiv.remove();
    //     })
    // }
    

    // const inputImageDisableChange = () => {
    //     inputIContent.addEventListener('click', () => {
    //     console.log("Input content length ", inputIContent.value)
    //         inputIContent.value = false || undefined ? changeBtn.disabled = true : changeBtn.disabled = false
    //     })
    // }
    // if (inputIContent != null) {
    //     inputImageDisableChange();
    // }

    if (inputIContent != null) {
        console.log(document.querySelector("#id_avatar").value)
        inputIContent.addEventListener("change", stateHandle)
        inputIContent.addEventListener("click", function handleClick() {
            const changeBtnDiv = document.querySelector(".change-btn-div")
            if (changeBtnDiv != null) {
                changeBtnDiv.remove()
            }
        })
    }

    
    
    function stateHandle() {
        (document.querySelector("#id_avatar").value === "") ? "" :
            avatarForm.insertAdjacentHTML('beforeend',
                `
                <div class="input-group mb-3 change-btn-div">
                    <button class="input-group-text btn-success change-btn">Change Avatar</button>
                </div>
                `
            )
            
        changeAvatar()
    }

    const changeAvatar = () => {
        // const avatarForm = document.querySelector(".avatar-form")
        avatarForm.addEventListener("submit", (e) => {
            e.preventDefault()
            const avatarId = e.target.getAttribute('data-user-id');
            // console.log("Avatar Id ", avatarId)

            const inputImageContent = document.querySelector("#id_avatar").files;
            console.log("Image length in change ", inputImageContent.length)

            // inputImageContent.files.length > 1 ? changeBtn.disabled = true : changeBtn.disabled = false

            // const changeBtn = document.querySelector(".change-btn")

            // inputImageContent.length = null ? changeBtn.disabled = true : changeBtn.disabled = false 

            let formData = new FormData()
            formData.append("avatar-image", inputImageContent[0])

            const url = `/change-avatar/`

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
                // changeBtn.disabled = true
                // console.log("Success Avatar ", data)
                const profileAvatar = document.getElementsByClassName(`profile-avatar-${avatarId}`);
                // console.log("profile avatar ", profileAvatar)
                // profileAvatar.src = data.new_avatar_image
                const deleteForm = document.querySelector(".delete-form")
                const deleteADiv = document.querySelector(".delete-avatar-div")

                for (var i = 0; i < profileAvatar.length; i++) {
                    profileAvatar[i].src = data.new_avatar_image
                }

                // if (data.new_avatar_image === '/media/avatar.png') {
                //     deleteAvatarDiv.remove()
                // }
                // deleteAvatarDiv.remove()

                deleteForm != null ? '' : avatarDiv.insertAdjacentHTML('beforeend', 
                `
                    <div class="ncol-auto delete-avatar-div">
                        <form
                            class="delete-form"
                            data-user-id="${avatarId}"
                        >
                            
                            <div class="input-group mb-3">
                                <button class="input-group-text btn-danger">Delete Avatar</button>
                            </div>
                        </form>
                    </div>
                `
                )
                // console.log("Delete form from change avatar ", deleteAvatarForm)
                avatarForm.reset();

                // if (deleteForm != null) {
                //     deleteAvatar();
                // }
                deleteAvatar();
                // changeBtn.disabled = true
                // if (deleteAvatarForm != null) {
                //     deleteAvatar();
                // }
                const changeAvatarBtnDiv = document.querySelector(".change-btn-div")

                if (changeAvatarBtnDiv != null) {
                    changeAvatarBtnDiv.remove()
                }
            })
            e.stopImmediatePropagation();
        })
    }

    const deleteAvatar = () => {
        const deleteForm = document.querySelector(".delete-form")
        deleteForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const avatarId = e.target.getAttribute('data-user-id');

            fetch('/delete-avatar/', {
                method: "DELETE",
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRFToken": csrftoken,
                },
            })
            .then((response) => response.json())
            .then((data) => {
                // console.log("Delete ", data)
                // console.log("Delete form from delete avatar ", deleteAvatarForm)

                const profileAvatar = document.getElementsByClassName(`profile-avatar-${avatarId}`);
                const deleteThisForm = document.querySelector(".delete-form")
                // console.log("Delete form ", deleteThisForm)
                

                for (var i = 0; i < profileAvatar.length; i++) {
                    profileAvatar[i].src = data.default_image
                }

                // if (data.default_image === "/media/avatar.png") {
                //     deleteThisDiv.remove()
                // }

                const deleteThisDiv = document.querySelector(".delete-avatar-div")

                // deleteAvatarDiv.remove()
                if (deleteThisDiv != null) {
                    deleteThisDiv.remove()
                }
                

                const changeAvatarBtnDiv = document.querySelector(".change-btn-div")

                if (changeAvatarBtnDiv != null) {
                    changeAvatarBtnDiv.remove()
                }

                // deleteThisDiv.remove()

                // console.log("Dlete avatar div in delte ", deleteAvatarDiv)
            })
            e.stopImmediatePropagation();
        })
    }
    
    // if (avatarForm != null) {
    //     changeAvatar();
    // }
    
    // changeAvatar();

    const followUnfollow = () => {
        const followForm = document.querySelector(".follow-form");

        followForm.addEventListener("submit", (e) => {
            e.preventDefault()
            const formId = e.target.getAttribute('data-user-id')
            // console.log("form id ", formId)
            const url = `/follow-unfollow/${formId}/`

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
                    // console.log("Follow Success ", data)

                    const followButton = document.querySelector(".follow-button")
                    const followersNum = document.querySelector(".followers-number")
                    // console.log("Followers number ", followersNum.textContent)
                    
                    followButton.textContent = data.followers_bool ? "Unfollow" : "Follow";
                    if (data.followers_bool === false) {
                        followButton.classList.add('btn-info')
                        followButton.classList.remove('btn-danger')
                    } else {
                        followButton.classList.add('btn-danger')
                        followButton.classList.remove('btn-info')
                    }

                    followersNum.textContent = data.followers_count ? `${data.followers_count}` : `${data.followers_count}`

                    const child = document.querySelector(`.user-id-${formId}`)

                    if (data.followers_bool === true) {
                        const parent = document.querySelector(".contact-div");
                        // console.log("Parent ", parent)
                        

                        parent.appendChild(child)
                    } else {
                        const secondParent = document.querySelector(".people-div");
                        secondParent.appendChild(child)
                    }
            })
        })
    }

    if (profilePostForm != null) {
        profilePostForm.addEventListener("submit", (e) => {
            e.preventDefault()

            const profileId = e.target.getAttribute("data-user-id")
            // console.log("Profile id ", profileId)

            const url = `/profile/${profileId}/`
            
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
                // console.log("Success ", data)
                // console.log("data image ", data.user_profile_image)

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
                                <img src="${data.user_profile_image}" class="rounded-circle profile-avatar-${profileId}" width="35px" height="35px">
                                <h5 class="card-title ms-2">
                                    ${data.user}
                                </h5>
                            </div>
                            <p class="card-text ms-3">
                                    ${data.content}
                            </p>
                            ${data.image &&
                                `<img src="${data.image}" class="card-img-top" alt="Post Image">`
                            }
                            <div class="card-body content-body">
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
                                                    <img src="${c.comment_user_profile}" class="rounded-circle profile-avatar-${c.user_id}" width="30px" height="30px">
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
            // console.log("Data like form ", dataLikeForm)
            // console.log("clicked like btn ", clickedLikeBtn)
            const url = `/like-post/${dataLikeForm}/`
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
                // console.log("Like success ", data)
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
            // console.log("Comment input id", dataCommentForm)
            // console.log("Comment input ", commentInput)
            
            const data = {body: sanitizeString(commentInput)}

            fetch(`/comments/${dataCommentForm}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrftoken
                },
                body: JSON.stringify(data)
            })
                .then((response) => response.json())
                .then((data) => {
                    // console.log("Success ", data)

                    const noCommentsP = document.querySelector(`.no-comments-${dataCommentForm}`);

                    const commentsDiv = document.querySelector(`.comments-div-${dataCommentForm}`)

                    const divFlex = document.createElement("div");
                    divFlex.classList.add("d-flex", "mb-1")

                    const shrinkDiv = document.createElement("div")
                    shrinkDiv.classList.add("flex-shrink-0");
                    divFlex.append(shrinkDiv)

                    const commentProfileImg = document.createElement("img");
                    commentProfileImg.src= data.profile_image;
                    commentProfileImg.classList.add("rounded-circle", `profile-avatar-${data.user_id}`);
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
            // console.log("Page inside block ", page)
            const m = `http://127.0.0.1:8000/profile/${loggedUserId}/`
            // const n = `https://john-chat-1.herokuapp.com/profile/${loggedUserId}/`

            var url  = new URL(windowLocation),
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
                // console.log("data ", data)
                // console.log("end pagination ", data.end_pagination)

                if (data.end_pagination === true) {
                    endPagination = true;
                } else {
                    blockRequest = false;
                }
                // https://stackoverflow.com/questions/44488434/inserting-if-statement-inside-es6-template-literal
                if (data.data) {
                    for (let i of data.data) {
                        postBody.insertAdjacentHTML("beforeend", 
                        `  
                        <div class="card"> 
                            <div class="card-body d-flex">
                                <img src="${i.user_profile_img}" class="rounded-circle profile-avatar-${i.user_id}" width="35px" height="35px">
                                <h5 class="card-title ms-2">
                                    ${i.user}
                                </h5>
                            </div>
                            <p class="card-text ms-3">
                                ${i.content}
                            </p>
                            ${i.image &&
                                `<img src="${i.image}" class="card-img-top" alt="Post Image">`
                            }
                            <div class="card-body">
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
                                            class="btn btn-info">
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
                                                    <img src="${c.comment_user_profile}" class="rounded-circle profile-avatar-${c.coments_user_id}" width="30px" height="30px">
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
                        </div>
                        `
                        )

                        commentsForm();
                        likeUnlikePosts();
                    }
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