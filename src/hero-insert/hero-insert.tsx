// @ts-nocheck
import React, {  useState } from 'react';
import * as Database from '../Database';


const HeroInsert: React.FC<{}> = () => {
    const [heroData, setHeroData] = useState({
        name: '',
        imageUrl: '',
        city: ''
    }
    );
    const addHero = async (event) => {
        event.preventDefault();
        const { name, imageUrl, city } = heroData;
        const db = await Database.get();

        const addData = {
            name,
            imageUrl,
            city
        };
        await db.heroes.insert(addData);
        setHeroData({
            ...heroData,
            name: '',
            imageUrl: '',
            city: ''
        });
    }
    const handleNameChange = (event) => {
        setHeroData({
            ...heroData,
            name: event.target.value
        });
    }
    const handleImageUrlChange = (event) => {
        setHeroData({
            ...heroData,
            imageUrl: event.target.value
        });
    }
    const handleCityChange = (event) => {
        setHeroData({
            ...heroData,
            city: event.target.value
        });
    }

    return (
        <div id="insert-box" className="box max-w-96">
            <h3 className='text-center'>Add Hero</h3>
            <div className='flex flex-col text-center items-center'>
                <input name="name" className='w-full max-w-96 p-2' type="text" placeholder="Name"  value={heroData.name} onChange={handleNameChange} />
                <input name="imageUrl" className='w-full max-w-96 p-2' type="text" placeholder="Image Url" value={heroData.imageUrl} onChange={handleImageUrlChange} />
                <input name="city" className='w-full max-w-96 p-2' type="text" placeholder="City" value={heroData.city} onChange={handleCityChange} />
                <button className='w-full max-w-96 p-2' onClick={addHero} type="submit">Insert a Hero</button>
            </div>
        </div>
    );
}
export default HeroInsert;
