export async function fetchData() {
    try {
        const result = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/items`);
        const data = await result.json();
        const finalData = [...data.filter(item => item.sku.length > 0), ...data.filter(item => item.sku.length == 0)]
        return finalData;
    } 
    catch (error) {
        console.log(error);
    }
}
