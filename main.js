const container = document.querySelector(".container"); 
// Selects the container element to hold dog images.

let count = parseInt(localStorage.getItem("count")) || 0; 
// Retrieves the count from localStorage or initializes it to 0.

function createDoggoDiv(dogImage, count) { 
    // Function to create a new div for displaying a doggo.
    const div = document.createElement("div"); 
    // Creates a new div element.
    div.className = "container-image"; 
    // Sets the class name for styling.

    div.innerHTML = ` 
        <div class="dog-user">
            <img src="${dogImage}" class="profile-pic" alt="">
            <p>Doggo ${count}</p>
        </div>
        <img src="${dogImage}" alt="">
        <div class="container-icon">
            <img src="heart.svg" alt="" class="icon">
            <div class="message-container">
                <img src="message-circle.svg" alt="" class="icon">
                <span class="comment-count">0</span> <!-- This will hold the comment count -->
            </div>
        </div>
        <div class="container-comment"></div>
        <input type="text" class="textBox" placeholder="Add comment">`;
    // Sets the inner HTML of the div with dog image and comment input.

    return div; 
    // Returns the created div.
}

async function fetchData() { 
    // Asynchronous function to fetch random dog images.
    try {
        count++; 
        // Increments the count for each new fetch.
        const response = await fetch("https://dog.ceo/api/breeds/image/random"); 
        // Fetches a random dog image from the API.

        if (!response.ok) { 
            // Checks if the fetch was successful.
            throw new Error("Failure to fetch data"); 
            // Throws an error if the response is not OK.
        }

        const data = await response.json(); 
        // Parses the response as JSON.

        let doggos = JSON.parse(localStorage.getItem("doggos")) || []; 
        // Retrieves existing doggos from localStorage or initializes an empty array.

        doggos.push({ 
            // Adds a new doggo object to the array.
            image: data.message, 
            count: count, 
            comments: [] // Initializes an empty comments array.
        });

        localStorage.setItem("doggos", JSON.stringify(doggos)); 
        // Saves the updated doggos array to localStorage.

        const div = createDoggoDiv(data.message, count); 
        // Creates a div for the new doggo using the fetched image.
        container.appendChild(div); 
        // Appends the new doggo div to the container.

        attachInputListener(div, doggos.length - 1); 
        // Attaches input listener for comments to the new doggo div.

    } catch (error) {
        console.log(error); 
        // Logs any errors that occur during fetching.
    }
}

function loadExistingDoggos() { 
    // Function to load existing doggos from localStorage.
    const doggos = JSON.parse(localStorage.getItem("doggos")) || []; 
    // Retrieves existing doggos or initializes an empty array.
    
    doggos.forEach((doggo, index) => { 
        // Loops through each doggo object.
        const div = createDoggoDiv(doggo.image, doggo.count); 
        // Creates a div for each existing doggo.
        container.appendChild(div); 
        // Appends the doggo div to the container.

        attachInputListener(div, index); 
        // Attaches input listener for comments to each doggo div.

        // Load existing comments
        doggo.comments.forEach(comment => { 
            // Loops through each comment for the doggo.
            const p = document.createElement("p"); 
            // Creates a new paragraph for the comment.
            p.innerHTML = `<span>User-201971690:</span> <span>${comment}</span> <span>${getTime()}</span>`; 
            // Sets the inner HTML of the paragraph with comment info.
            div.querySelector(".container-comment").appendChild(p); 
            // Appends the comment to the comment section of the doggo.
        });
    });

    count = doggos.length; 
    // Updates the count based on the number of existing doggos.
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
                const p = document.createElement("p"); 
                // Creates a new paragraph for the comment.
                p.innerHTML = `<span>User-201971690:</span> <span>${comment}</span> <span>${getTime()}</span>`; 
                // Sets the inner HTML of the paragraph with comment info.
                div.querySelector(".container-comment").appendChild(p); 
                // Appends the comment to the comment section.
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

function getTime() { 
    // Function to get the current time.
    let date = new Date().toLocaleString(); 
    // Gets the current date and time as a string.
    meridian = date.slice(-2) 
    // Extracts the AM/PM part from the date string.
    date = date.slice(0,16); 
    // Trims the date string to a specific format.

    return `${date}${meridian}` 
    // Returns the formatted date and time.
}

// Call loadExistingDoggos when the window loads
window.onload = loadExistingDoggos; 
// Executes the loadExistingDoggos function on page load.
