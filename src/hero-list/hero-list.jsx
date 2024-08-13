import React, { Component, useEffect, useState } from 'react';
import * as Database from '../Database';
import './hero-list.css';

const HeroList = () => {
    const [heroData, setHeroData] = useState({
        heroes: null,
        loading: true,
        editableName: false,
        heroList: null,
        subs: []
    }
    );

    useEffect(()=> {
        const fetchData = async () => {

            const db = await Database.get();

            const sub = db.heroes.find({
                selector: {},
                sort: [
                    { name: 'asc' }
                ]
            }).$.subscribe(heroes => {
                if (!heroes) {
                    return;
                }
                console.log('reload heroes-list ');
                console.dir(heroes);
                setHeroData({
                    ...heroData,
                    heroes,
                    loading: false,
                    heroList: JSON.parse(JSON.stringify(heroes))
                });
            });
            setHeroData({
                ...heroData,
                subs: heroData.subs.push(sub)
            })
        }
        fetchData();
        return () => {
            heroData.subs.forEach(sub => sub.unsubscribe());
            setHeroData({
                ...heroData,
                subs: []
            })
        }
      
    },[]);

    const deleteHero = async (hero) => {
        await hero.remove();
    }

    const editHero = async (hero) => {
        await hero.patch({
            isEditable: true
        });
    }
    const saveHero = async (hero, heroDoc) => {
        const {name, city} = hero
        await heroDoc.patch(
            {
                name,
                city,
                isEditable: false
            }
        );
    }
    const onClickHandler = async ( input, event )=> {
        let {heroList} = heroData;
        heroList.find((item, index) => {
            if(item._meta.lwt === input.hero._meta.lwt){
                if(input.type === 'city'){
                    heroList[index].city = event.currentTarget.value;
                }
            }
        })
        setHeroData({
            ...heroData,
            heroList});
    }
    const search = async (event) => {
        const value = event?.currentTarget?.value;

        const db = await Database.get();

        const sub = db.heroes.find({
            selector: {
                name: {
                    $regex: '.*'+value+'.*'
                }
            },
            sort: [
                { name: 'asc' }
            ]
        }).$.subscribe(heroes => {
            if (!heroes) {
                return;
            }
            console.log('reload heroes-list ');
            console.dir(heroes);
            heroData({
                ...heroData,
                heroes,
                loading: false,
                heroList: JSON.parse(JSON.stringify(heroes))
            });
        });
    }
    const {heroes =[], heroList, loading } = heroData;
    return (
    <div>
        <div id="list-box" className="box">
        {heroes?.length > 0 && <div className=' text-center'>
            <input type='text' name='search' placeholder='Search by name' onChange={(event) => search(event)}>
            </input>
        </div>}
            <div className='pt-4'>
                <h3>Heroes</h3>
                {loading && <span>Loading...</span>}
                {!loading && heroes?.length === 0 && <span>No heroes</span>}
                {!loading &&
                    <ul id="heroes-list">
                        {heroList?.map((hero, index) => {
                            return (
                                <li key={hero.name}  className='flex m-auto'>
                                    <img className="imageUrl-box" src={hero.imageUrl}/>
                                    <div>
                                        
                                        <input type="text"  onChange={(event) => onClickHandler({type: 'name', hero}, event )} value={hero.name}  placeholder='Name' disabled={ true}>
                                        </input>
                                        <input type="text"  onChange={(event) => onClickHandler({type: 'city', hero}, event)} value={hero.city}  placeholder='city' disabled={hero.isEditable ? false: true}>
                                        </input>
                                        <div className="actions">
                                            <i className="fa fa-pencil-square-o" aria-hidden="true" onClick={() => { !hero.isEditable ? editHero(heroes[index]) : saveHero(hero, heroes[index])}}>{hero.isEditable ? 'APPLY': 'EDIT'}</i>
                                            <span className="delete fa fa-trash-o" aria-hidden="true" onClick={() => deleteHero(heroes[index])}>DELETE</span>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                }
            </div>
        </div>
</div>
);
}

export default HeroList;

