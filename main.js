const containerDoggo = document.querySelector(".container-doggo"); 
// Selects the container-doggo element to hold dog images.

let count = parseInt(localStorage.getItem("count")) || 0; 
// Retrieves the count from localStorage or initializes it to 0.

let isLiked = false;

function createDoggoDiv(dogImage, count) { 
    // Function to create a new div for displaying a doggo.
    const div = document.createElement("div"); 
    // Creates a new div element.
    div.className = "container-image"; 
    // Sets the class name for styling.

    div.innerHTML = ` 
        <div><img src="${dogImage}" alt="" class="dog-image"></div>
        <div class="dog-user">
            <img src="${dogImage}" class="profile-pic" alt="">
            <p>Doggo ${count}</p>
        </div>
        <div class="container-comment"></div>
        <div class="container-actions">
            <button class="like-btn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="fill: rgba(255, 255, 255, 1);transform: ;msFilter:;"><path d="M12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412l7.332 7.332c.17.299.498.492.875.492a.99.99 0 0 0 .792-.409l7.415-7.415c2.354-2.354 2.354-6.049-.002-8.416a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595zm6.791 1.61c1.563 1.571 1.564 4.025.002 5.588L12 18.586l-6.793-6.793c-1.562-1.563-1.561-4.017-.002-5.584.76-.756 1.754-1.172 2.799-1.172s2.035.416 2.789 1.17l.5.5a.999.999 0 0 0 1.414 0l.5-.5c1.512-1.509 4.074-1.505 5.584-.002z"></path></svg></button>
            <input type="text" class="textBox" placeholder="Add comment...">
            <div class="message-container">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="fill: rgba(255, 255, 255, 1);transform: ;msFilter:;"><circle cx="9.5" cy="9.5" r="1.5"></circle><circle cx="14.5" cy="9.5" r="1.5"></circle><path d="M12 2C6.486 2 2 5.589 2 10c0 2.908 1.897 5.515 5 6.934V22l5.34-4.004C17.697 17.852 22 14.32 22 10c0-4.411-4.486-8-10-8zm0 14h-.333L9 18v-2.417l-.641-.247C5.671 14.301 4 12.256 4 10c0-3.309 3.589-6 8-6s8 2.691 8 6-3.589 6-8 6z"></path></svg>
                
                <span class="comment-count">0</span> <!-- This will hold the comment count -->
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="fill: rgba(255, 255, 255, 1);transform: ;msFilter:;"><path d="m12 16 4-5h-3V4h-2v7H8z"></path><path d="M20 18H4v-7H2v7c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-7h-2v7z"></path></svg>
        </div>`;
    // Sets the inner HTML of the div with dog image and comment input.
    

    return div; 
    // Returns the created div.
}

async function fetchData() {
    try {
        count++;
        const response = await fetch("https://dog.ceo/api/breeds/image/random");

        if (!response.ok) {
            throw new Error("Failure to fetch data");
        }

        const data = await response.json();
        let doggos = JSON.parse(localStorage.getItem("doggos")) || [];

        doggos.push({
            image: data.message,
            count: count,
            comments: []
        });

        localStorage.setItem("doggos", JSON.stringify(doggos));
        const div = createDoggoDiv(data.message, count);
        containerDoggo.prepend(div);

        const likeBtn = div.querySelector(".like-btn");
        toggleLike(likeBtn); // Pass the button to toggleLike

        attachInputListener(div, doggos.length - 1);
    } catch (error) {
        console.log(error);
    }
}


function loadExistingDoggos() {
    const doggos = JSON.parse(localStorage.getItem("doggos")) || [];

    doggos.forEach((doggo, index) => {
        const div = createDoggoDiv(doggo.image, doggo.count);
        containerDoggo.prepend(div);

        const commentCountSpan = div.querySelector(".comment-count");
        commentCountSpan.textContent = doggo.comments.length;

        attachInputListener(div, index);
        doggo.comments.forEach(comment => {
            addUserComment(div, comment);
        });

        const likeBtn = div.querySelector(".like-btn");
        toggleLike(likeBtn); // Set like state on page load
    });

    count = doggos.length; 
}



function attachInputListener(div, doggoIndex) { 
    // Function to attach input listener for comment input.
    const userInput = div.querySelector(".textBox"); 
    // Selects the input field for comments.
    const commentCountSpan = div.querySelector(".comment-count"); 
    // Selects the span that displays the comment count.

    if (userInput) { 
        // Checks if the input exists.
        userInput.addEventListener("keydown", (event) => { 
            // Adds an event listener for keydown events on the input.
            if (event.key === "Enter") { 
                // Checks if the pressed key is Enter.
                const comment = userInput.value; 
                // Gets the comment text from the input.
                addUserComment(div, comment);
                // Adds comment input by user.
                userInput.value = ""; 
                // Clears the input field.

                // Update comments in localStorage
                let doggos = JSON.parse(localStorage.getItem("doggos")) || []; 
                // Retrieves the doggos from localStorage.
                
                if (doggoIndex !== undefined && doggos[doggoIndex]) { 
                    // Checks if the index is valid.
                    doggos[doggoIndex].comments.push(comment); 
                    // Adds the new comment to the correct doggo's comments.
                    localStorage.setItem("doggos", JSON.stringify(doggos)); 
                    // Saves the updated doggos array to localStorage.

                    // Update the comment count display
                    commentCountSpan.textContent = doggos[doggoIndex].comments.length; 
                    // Updates the displayed comment count.
                } else {
                    console.error("Doggo not found at index:", doggoIndex); 
                    // Logs an error if the doggo index is not found.
                }

                // Scroll to the bottom of the comment section
                const commentBox = div.querySelector(".container-comment"); 
                // Selects the comment box.
                commentBox.scrollTop = commentBox.scrollHeight; 
                // Scrolls to the bottom of the comment box.
            }
        });
    }
}

function addUserComment(div, comment) {
    const p = document.createElement("p"); 
    // Creates a new paragraph for the comment.
    p.innerHTML = `<div><span class="span-user">User-201971690:</span> <span class="span-comment">${comment}</span></div> <span class="span-time">${getTime()}</span>`; 
    // Sets the inner HTML of the paragraph with comment info.
    div.querySelector(".container-comment").appendChild(p); 
    // Appends the comment to the comment s                                                                                                                                                         ection.
}

function toggleLike(likeBtn) {
    isLiked = localStorage.getItem("isLiked") === "true";

    if (isLiked) {
        likeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="fill: rgba(255, 255, 255, 1);"><path d="M20.205 4.791a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412L12 21.414l8.207-8.207c2.354-2.353 2.355-6.049-.002-8.416z"></path></svg>`;
    } else {
        likeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="fill: rgba(255, 255, 255, 1);"><path d="M12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412l7.332 7.332c.17.299.498.492.875.492a.99.99 0 0 0 .792-.409l7.415-7.415c2.354-2.354 2.354-6.049-.002-8.416a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595zm6.791 1.61c1.563 1.571 1.564 4.025.002 5.588L12 18.586l-6.793-6.793c-1.562-1.563-1.561-4.017-.002-5.584.76-.756 1.754-1.172 2.799-1.172s2.035.416 2.789 1.17l.5.5a.999.999 0 0 0 1.414 0l.5-.5c1.512-1.509 4.074-1.505 5.584-.002z"></path></svg>`;
    }

    likeBtn.onclick = function() {
        isLiked = !isLiked; // Toggle the like state
        localStorage.setItem("isLiked", isLiked); // Save the new state

        toggleLike(likeBtn); // Update the button appearance
    };
}


function getTime() { 
    // Function to get the current time.
    let date = new Date().toLocaleString();
    console.log(date); 
    // Gets the current date and time as a string.
    meridian = date.slice(-2) 
    // Extracts the AM/PM part from the date string.
    date = date.slice(0,17); 
    // Trims the date string to a specific format.

    return `${date}${meridian}` 
    // Returns the formatted date and time.
}

// Call loadExistingDoggos when the window loads
window.onload = loadExistingDoggos; 
// Executes the loadExistingDoggos function on page load.

