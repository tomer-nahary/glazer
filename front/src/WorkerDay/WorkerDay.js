import React from 'react'
import './WorkerDay.css'
import { Redirect } from 'react-router-dom';

export default function WorkerDay(props) {
    let day = props.day;
    let tasks = day.tasks;
    let category = props.category;
    if(!(category in tasks)){
      return(
        <Redirect to='/'/>
      )
    }
    return (
      <div className="worker-con"> 
          <div className="head">
            <div className="worker-date">{day['date']}</div>
            <div className="worker-day">{day['day']}</div>
          </div>
          {tasks[category].length === 0 &&
            <div className="no-tasks">אין משימות</div>
          }
          <div className="worker-data">
              {tasks[category].map((task, i) =>(
                    <div key={i} className="worker-task">
                        <div className="w-row">
                            <div className="w-proj-id">{task.projId}</div>
                            <div className="w-proj-desc">{task.description}</div>
                        </div>
                        <div className="w-row">
                            <div className="tick" onClick={() => props.doneClick(task.projId, category, day['date'], i)}><div></div></div>
                            <div className="w-proj-customer">{task.customerName}</div>
                            <div className="w-info" onClick={() => props.setCustomer(task.projId)}>פרטי לקוח</div>
                        </div>
                    </div>
                ))}
          </div>
      </div>
    );
}
