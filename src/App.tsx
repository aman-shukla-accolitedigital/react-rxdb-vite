// @ts-nocheck
import './App.css';

import HeroList from './hero-list/hero-list';
import HeroInsert from './hero-insert/hero-insert';

const App = () => {
    return (
        <div className="container mx-auto pt-4">
            <HeroList/>
            <HeroInsert/>
        </div>
    );
};

export default App;
