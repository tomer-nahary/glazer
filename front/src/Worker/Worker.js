import React, { useEffect, useState } from 'react'
import './Worker.css'
import {useParams, useHistory  } from 'react-router-dom'
import WorkerDay from '../WorkerDay/WorkerDay'

export default function Category(props){
    const [customer, setCustomer] = useState(null);
    const [done, setDone] = useState(false);
    const [doneDits, setDoneDits] = useState(null)
    const doneClick = (projId, category, date, index) =>{
        setDone(true);
        setDoneDits({projId, category, date, index});
    };
    const doneCancel = () =>{
        setDone(false);
        setDoneDits(null);
    };
    const updateProj = ()=>{
        if(!doneDits) return;
        fetch(`/api/task?id=${doneDits['projId']}&category=${doneDits['category']}`,{method:'POST'})
        .then(res =>{
            if(res.ok) doneCancel();
        })
        .catch(err => console.error(err))
        doneCancel();
        props.update();
        props.removeTask(doneDits['category'], doneDits['date'], doneDits['index']);
    }

    const history = useHistory()
    let { category } = useParams();
    let title = {Hituch:'חיתוך', Harkava:'הרכבה', Zeva_in:'צבע', Hatkana:'התקנה'}[category];
    let tasks = props.tasks;
    let keys = Object.keys(tasks);
    return(
        <div>
            {customer && <Customer customer={customer} setCustomer={setCustomer}/>}
            {done &&
                <div className="overlay">
                    <div className="container">
                        <div className="done">
                            <h3>אושר בהצלחה</h3>
                            <div className="ok" onClick={updateProj}>אישור</div>
                            <div className="cancel" onClick={doneCancel}>ביטול</div>
                        </div>
                    </div>
                </div>
            }
            <div className="bar">{title} <div className="back" onClick={() => history.goBack()}></div> </div>
            <div className="center">
                {keys.map(key =>(
                    <WorkerDay key={key} day={tasks[key]} category={category} doneClick={doneClick} setCustomer={setCustomer}/>
                ))}
            </div>
        </div>
    )
}

function Customer(props){
    let id = props.customer;
    const [details, setDetails] = useState({})
    useEffect(() => {
        fetch(`/api/customer?id=${id}`)
        .then(res =>{
            if(res.ok){
                res.json()
                .then(dits => {
                    setDetails(dits);
                });
            }
        })
        .catch(err => console.error(err));
    }, [id])

    return(
        <div className="overlay">
            <div className="container customer">
                <div className="c-head">פרטי לקוח</div>
                <div className="c-details">
                    <div className="c-name c-detail">
                        <div>שם לקוח:</div>
                        <div>{details['Shem_lak']}</div>
                    </div>
                    <div className="c-phone c-detail">
                        <div>מס' טלפון:</div>
                        <div>{details['Tel_nayad']}</div>
                    </div>
                    <div className="c-address c-detail">
                        <div>מקום מגורים:</div>
                    </div>
                    <div className="c-address c-detail">
                        <div>עיר:</div>
                        <div>{details['Ir_lak']}</div>
                        <div>כתובת:</div>
                        <div>{details['Ktovet_lak']}</div>
                    </div>
                    <div className="c-address c-detail">
                        <div>קומה:</div>
                        <div>{details['Koma_lak']}</div>
                        <div>דירה:</div>
                        <div>{details['Mipar_dira_lak']}</div>
                    </div>
                    <div className="c-notes c-detail">
                        <div>הערות:</div>
                    </div>
                    <div className="c-note">
                        <div>{details['Hearot_lak']}</div>
                    </div>
                </div>
                <div className="ok" onClick={() => props.setCustomer(null)}>סגור</div>
            </div>
        </div>
    )
}