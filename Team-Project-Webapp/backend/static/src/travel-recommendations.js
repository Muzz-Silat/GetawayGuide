document.getElementById("travel-form").addEventListener("submit", async (event) => {
    event.preventDefault();
  
    const formData = new FormData(event.target);
    const response = await fetch("/travel-recommendations/", {
      method: "POST",
      body: formData,
    });
  
    const data = await response.json();
    const recommendedCountriesElement = document.getElementById("recommended-countries");
  
    if (data.error) {
      recommendedCountriesElement.innerText = data.error;
    } else {
      recommendedCountriesElement.innerText = data.response;  
      recommendedCountriesElement.style.display = "block";
    }
  });
  