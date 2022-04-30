document.addEventListener("DOMContentLoaded", function(event) { 
    


    console.log('main.js')

    const paginator = document.querySelector(".paginator");
    const loading = document.querySelector(".loading");

    const cardCenter = document.querySelector(".card");
    const postCenterBody = document.querySelector(".post-center-body");

    const postForm = document.querySelector("#post-form");



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
        }))
    }

    likeUnlikePosts();


    var page = 1;
    var blockRequest = false;
    var endPagination = false;

    postForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const inputContent = document.querySelector("#id_content").value;
        const inputImageContent = document.querySelector("#id_image").files;
        // console.log("Input value", inputContent)
        console.log("Input image value files 0", inputImageContent[0])
        // const data = {content: inputContent, image:inputImageContent}

        let formData = new FormData()
        formData.append('image', inputImageContent[0])
        formData.append('content', inputContent )

        console.log("Form data", formData)

        // var url = new URL("http://127.0.0.1:8000/"),
        //     params = {data:inputContent}
        //     Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        fetch("http://127.0.0.1:8000/", {
            method: "POST",
            headers: {
                // "Content-type": "application/json",
                // 'Content-Type': 'multipart/form-data; boundary=—-WebKitFormBoundaryfgtsKTYLsT7PNUVD',
                "X-Requested-With": "XMLHttpRequest",
                'X-CSRFToken': csrftoken,
            },
            // body: JSON.stringify(formData)
            body: formData
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success ', data)
                const dataDiv = document .createElement("div");
                dataDiv.classList.add("post-center");
                // dataDiv.textContent = data.data[i].id;
                postCenterBody.prepend(dataDiv);

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
                userProfileImage.src = `${data.user_profile_image}`;
                userProfileImage.classList.add("rounded-circle");
                userProfileImage.style.width = "35px";
                userProfileImage.style.height = "35px";
                userLinkProfileImage.append(userProfileImage);

                const usernameLink = document.createElement("a");
                usernameLink.href = `/profile/${data.post_user_id}`;
                usernameLink.classList.add("card-title", "ms-2");
                cardBodyFlexDiv.append(usernameLink)

                const username = document.createElement("h4");
                username.textContent = data.user
                usernameLink.append(username);

                // Everything below goes in normal div, also have to check if image exists and if it doesn't leave empty
                if (data.image != "") {
                    const normalImage = document.createElement("img");
                    normalImage.src = data.image;
                    normalImage.classList.add("card-img-top")
                    normalImage.alt = "Post Image";
                    normalDiv.append(normalImage);
                }

                const cardBodyDiv = document.createElement("div");
                cardBodyDiv.classList.add("card-body");
                normalDiv.append(cardBodyDiv);

                const postContent = document.createElement("h4");
                postContent.classList.add("card-text");
                postContent.textContent = data.content;
                cardBodyDiv.append(postContent);

                const createdDate = document.createElement("p");
                createdDate.textContent = data.created;
                cardBodyDiv.append(createdDate);

                // check to see if post.user = user to hide or show links below;
                if (data.user_id === data.post_user_id ) {
                    const editPost = document.createElement("a");
                    editPost.href = `/update-post/${data.id}/`;
                    editPost.textContent = "Edit Post";
                    cardBodyDiv.append(editPost)

                    const deletePost = document.createElement("a");
                    deletePost.classList.add("ms-1");
                    deletePost.href = `/delete-post/${data.id}`
                    deletePost.textContent = "Delete Post"
                    cardBodyDiv.append(deletePost);

                }

                const viewPost = document.createElement("a");
                viewPost.href = `/single-post/${data.id}`;
                viewPost.textContent = "View Post";
                cardBodyDiv.append(viewPost);

                const normalDivTwo = document.createElement("div");
                cardBodyDiv.append(normalDivTwo);

                const likeForm = document.createElement("form");
                // likeForm.action = `/like-post/${data.id}`;
                // likeForm.method = "POST";
                likeForm.classList.add("like-unlike-forms");
                likeForm.dataset.formId = `${data.id}`
                normalDivTwo.append(likeForm);

                // will add csrftoken
                // const csrfInput = document.createElement("input");
                // csrfInput.type = "hidden";
                // csrfInput.name = "csrfmiddlewaretoken";
                // csrfInput.value = csrftoken;
                // likeForm.append(csrfInput);

                // check to see if user already liked or hasn't liked
                const likeButton = document.createElement("button");
                likeButton.type = "submit";
                // likeButton.name = "post_id";
                likeButton.id = `like-unlike-${data.id}`
                likeButton.value = `${data.id}`;
                likeButton.classList.add("btn", "btn-info");
                // if (data.likes === true) {
                likeButton.textContent = data.likes ? `Unlike` : `Like`
                //     likeButton.classList.add("btn", "btn-danger");
                //     likeButton.textContent = "Unlike";
                // } else {
                //     likeButton.classList.add("btn", "btn-info");
                //     likeButton.textContent = "Like";
                // }
                // if (data.data[i].likes_count) {
                //     likeForm.textContent = `- ${data.data[i].likes_count} Likes -`;
                // }
                likeForm.append(likeButton);

                // likeForm.textContent = "- Likes -";
                
                const likeDisplay = document.createElement("p");
                likeDisplay.classList.add(`render-likes-${data.id}`)
                likeDisplay.textContent = `- ${data.likes_count} Likes -`;
                // if (data.likes_count) {
                //     likeDisplay.textContent = `- ${data.likes_count} Likes -`;
                // }
                likeForm.append(likeDisplay)

                const normalDivThree = document.createElement("div");
                cardBodyDiv.append(normalDivThree);

                const commentForm = document.createElement("form");
                commentForm.action = `/comments/${data.id}`
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
                commentHiddenInput.value = data.id;
                commentForm.append(commentHiddenInput);

                const commentInputGroup = document.createElement("div");
                commentInputGroup.classList.add("input-group", "mb-3");
                commentForm.append(commentInputGroup);

                const commentButton = document.createElement("button");
                commentButton.type = "submit";
                commentButton.classList.add("input-group-text");
                commentButton.name = "submit_c_form"
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
                commentLinkCollapse.href = `#collapseExample-${data.id}`;
                commentLinkCollapse.setAttribute("role", "button");
                commentLinkCollapse.setAttribute("aria-expanded", "false");
                commentLinkCollapse.setAttribute("aria-controls", `#collapseExample-${data.id}`);
                commentLinkCollapse.textContent = "Comments";
                commentP.append(commentLinkCollapse);

                const divCollapse = document.createElement("div");
                divCollapse.classList.add("collapse");
                divCollapse.id = `collapseExample-${data.id}`;
                cardBodyDiv.append(divCollapse);

                const commentsDiv = document.createElement("div");
                commentsDiv.classList.add("card", "card-body")
                divCollapse.append(commentsDiv)

                if (data.comments.length === 0) {
                    const noComments = document.createElement("p");
                    noComments.classList.add("no-comments");
                    noComments.textContent = "Be the first to comment.";
                    commentsDiv.append(noComments);
                }

                // for (let i = 0; i < data.comments.length; i++) {
                //     // console.log("comments", data.data[i].comments[j]);

                //     const commentsFlexDiv = document.createElement("div");
                //     commentsFlexDiv.classList.add("d-flex", "mb-1")
                //     commentsDiv.append(commentsFlexDiv);

                //     const commentsFlexShrinkDiv = document.createElement("div")
                //     commentsFlexShrinkDiv.classList.add("flex-shrink-0");
                //     commentsFlexDiv.append(commentsFlexShrinkDiv);

                //     const commentsProfileImage = document.createElement("img")
                //     commentsProfileImage.src = data.comments[i].comment_user_profile;
                //     commentsProfileImage.classList.add("rounded-circle");
                //     commentsProfileImage.style.width = "30px";
                //     commentsProfileImage.style.height = "30px";
                //     commentsFlexShrinkDiv.append(commentsProfileImage)

                //     const renderedComments = document.createElement("div");
                //     renderedComments.classList.add("ms-2", "bd-highlight", "bg-secondary", "bg-gradient", "rounded-pill");
                //     commentsFlexDiv.append(renderedComments);

                //     const usernameComments = document.createElement("div");
                //     usernameComments.classList.add("ms-3", "me-5");
                //     usernameComments.textContent = data.comments[i].comment_user;
                //     renderedComments.append(usernameComments);

                //     const commentsP = document.createElement("p");
                //     commentsP.classList.add("ms-3", "me-5");
                //     commentsP.textContent = data.comments[i].body
                //     renderedComments.append(commentsP);

                // }

                likeUnlikePosts();
            })
            .catch((error) => {
                console.log("Error ", error)
            })
    })

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
                            // likeForm.action = `/like-post/${data.data[i].id}`;
                            // likeForm.method = "POST";
                            likeForm.classList.add("like-unlike-forms");
                            likeForm.dataset.formId = `${data.data[i].id}`
                            normalDivTwo.append(likeForm);

                            // will add csrftoken
                            // const csrfInput = document.createElement("input");
                            // csrfInput.type = "hidden";
                            // csrfInput.name = "csrfmiddlewaretoken";
                            // csrfInput.value = csrftoken;
                            // likeForm.append(csrfInput);

                            // check to see if user already liked or hasn't liked
                            const likeButton = document.createElement("button");
                            likeButton.id = `like-unlike-${data.data[i].id}`;
                            // likeButton.type = "submit";
                            // likeButton.name = "post_id";
                            likeButton.value = `${data.data[i].id}`;
                            likeButton.classList.add("btn", "btn-info");
                            likeButton.textContent = data.data[i].likes ? `Unlike` : `Like`;
                            // if (data.data[i].likes === true) {
                            //     likeButton.classList.add("btn", "btn-danger");
                            //     likeButton.textContent = "Unlike";
                            // } else {
                            //     likeButton.classList.add("btn", "btn-info");
                            //     likeButton.textContent = "Like";
                            // }
                            // if (data.data[i].likes_count) {
                            //     likeForm.textContent = `- ${data.data[i].likes_count} Likes -`;
                            // }
                            likeForm.append(likeButton);
                
                            // likeForm.textContent = "- Likes -";
                            
                            const likeDisplay = document.createElement("p");
                            likeDisplay.classList.add(`render-likes-${data.data[i].id}`)
                            likeDisplay.textContent = `- ${data.data[i].likes_count} Likes -`;
                            // if (data.data[i].likes_count) {
                            //     likeDisplay.textContent = `- ${data.data[i].likes_count} Likes -`;
                            // }
                            likeForm.append(likeDisplay)

                            const normalDivThree = document.createElement("div");
                            cardBodyDiv.append(normalDivThree);

                            const commentForm = document.createElement("form");
                            commentForm.action = `/comments/${data.data[i].id}`
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
                            commentButton.name = "submit_c_form"
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

                        likeUnlikePosts();
                    })
            }
        })
    }

    // likeUnlikePosts()

    // const likeUnlikePosts = (e) => {
    //     const likeUnlikeForms = [...document.getElementsByClassName("like-unlike-form")]
    //     for (let i = 0; i < likeUnlikeForms.length; i++) {
    //         likeUnlikeForms[i].addEventListener("submit", () => {
    //             const getPostValue = 
    //         })
    //     }
    // }
});