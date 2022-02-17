import React, { useEffect, useState, useCallback } from 'react'
import './App.css'
import Calendar from './Calendar/Calendar';
import Worker from './Worker/Worker'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Menu from './Menu/Menu';


export default function App() {

  const [tasks, setTasks] = useState(null)
  const [week, setWeek] = useState(0)
  const getTasks = useCallback(() =>{
    fetch(`/api/tasks?week=${week}`)
    .then(res =>{
      if(res.ok){
        res.json()
        .then(tasks =>{
          setTasks(tasks);
          console.log(tasks, new Date());
        })
        .catch(() => {
          setTasks(null);
          console.eror('data is corrupted');
        });
      }
      else{
        res.json()
        .then(err => console.error('could not get the data', err))
        .catch(() => console.error('could not connect to server'));
      }
    });
  }, [week]);

  const removeTask = (category, date, index) =>{
    let filtered = tasks;
    let key = Object.keys(filtered).filter(key => key.endsWith(date.substring(0,2)))[0];
    filtered[key]['tasks'][category].splice(index,1);
    setTasks(filtered);
  };

  const resetData = () =>{
    if(week === 0) return;
    setTasks(null);
    setWeek(0);
  }
  const weekEdit ={
    prev: () => {setTasks(null); setWeek(week - 1)},
    reset: resetData,
    next: () => {setTasks(null); setWeek(week + 1)}
  }


  useEffect(() => {
    getTasks();
    const i =  setInterval(getTasks, 5 * 60 * 1000);
    return() => clearInterval(i);
  }, [getTasks])


  if(!tasks){
    return(
      <div className="container">
        <div className="loader"></div>
      </div>
    )
  }
  else{
    return(
      <Router>
        <Switch>
          <Route path="/" exact><Menu resetData={resetData}/></Route>
          <Route path="/calendar"><Calendar tasks={tasks} week={weekEdit}/></Route>
          <Route path="/category/:category"><Worker tasks={tasks} update={getTasks} removeTask={removeTask}/></Route>
          <Route><Redirect to="/"/></Route>
        </Switch>
      </Router>
    )
  }
}
