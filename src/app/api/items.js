export async function fetchData() {
    try {
        const result = await fetch(`${process.env.BASE_URL}/api/items`);
        const data = await result.json();
        return data;
    } 
    catch (error) {
        console.log(error);
    }
}
