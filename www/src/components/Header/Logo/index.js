import React from 'react';
import { Link } from 'react-router-dom';
import style from './style.scss';

const Logo = () => {
    return (
        <div className={style.logo}>
            <Link to='/'>
                <img src='/static/logo.png' />
            </Link>
        </div>
    );
}

export default Logo;