import React from 'react'
import Hero from "../Components/Hero"
import LatestCollection from "../Components/LatestCollection"
import BestSeller from '../Components/BestSeller'
import OurPolicy from '../Components/OurPolicy'
import NewLetterBox from '../Components/NewLetterBox'

const Home = () => {  
  return (
    <div>
      <Hero/>
      <LatestCollection/>
      <BestSeller/>
      <OurPolicy/>
      <NewLetterBox/>
    </div>
  )
}

export default Home