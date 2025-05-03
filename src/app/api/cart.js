export async function deleteItem(id){
    const payload = {'id': id}
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cartItems`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        const data = await response.json();
        return data;
    }
    catch(error) {
        console.log(error);
    } 
}

export async function fetchCartItems() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cartItems`, {
            method: 'GET'
        })
        const data = await response.json();
        return data;
    }
    catch(error) {
        console.log(error);
    }
}

export async function addItemToCart(item) {
    const payload = {
        'title': item.title,
        'sku': item.sku,
        'price': item.price,
        'image_src': item.image_src
    }
    try {
        const result = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cartItems`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        const response = await result.json();
        const message = response.message;
        console.log(message);
    }
    catch (error){
        console.log(error);
    }
}