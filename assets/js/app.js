// get all elements into declarations

const search = document.getElementById("search");
const addBtn1 = document.getElementById("addBtn1");
const modalForm = document.querySelector(".modalForm");
const addMovie = document.querySelector(".addMovie");
const addBtnModalForm = document.getElementById("addBtnModalForm");
const cancelBtnModalForm = document.getElementById("cancelBtnModalForm");
const updateBtnModalForm = document.getElementById("updateBtnModalForm");
const closeIcon = document.querySelector(".modalHeading > i");
const titleInput = document.getElementById("title");
const posterPathInput = document.getElementById("poster");
const ratingInput = document.getElementById("rating");
const reviewInput = document.getElementById("review");
const movieCards = document.querySelector(".movieCards");

const api_url = 'http://localhost:3000/posts';


// functions
// api call

async function makeApiCall(url, method_name, body){
    let response = await fetch(url, {
        method: method_name,
        body: JSON.stringify(body),
        headers: {
            "content-type" : "application/json; charset=UTF-8"
        }
    })
    return response.json();
}


// 'search' input event callback 
const searchEventHandler = (e) => {
    let searchVal = (e.target.value).toLowerCase().trim();

    // -----------option-1-------------
    // let search_url = `${api_url}?title=${searchVal}`;
    // if(!searchVal){
    //     makeApiCall(api_url, "GET")
    //     .then(data => templating(data));
    // }else{
    //     makeApiCall(search_url, "GET")
    //     .then(data => templating(data));
    // }

    // -----------option-2-------------
    makeApiCall(api_url, "GET")
        .then(data => {
            let arr = data.filter(movie => movie.title.includes(searchVal));
            templating(arr);
        })
        .catch(err => console.log(err));
}

// interaction 'add movie' btn event callback
const addBtn1ClickEvent = () => {
    modalForm.classList.remove("d-none");
}
// 'modalForm' closing- (cross icon & cancel btn) event callback
const closeEventHandler = (e) => {
        modalForm.classList.add("d-none");
}
// 'outside modal form' click event callback
const closeEventHandler2 = (e) => {
    if(!addMovie.contains(e.target)){
        modalForm.classList.add("d-none");
    }
}

// add movie form submit event callback
const addMovieEventHandler = (e) => {
    e.preventDefault();
    let obj = {
        title : (titleInput.value).toLowerCase(),
        posterPath : posterPathInput.value,
        rating : ratingInput.value,
        review : reviewInput.value
    }
    
    makeApiCall(api_url, "POST", obj)
        .then(data => templating(data))
        .catch(err => console.log(err));
    
    modalForm.classList.add("d-none");
    e.target.reset();
}

// html card templating 
function templating(arr){
    let final = '';
    arr.forEach(ele => {
        final += `
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body">
                            <figure class="posters">
                                <img src= "${ele.posterPath}" class="img-fluid" alt="${ele.title}">
                                <figcaption>
                                    <h4 class="title">${ele.title}</h4>
                                    <span class="rating">${ele.rating} / 5</span>
                                </figcaption>
                                <div class="review">
                                    <h5>Review</h5>
                                    <p>${ele.review}</p>
                                </div>
                            </figure>
                            <button class="btn btn-success" data-id="${ele.id}" onclick = "editEventHandler(this)" id="editBtn">Edit</button>
                            <button class="btn btn-danger" data-id="${ele.id}" onclick = "deleteEventHandler(this)" id="deleteBtn">Delete</button>
                        </div>
                    </div>
                </div>
                `;
    })
    movieCards.innerHTML = final;
}

// edit button- click event callback
const editEventHandler = (e) => {
    let edit_id = e.dataset.id;
    localStorage.setItem("editId", edit_id);

    let edit_url = `${api_url}/${edit_id}`;
    
    makeApiCall(edit_url, "GET")
        .then(data => {
            titleInput.value = data.title;
            posterPathInput.value = data.posterPath;
            ratingInput.value = data.rating;
            reviewInput.value = data.review;
        })
        .catch(err => alert(err));
    
    updateBtnModalForm.classList.remove("d-none");
    addBtnModalForm.classList.add("d-none");
    modalForm.classList.remove("d-none");
}
// delete button- click event callback
const deleteEventHandler = (e) => {
    let delete_id = e.dataset.id;
    let delete_url = `${api_url}/${delete_id}`;

    makeApiCall(delete_url, "DELETE")
        .catch(err => console.log(err));
}
// update movie- click event callback
const updateEventHandler = (e) => {
    // console.log(e.target);
    let update_id = localStorage.getItem("editId");
    let update_url = `${api_url}/${update_id}`;
    let updated_obj ={};
    updated_obj.title = (titleInput.value).toLowerCase();
    updated_obj.posterPath = posterPathInput.value;
    updated_obj.rating = ratingInput.value;
    updated_obj.review = reviewInput.value;

    makeApiCall(update_url, "PATCH", updated_obj)
        .catch(err => console.log(err));

    modalForm.classList.add("d-none");
    updateBtnModalForm.classList.add("d-none");
    addBtnModalForm.classList.remove("d-none");
}




// to make the default "GET" call

makeApiCall(api_url, "GET")
    .then(data => {
        templating(data);
        addMovie.reset();
        search.value = '';
    })
    .catch(err => alert(err));


// events

search.addEventListener("keyup", searchEventHandler)
addBtn1.addEventListener("click", addBtn1ClickEvent);
addMovie.addEventListener("submit", addMovieEventHandler);
cancelBtnModalForm.addEventListener("click", closeEventHandler);
updateBtnModalForm.addEventListener("click", updateEventHandler);
closeIcon.addEventListener("click", closeEventHandler);
modalForm.addEventListener("click", closeEventHandler2);