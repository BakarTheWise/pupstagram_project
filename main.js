

async function fetchData() {
    
    try {
        const response = await fetch("https://dog.ceo/api/breeds/image/random");
        if (!response.ok) {
            throw new Error("Failure to fetch data")
        }

        const data = await response.json();
        console.log(data);

        const img = document.createElement("img");
        img.src = data.message;
        document.querySelector(".container").appendChild(img)

        

    } catch (error) {
        console.log(error);
    }
}

fetchData();