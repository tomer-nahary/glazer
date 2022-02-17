import React, { useEffect } from 'react'
import './Menu.css'
import { Link } from 'react-router-dom'

export default function Menu(props) {
    useEffect(() => {
        props.resetData();
    }, [props])
    return(
        <div className="menu container">
            <h3>בחר תחנה</h3>
            <Link to="/category/Hituch">חיתוך</Link>
            <Link to="/category/Harkava">הרכבה</Link>
            <Link to="/category/Zeva_in">צבע</Link>
            <Link to="/category/Hatkana">התקנה</Link>
            <Link to="/calendar" className="l-table">תוכנית שבועית</Link>
        </div>
    )
}
