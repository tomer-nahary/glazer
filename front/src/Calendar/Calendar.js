import React from 'react'
import TableDay from '../TableDay/TableDay'
import './Calendar.css'

export default function Table(props) {
    let tasks = props.tasks;
    let taskDates = Object.keys(tasks);
    return (
      <div className="container">
        <div className="table">
          <div className="column">
            <div className="cell">
              <div className="logo"></div>
              <div className="actions">
                <div className="prev" onClick={props.week.prev}></div>
                <div className="reset" onClick={props.week.reset}></div>
                <div className="next" onClick={props.week.next}></div>
              </div>
            </div>
            <div className="cell title">הערות</div>
            <div className="cell title">פירוק</div>
            <div className="cell title">חיתוך</div>
            <div className="cell title">הרכבה</div>
            <div className="cell title">צבע</div>
            <div className="cell title">התקנה</div>
          </div>
          {taskDates.map(key =>(
            <TableDay key={key} day={tasks[key]}/>
            ))}
        </div>
      </div>
    )
}
