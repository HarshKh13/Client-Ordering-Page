import { useState, useEffect } from "react"
import Image from 'next/image';
import styles from '../styles/cart.module.css'
import { deleteItem, fetchCartItems } from "../api/cart";

function Cart({cartItems, setCartItems}){
    const [deletedFromCart, setDeletedFromCart] = useState(false);

    async function handleFetchCartItems(){
        try {
            const data = await fetchCartItems();
            setCartItems(data);
            setDeletedFromCart(false);
        }
        catch(error) {
            console.log(error);
        }
    }

    async function handleDeleteItem(id) {
        try {
            await deleteItem(id);
            setDeletedFromCart(true);
        }
        catch (error){
            console.log(error);
        }
    }

    useEffect(() => {
        handleFetchCartItems();
    }, [deletedFromCart])
    

    return(
        <div className={styles.cart}>
            <h3 className={styles.heading}> Cart </h3>
            <table className={styles.table}>
                <thead>
                <tr className={styles.tr}>
                        <th className={styles.th}>Title</th>
                        <th className={styles.th}>SKU</th>
                        <th className={styles.th}>Price</th>
                        <th className={styles.th}>Image</th>
                        <th className={styles.th}> Remove </th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map((item) => (
                        <tr className={styles.tr}>
                            <td className={styles.td}>{item.title}</td>
                            <td className={styles.td}>{item.sku}</td>
                            <td className={styles.td}>{item.price}</td>
                            <td className={styles.td}><Image 
                                src={item.image_src}
                                width={40} 
                                height={40}/>
                            </td>
                            <td className={styles.td}><button className={styles.button}
                            onClick={() => handleDeleteItem(item._id)}> Remove </button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Cart;