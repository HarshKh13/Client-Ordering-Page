export async function fetchData() {
    try {
        const result = await fetch('http://localhost:8000/api/items');
        const data = await result.json();
        return data;
    } 
    catch (error) {
        console.log(error);
    }
}
