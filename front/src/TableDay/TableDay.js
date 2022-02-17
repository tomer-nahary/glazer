import React from 'react';

export default function TableDay(props) {
    let day = props.day;
    let tasks = props.day.tasks;
    let taskKyes = Object.keys(tasks);
    return (
        <div className="column">
            <div className="cell title">
                <div className="day">{day['day']}</div>
                <div className="date">{day['date']}</div>
            </div>
            <div className="cell remark">
                <div>{day['remark']}</div>
            </div>
            {taskKyes.map(key =>(
                <div key={key} className="cell">
                    {(key === 'Hatkana')
                        ?<Hatkana tasks={tasks[key]}/>
                        :<>
                            {tasks[key].map((task, i) =>(
                                <div key={i} className="row">
                                    <div className="proj-id">{task['projId']}-</div>
                                    <div className="worker-name">{task['worker'] ? task['worker'] + '- ' : ''}</div>
                                    <div className="customer-name">{task['customerName'].substring(0, 13)}</div>
                                </div>
                            ))}
                        </>
                    }
                </div>
            ))}
        </div>
    )
}

function Hatkana(props){
    let tasks = props.tasks;
    let customers = {};
    for(let task of tasks){
        customers[task['customerName']] = task['worker'];
    }
    return(
        <>
            {Object.keys(customers).map((customer) =>(
                <div key={customer} className="row">
                    <div className="worker-name">{customers[customer] ? customers[customer] + '- ' : ''}</div>
                    <div className="customer-name">{customer}</div>
                </div>
            ))}
        </>
    )
}

/*
function Hatkana(props){
    let tasks = props.tasks;
    let customers = [];
    for(let task of tasks){
        customers.push(task['customerName']);
    }
    customers = [...new Set(customers)];
    return(
        <>
            {customers.map((customer, i) =>(
                <div key={i} className="row">
                    <div className="customer-name">{customer}</div>
                </div>
            ))}
        </>
    )
}
 */