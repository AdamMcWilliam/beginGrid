const scraperAPI = '455b6f9747141efd52d4814122054b7a'; // Replace with your actual Scraper API key
const url = 'https://beginworld.website-us-east-1.linodeobjects.com/wtf.json';

const fetchData = async () => {
    try {
        const response = await fetch(`http://api.scraperapi.com?api_key=${scraperAPI}&url=${url}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
};

// Example usage:
fetchData();