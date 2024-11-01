import React, { useEffect, useState } from 'react'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import ProductDetails from '../components/Products/ProductDetails'
import { useParams } from 'react-router-dom'
import { productData } from '../static/data'
import SuggestedProducts from '../components/Products/SuggestedProducts'
const ProductDetailsPage = () => {
    const {name} = useParams();
    const [data, setData] = useState(null);
    console.log(name);
    
    const productName = name.replace(/-/g, ' ');
    useEffect(() => {
        const data = productData.find((i) => i.name === productName);
        setData(data);
    }, []);
  return (
    <div>
      <Header />
      <ProductDetails data={data}/>
      {
        data && <SuggestedProducts data={data} />
      }
      <Footer />
    </div>
  )
}

export default ProductDetailsPage
