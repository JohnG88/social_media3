console.log('main.js')

const paginator = document.querySelector(".paginator");
const loading = document.querySelector(".loading");

const cardCenter = document.querySelector(".card");
const postCenterBody = document.querySelector(".post-center-body");

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



var page = 1;
var blockRequest = false;
var endPagination = false;

// Add this if statement to only use in index page
if (window.location.href === "http://127.0.0.1:8000/") {
    window.addEventListener("scroll", (e) => {
        // console.log('Scrolling')
        // console.log("Document height ", document.body.clientHeight)
        // console.log("Window height ", window.innerHeight)
        const margin = document.body.clientHeight - window.innerHeight - 100;
        // console.log("Margin ", margin)

        if (window.scrollY > margin && endPagination === false && blockRequest === false) {
            blockRequest = true;
            page += 1;
            // console.log("Page inside block", page)
            
            // lines below allow to add data through url parameters like from jquery ajax data property
            var url = new URL("http://127.0.0.1:8000/"),
                params = {page:page}
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

            fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                }, 
                data: JSON.stringify({"page": page}),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("data ", data)
                    if (data.end_pagination === true) {
                        endPagination = true;
                    } else {
                        blockRequest = false;
                    }
                    // postCenter.append(data.content)
                    // const dataDiv = document.createElement("div")
                    // dataDiv.textContent = `${data.id}`
                    // // cardCenter.append(dataDiv);
                    // postCenterBody.append(dataDiv);

                    // need to do forEach
                    // console.log("data length", data.data.length)

                    for (let i = 0; i < data.data.length; i++) {
                        // console.log("For loo data id", data.data[i].id);
                        const dataDiv = document .createElement("div");
                        dataDiv.classList.add("post-center");
                        // dataDiv.textContent = data.data[i].id;
                        postCenterBody.append(dataDiv);

                        const styleDiv = document.createElement("div");
                        styleDiv.style.width = "40rem";
                        dataDiv.append(styleDiv);

                        const cardDiv = document.createElement("div");
                        cardDiv.classList.add("card");
                        styleDiv.append(cardDiv);

                        const normalDiv = document.createElement("div");
                        cardDiv.append(normalDiv);

                        const cardBodyFlexDiv = document.createElement("div");
                        cardBodyFlexDiv.classList.add("card-body", "d-flex");
                        normalDiv.append(cardBodyFlexDiv);

                        const userLinkProfileImage = document.createElement("a");
                        userLinkProfileImage.href = "#";
                        cardBodyFlexDiv.append(userLinkProfileImage)

                        const userProfileImage = document.createElement("img");
                        userProfileImage.src = data.data[i].user_profile_img;
                        userProfileImage.classList.add("rounded-circle");
                        userProfileImage.style.width = "35px";
                        userProfileImage.style.height = "35px";
                        userLinkProfileImage.append(userProfileImage);

                        const usernameLink = document.createElement("a");
                        usernameLink.href = `/profile/${data.data[i].user_id}`;
                        usernameLink.classList.add("card-title", "ms-2");
                        cardBodyFlexDiv.append(usernameLink)

                        const username = document.createElement("h4");
                        username.textContent = data.data[i].user
                        usernameLink.append(username);

                        // Everything below goes in normal div, also have to check if image exists and if it doesn't leave empty
                        if (data.data[i].image != "") {
                            const normalImage = document.createElement("img");
                            normalImage.src = data.data[i].image;
                            normalImage.classList.add("card-img-top")
                            normalImage.alt = "Post Image";
                            normalDiv.append(normalImage);
                        }

                        const cardBodyDiv = document.createElement("div");
                        cardBodyDiv.classList.add("card-body");
                        normalDiv.append(cardBodyDiv);

                        const postContent = document.createElement("h4");
                        postContent.classList.add("card-text");
                        postContent.textContent = data.data[i].content;
                        cardBodyDiv.append(postContent);

                        const createdDate = document.createElement("p");
                        createdDate.textContent = data.data[i].created;
                        cardBodyDiv.append(createdDate);

                        // check to see if post.user = user to hide or show links below;
                        if (data.user === data.data[i].user_id ) {
                            const editPost = document.createElement("a");
                            editPost.href = `/update-post/${data.data[i].id}/`;
                            editPost.textContent = "Edit Post";
                            cardBodyDiv.append(editPost)

                            const deletePost = document.createElement("a");
                            deletePost.classList.add("ms-1");
                            deletePost.href = `/delete-post/${data.data[i].id}`
                            deletePost.textContent = "Delete Post"
                            cardBodyDiv.append(deletePost);

                        }

                        const viewPost = document.createElement("a");
                            viewPost.href = `/single-post/${data.data[i].id}`;
                            viewPost.textContent = "View Post";
                            cardBodyDiv.append(viewPost);

                        const normalDivTwo = document.createElement("div");
                        cardBodyDiv.append(normalDivTwo);

                        const likeForm = document.createElement("form");
                        likeForm.action = `/like-post/${data.data[i].id}`;
                        likeForm.method = "POST";
                        likeForm.classList.add("like-unlike-form");
                        normalDivTwo.append(likeForm);

                        // will add csrftoken
                        const csrfInput = document.createElement("input");
                        csrfInput.type = "hidden";
                        csrfInput.name = "csrfmiddlewaretoken";
                        csrfInput.value = csrftoken;
                        likeForm.append(csrfInput);

                        // check to see if user already liked or hasn't liked
                        const likeButton = document.createElement("button");
                        likeButton.type = "submit";
                        likeButton.name = "post_id";
                        likeButton.value = `${data.data[i].id}`;
                        if (data.data[i].likes === true) {
                            likeButton.classList.add("btn", "btn-danger");
                            likeButton.textContent = "Unlike";
                        } else {
                            likeButton.classList.add("btn", "btn-info");
                            likeButton.textContent = "Like";
                        }
                        // if (data.data[i].likes_count) {
                        //     likeForm.textContent = `- ${data.data[i].likes_count} Likes -`;
                        // }
                        likeForm.append(likeButton);
            
                        // likeForm.textContent = "- Likes -";
                        
                        const likeDisplay = document.createElement("p");
                        if (data.data[i].likes_count) {
                            likeDisplay.textContent = `- ${data.data[i].likes_count} Likes -`;
                        }
                        likeForm.append(likeDisplay)

                        const normalDivThree = document.createElement("div");
                        cardBodyDiv.append(normalDivThree);

                        const commentForm = document.createElement("form");
                        commentForm.method = "POST";
                        normalDivThree.append(commentForm);

                        // will add csrftoken
                        const csrfCommentInput = document.createElement("input");
                        csrfCommentInput.type = "hidden";
                        csrfCommentInput.name = "csrfmiddlewaretoken";
                        csrfCommentInput.value = csrftoken;
                        commentForm.append(csrfCommentInput);

                        const commentHiddenInput = document.createElement("input");
                        commentHiddenInput.type = "hidden";
                        commentHiddenInput.name = "comment_post_id";
                        commentHiddenInput.value = data.data[i].id;
                        commentForm.append(commentHiddenInput);

                        const commentInputGroup = document.createElement("div");
                        commentInputGroup.classList.add("input-group", "mb-3");
                        commentForm.append(commentInputGroup);

                        const commentButton = document.createElement("button");
                        commentButton.type = "submit";
                        commentButton.classList.add("input-group-text");
                        commentButton.textContent = "Post";
                        commentInputGroup.append(commentButton)

                        const commentInputBody = document.createElement("input");
                        commentInputBody.type = "text";
                        commentInputBody.name = "body";
                        commentInputBody.maxlength = 500;
                        commentInputBody.classList.add("form-control");
                        commentInputBody.required = true;
                        commentInputBody.id = "id_body";
                        commentInputGroup.append(commentInputBody);

                        const commentP = document.createElement("p");
                        cardBodyDiv.append(commentP);

                        const commentLinkCollapse = document.createElement("a");
                        commentLinkCollapse.setAttribute("data-bs-toggle", "collapse");
                        commentLinkCollapse.href = `#collapseExample-${data.data[i].id}`;
                        commentLinkCollapse.setAttribute("role", "button");
                        commentLinkCollapse.setAttribute("aria-expanded", "false");
                        commentLinkCollapse.setAttribute("aria-controls", `#collapseExample-${data.data[i].id}`);
                        commentLinkCollapse.textContent = "Comments";
                        commentP.append(commentLinkCollapse);

                        const divCollapse = document.createElement("div");
                        divCollapse.classList.add("collapse");
                        divCollapse.id = `collapseExample-${data.data[i].id}`;
                        cardBodyDiv.append(divCollapse);

                        const commentsDiv = document.createElement("div");
                        commentsDiv.classList.add("card", "card-body")
                        divCollapse.append(commentsDiv)

                        // const commentsFlexDiv = document.createElement("div");
                        // commentsFlexDiv.classList.add("d-flex", "mb-1")
                        // commentsDiv.append(commentsFlexDiv);

                        // const commentsFlexShrinkDiv = document.createElement("div")
                        // commentsFlexShrinkDiv.classList.add("flex-shrink-0");
                        // commentsFlexDiv.append(commentsFlexShrinkDiv);

                        // const commentsProfileImage = document.createElement("img")
                        // commentsProfileImage.src = "#";
                        // commentsProfileImage.classList.add("rounded-circle");
                        // commentsProfileImage.style.width = "30px";
                        // commentsProfileImage.style.height = "30px";
                        // commentsFlexShrinkDiv.append(commentsProfileImage)

                        // const renderedComments = document.createElement("div");
                        // renderedComments.classList.add("ms-2", "bd-highlight", "bg-secondary", "bg-gradient", "rounded-pill");
                        // commentsFlexDiv.append(renderedComments);

                        // const usernameComments = document.createElement("div");
                        // usernameComments.classList.add("ms-3", "me-5");
                        // usernameComments.textContent = "Username";
                        // renderedComments.append(usernameComments);
                        
                        if (data.data[i].comments.length === 0) {
                            const noComments = document.createElement("p");
                            noComments.classList.add("no-comments");
                            noComments.textContent = "Be the first to comment.";
                            commentsDiv.append(noComments);
                        }

                        for (let j = 0; j < data.data[i].comments.length; j++) {
                            console.log("comments", data.data[i].comments[j]);

                            // if (data.data[i].comments[j].length === 0) {
                            //     const noComments = document.createElement("p");
                            //     noComments.classList.add("no-comments");
                            //     noComments.textContent = "Be the first to comment.";
                            //     commentsDiv.append(noComments);
                            // }

                            // const commentsDiv = document.createElement("div");
                            // commentsDiv.classList.add("card", "card-body")
                            // divCollapse.append(commentsDiv)

                            const commentsFlexDiv = document.createElement("div");
                            commentsFlexDiv.classList.add("d-flex", "mb-1")
                            commentsDiv.append(commentsFlexDiv);

                            const commentsFlexShrinkDiv = document.createElement("div")
                            commentsFlexShrinkDiv.classList.add("flex-shrink-0");
                            commentsFlexDiv.append(commentsFlexShrinkDiv);

                            const commentsProfileImage = document.createElement("img")
                            commentsProfileImage.src = data.data[i].comments[j].comment_user_profile;
                            commentsProfileImage.classList.add("rounded-circle");
                            commentsProfileImage.style.width = "30px";
                            commentsProfileImage.style.height = "30px";
                            commentsFlexShrinkDiv.append(commentsProfileImage)

                            const renderedComments = document.createElement("div");
                            renderedComments.classList.add("ms-2", "bd-highlight", "bg-secondary", "bg-gradient", "rounded-pill");
                            commentsFlexDiv.append(renderedComments);

                            const usernameComments = document.createElement("div");
                            usernameComments.classList.add("ms-3", "me-5");
                            usernameComments.textContent = data.data[i].comments[j].comment_user;
                            renderedComments.append(usernameComments);

                            const commentsP = document.createElement("p");
                            commentsP.classList.add("ms-3", "me-5");
                            commentsP.textContent = data.data[i].comments[j].body
                            renderedComments.append(commentsP);

                        }
                        // console.log("Main comments", data.data[i]['comments'][0]["body"])
                        // const commentsP = document.createElement("p");
                        // commentsP.classList.add("ms-3", "ms-5");
                        // // commentsP.textContent = data.data[i].comments[j]
                        // renderedComments.append(commentsP);

                    }
                })
        }
    })
}

// const likeUnlikePosts = (e) => {
//     const likeUnlikeForms = [...document.getElementsByClassName("like-unlike-form")]
//     for (let i = 0; i < likeUnlikeForms.length; i++) {
//         likeUnlikeForms[i].addEventListener("submit", () => {
//             const getPostValue = 
//         })
//     }
// }