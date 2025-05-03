import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '../styles/items.module.css';
import Cart from './cart';
import nearley from 'nearley';
import grammar from '../search';
import { deleteItem, fetchCartItems, addItemToCart } from "../api/cart";
import { fetchData } from '../api/items';

function Items() {
    const [items, setItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartVisible, setCartVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchBarQuery, setSearchBarQuery] = useState("");


    async function handleFetchData() {
        try {
            const data = await fetchData();
            setItems(data);
            setFilteredItems(data);
            setLoading(false);
        } 
        catch (error) {
            console.log(error);
        }
    }

    async function handleFetchCartItems(){
        try {
            const data = await fetchCartItems();
            setCartItems(data);
        }
        catch(error) {
            console.log(error);
        }
    }

    async function handleAddItemToCart(item) {
        try {
            await addItemToCart(item);

        }
        catch (error){
            console.log(error);
        }
    }

    async function handleDeleteItemFromCart(sku) {
        try {
            const cartItemToBeDeletedId = cartItems.filter((item) => item.sku === sku)[0]._id;
            await deleteItem(cartItemToBeDeletedId);
        }
        catch (error){
            console.log(error);
        }
        
    }

    function handleSearch(){
        try{
            const query = searchQuery.trim().toLowerCase();
            const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
            parser.feed(query);
            const parsed = parser.results[0];

            var results = items;
            console.log(parsed);
            if(parsed.type === "sku"){
                results = items.filter((item) => item.sku.toLowerCase().includes(parsed.value.toLowerCase()));
            }
            else if(parsed.type === "itemPrice"){
                const queryItem = parsed.value.item.toLowerCase();
                const queryPrice = parseFloat(parsed.value.price.replace('$', ''), 10);
                if(parsed.margin === "under"){
                    results = items.filter((item) => item.title.toLowerCase().includes(queryItem) && parseFloat(item.price) < queryPrice);
                }
                else{
                    results = items.filter((item) => item.title.toLowerCase().includes(queryItem) && parseFloat(item.price) > queryPrice);
                }

            }
            else if(parsed.type === "price"){
                const queryPrice = parseFloat(parsed.value.replace('$', ''), 10);
                if(parsed.margin === "under"){
                    results = items.filter((item) => parseFloat(item.price) < queryPrice);
                }
                else{
                    results = items.filter((item) => parseFloat(item.price) > queryPrice);
                }
            }
            else{
                results = items.filter((item) => item.title.toLowerCase().includes(parsed.value.toLowerCase()));
            }
            setFilteredItems(results);
        }
        catch(error){
            setFilteredItems(items);
        }
    }

    function handleSearchBar() {
        try {
            const query = searchBarQuery.trim().toLowerCase();
            const results = items.filter((item) => item.sku.toLowerCase().includes(query) || item.title.toLowerCase().includes(query));
            setFilteredItems(results);
        }
        catch (error) {
            setFilteredItems(items);
        }
    }

    function viewCart(){
        setCartVisible(!cartVisible);
    }

    useEffect(async () => {
        handleFetchData();
        handleFetchCartItems();
    }, []);

    if(loading){
        return (
            <h1> Data is Loading </h1>
        )
    }

    return (
        <div className={styles.body}>
            <div>
                <h2 className={styles.heading}> Items </h2>
                <button onClick={viewCart} className={styles.cart}> View Cart </button>
            </div>
            {cartVisible && <Cart 
                cartItems={cartItems}
                setCartItems={setCartItems}
            />}
            <div>
                <input type='text' onChange={(e)=>setSearchBarQuery(e.target.value)} onKeyUp={(e)=>e.key === 'Enter' && handleSearchBar() } 
                className={styles.searchbar} placeholder='Find SKU abc'/>
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.tr}>
                            <th className={styles.th}>Title</th>
                            <th className={styles.th}>SKU</th>
                            <th className={styles.th}>Price</th>
                            <th className={styles.th}>Image</th>
                            <th className={styles.th}> Add/Remove </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map((item) => {
                            const isItemInCart = cartItems.some(cartItem => cartItem.sku === item.sku);
                            return (<tr className={styles.tr}>
                                <td className={styles.td}>{item.title}</td>
                                <td className={styles.td}>{item.sku}</td>
                                <td className={styles.td}>{item.price}</td>
                                <td className={styles.td}><Image className={styles.img}
                                    src={item.image_src}
                                    width={40} 
                                    height={40}/>
                                </td>
                                <td className={styles.td}><button className={styles.button} 
                                onClick={()=> isItemInCart ? handleDeleteItemFromCart(item.sku) : handleAddItemToCart(item)}>
                                    {isItemInCart ? 'Remove' : 'Add To Cart'}</button>
                                </td>
                            </tr>)
                        })}
                    </tbody>
                </table>
            </div>
            <textarea type='text' className={styles.chatInterface} onChange={(e)=>setSearchQuery(e.target.value)} 
            onKeyUp={(e)=>e.key === 'Enter' && handleSearch()} placeholder='Find SKU abc'/>
        </div>
    );
}

export default Items;