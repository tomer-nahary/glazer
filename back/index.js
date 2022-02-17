const express = require('express');
const cors = require('cors');
const ADODB = require('node-adodb');

const app = express();
app.use(cors());
// const con = ADODB.open('Provider=Microsoft.ACE.OLEDB.12.0;Data Source=\\\\DROR\\H_Nahary\\תומר\\Glazer-ver4.accdb;Persist Security Info=False;');
const file = 'C:\\Users\\Tomer\\Desktop\\temp\\Glazer-App.accdb';
// const provider = 'Microsoft.ACE.OLEDB.12.0';
const provider = 'Microsoft.ACE.OLEDB.12.0';
// const provider = 'Microsoft.Jet.OLEDB.4.0';
const con = ADODB.open(`Provider=${provider};Data Source=${file};Persist Security Info=False;`, true);

function getWeek(weekIndex){
    let week = {}, start, end;
    let tasks = JSON.stringify({'Peruk_Hazmanot': [], 'Hituch': [], 'Harkava': [], 'Zeva_in': [], 'Hatkana': []});
    let days = ['ראשון','שני','שלישי','רביעי','חמישי','שישי'];
    const accessFormat = (date) => `${(date.getMonth() + 1).toString().padStart(2,'0')}/${(date.getDate()).toString().padStart(2,'0')}/${date.getFullYear()}`;
    const format = (date) => `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2,'0')}-${(date.getDate()).toString().padStart(2,'0')}`;
    const userFormat = (date) => `${(date.getDate()).toString().padStart(2,'0')}.${(date.getMonth() + 1).toString().padStart(2,'0')}`;
    
    let date = new Date();
    date.setDate(date.getDate() - date.getDay() + (weekIndex * 7));
    /* let isSaturday = date.getDay() == 6;
    date.setDate(date.getDate() - date.getDay() + (isSaturday ? 7 : 0)); */
    for (let i = 0; i < 6; i++) {
        week[format(date)] = {day: days[date.getDay()],'date': userFormat(date),'remark': '', 'tasks': JSON.parse(tasks)};
        date = new Date(date.setDate(date.getDate() + 1));
    }
    start = accessFormat(new Date(Object.keys(week)[0]))
    end = accessFormat(new Date(Object.keys(week)[5]))
    return [start, end, week, Object.keys(JSON.parse(tasks))];
}

async function getTasks(weekIndex){
    let [start, end, week, tasks] = getWeek(weekIndex);
    let query = `SELECT Projects.Proj_Mispar, Customer.Shem_lak, Projects.Proj_Teur, Projects.Worker_Peruk, Projects.Worker_Hituch, Projects.Worker_Harkava, Projects.Worker_Zeva, Projects.Worker_Hatkana, IIf((([Projects].[Proj_Hituch_tich]) Is Not Null) And (([Projects].[Proj_Hituch_tich]) Between #${start}# And #${end}#) And (([Projects].[Proj_Hituch_Biz]) Is Null),Format([Projects].[Proj_Hituch_tich],"yyyy-mm-dd"),Null) AS Hituch, IIf((([Projects].[Proj_Harkava_tich]) Is Not Null) And (([Projects].[Proj_Harkava_tich]) Between #${start}# And #${end}#) And (([Projects].[Proj_Harkava_Biz]) Is Null),Format([Projects].[Proj_Harkava_tich],"yyyy-mm-dd"),Null) AS Harkava, IIf((([Projects].[Proj_Zeva_in_tich]) Is Not Null) And (([Projects].[Proj_Zeva_in_tich]) Between #${start}# And #${end}#) And (([Projects].[Proj_Zeva_in_Biz]) Is Null),Format([Projects].[Proj_Zeva_in_tich],"yyyy-mm-dd"),Null) AS Zeva_in, IIf((([Projects].[Proj_Peruk_Hazmanot_tich]) Is Not Null) And (([Projects].[Proj_Peruk_Hazmanot_tich]) Between #${start}# And #${end}#) And (([Projects].[Proj_Peruk_Hazmanot_Biz]) Is Null),Format([Projects].[Proj_Peruk_Hazmanot_tich],"yyyy-mm-dd"),Null) AS Peruk_Hazmanot, IIf((([Projects].[Proj_Hatkana_Biz]) Is Not Null) And (([Projects].[Proj_Hatkana_Biz]) Between #${start}# And #${end}#) And (([Projects].[Proj_Hatkana_tich]) Is Null),Format([Projects].[Proj_Hatkana_Biz],"yyyy-mm-dd"),Null) AS Hatkana, Projects.Proj_Status FROM Customer INNER JOIN Projects ON Customer.Kod_Lak = Projects.Proj_Mis_lak WHERE (((IIf((([Projects].[Proj_Hituch_tich]) Is Not Null) And (([Projects].[Proj_Hituch_tich]) Between #${start}# And #${end}#) And (([Projects].[Proj_Hituch_Biz]) Is Null),Format([Projects].[Proj_Hituch_tich],"yyyy-mm-dd"),Null)) Is Not Null) AND ((Projects.Proj_Status)<>"הסתיים")) OR (((IIf((([Projects].[Proj_Harkava_tich]) Is Not Null) And (([Projects].[Proj_Harkava_tich]) Between #${start}# And #${end}#) And (([Projects].[Proj_Harkava_Biz]) Is Null),Format([Projects].[Proj_Harkava_tich],"yyyy-mm-dd"),Null)) Is Not Null) AND ((Projects.Proj_Status)<>"הסתיים")) OR (((IIf((([Projects].[Proj_Zeva_in_tich]) Is Not Null) And (([Projects].[Proj_Zeva_in_tich]) Between #${start}# And #${end}#) And (([Projects].[Proj_Zeva_in_Biz]) Is Null),Format([Projects].[Proj_Zeva_in_tich],"yyyy-mm-dd"),Null)) Is Not Null) AND ((Projects.Proj_Status)<>"הסתיים")) OR (((IIf((([Projects].[Proj_Peruk_Hazmanot_tich]) Is Not Null) And (([Projects].[Proj_Peruk_Hazmanot_tich]) Between #${start}# And #${end}#) And (([Projects].[Proj_Peruk_Hazmanot_Biz]) Is Null),Format([Projects].[Proj_Peruk_Hazmanot_tich],"yyyy-mm-dd"),Null)) Is Not Null) AND ((Projects.Proj_Status)<>"הסתיים")) OR (((IIf((([Projects].[Proj_Hatkana_Biz]) Is Not Null) And (([Projects].[Proj_Hatkana_Biz]) Between #${start}# And #${end}#) And (([Projects].[Proj_Hatkana_tich]) Is Null),Format([Projects].[Proj_Hatkana_Biz],"yyyy-mm-dd"),Null)) Is Not Null) AND ((Projects.Proj_Status)<>"הסתיים"));`
    //let query = `SELECT Projects.Proj_Mispar, Customer.Shem_lak, Projects.Proj_Teur, IIf((([Projects].[Proj_Hituch_tich]) Is Not Null) And (([Projects].[Proj_Hituch_tich]) Between #${start}# And #${end}#) And (([Projects].[Proj_Hituch_Biz]) Is Null),Format([Projects].[Proj_Hituch_tich],"yyyy-mm-dd"),Null) AS Hituch, IIf((([Projects].[Proj_Harkava_tich]) Is Not Null) And (([Projects].[Proj_Harkava_tich]) Between #${start}# And #${end}#) And (([Projects].[Proj_Harkava_Biz]) Is Null),Format([Projects].[Proj_Harkava_tich],"yyyy-mm-dd"),Null) AS Harkava, IIf((([Projects].[Proj_Zeva_in_tich]) Is Not Null) And (([Projects].[Proj_Zeva_in_tich]) Between #${start}# And #${end}#) And (([Projects].[Proj_Zeva_in_Biz]) Is Null),Format([Projects].[Proj_Zeva_in_tich],"yyyy-mm-dd"),Null) AS Zeva_in, IIf((([Projects].[Proj_Peruk_Hazmanot_tich]) Is Not Null) And (([Projects].[Proj_Peruk_Hazmanot_tich]) Between #${start}# And #${end}#) And (([Projects].[Proj_Peruk_Hazmanot_Biz]) Is Null),Format([Projects].[Proj_Peruk_Hazmanot_tich],"yyyy-mm-dd"),Null) AS Peruk_Hazmanot, IIf((([Projects].[Proj_Hatkana_Biz]) Is Not Null) And (([Projects].[Proj_Hatkana_Biz]) Between #${start}# And #${end}#) And (([Projects].[Proj_Hatkana_tich]) Is Null),Format([Projects].[Proj_Hatkana_Biz],"yyyy-mm-dd"),Null) AS Hatkana, Projects.Proj_Status FROM Customer INNER JOIN Projects ON Customer.Kod_Lak = Projects.Proj_Mis_lak WHERE (((IIf((([Projects].[Proj_Hituch_tich]) Is Not Null) And (([Projects].[Proj_Hituch_tich]) Between #${start}# And #${end}#) And (([Projects].[Proj_Hituch_Biz]) Is Null),Format([Projects].[Proj_Hituch_tich],"yyyy-mm-dd"),Null)) Is Not Null) AND ((Projects.Proj_Status)<>"הסתיים")) OR (((IIf((([Projects].[Proj_Harkava_tich]) Is Not Null) And (([Projects].[Proj_Harkava_tich]) Between #${start}# And #${end}#) And (([Projects].[Proj_Harkava_Biz]) Is Null),Format([Projects].[Proj_Harkava_tich],"yyyy-mm-dd"),Null)) Is Not Null) AND ((Projects.Proj_Status)<>"הסתיים")) OR (((IIf((([Projects].[Proj_Zeva_in_tich]) Is Not Null) And (([Projects].[Proj_Zeva_in_tich]) Between #${start}# And #${end}#) And (([Projects].[Proj_Zeva_in_Biz]) Is Null),Format([Projects].[Proj_Zeva_in_tich],"yyyy-mm-dd"),Null)) Is Not Null) AND ((Projects.Proj_Status)<>"הסתיים")) OR (((IIf((([Projects].[Proj_Peruk_Hazmanot_tich]) Is Not Null) And (([Projects].[Proj_Peruk_Hazmanot_tich]) Between #${start}# And #${end}#) And (([Projects].[Proj_Peruk_Hazmanot_Biz]) Is Null),Format([Projects].[Proj_Peruk_Hazmanot_tich],"yyyy-mm-dd"),Null)) Is Not Null) AND ((Projects.Proj_Status)<>"הסתיים")) OR (((IIf((([Projects].[Proj_Hatkana_Biz]) Is Not Null) And (([Projects].[Proj_Hatkana_Biz]) Between #${start}# And #${end}#) And (([Projects].[Proj_Hatkana_tich]) Is Null),Format([Projects].[Proj_Hatkana_Biz],"yyyy-mm-dd"),Null)) Is Not Null) AND ((Projects.Proj_Status)<>"הסתיים"));`;
    let projId, customerName, description, worker;
    try{
        let projects = await con.query(query);
        for(let project of projects){
            projId = project['Proj_Mispar']
            customerName = project['Shem_lak'];
            for(task of tasks){
                if(project[task] != null){
                    description = project['Proj_Teur'];

                    worker = '';
                    if(task == 'Peruk_Hazmanot') worker = project['Worker_Peruk'];
                    if(task == 'Hituch') worker = project['Worker_Hituch'];
                    if(task == 'Harkava') worker = project['Worker_Harkava'];
                    if(task == 'Zeva_in') worker = project['Worker_Zeva'];
                    if(task == 'Hatkana') worker = project['Worker_Hatkana'];

                    week[project[task]]['tasks'][task].push({projId, description, customerName, worker});
                }
            }
        }

/*
let tasks = JSON.stringify({'Peruk_Hazmanot': [], 'Hituch': [], 'Harkava': [], 'Zeva_in': [], 'Hatkana': []});
Worker_Peruk:'בוריס'
Worker_Hituch:'אלי'`
Worker_Harkava:'מוטי'
Worker_Zeva:'אלי' 
Worker_Hatkana:'אלי'*/

        query = `SELECT Format([Calendar].[Taarich],"yyyy-mm-dd") AS [date], Calendar.Hearot FROM Calendar WHERE (((Calendar.Taarich) Between #${start}# And #${end}#));`;
        let remarks = await con.query(query)
        for(let remark of remarks){
            week[remark['date']]['remark'] = remark['Hearot'];
        }
    }
    catch(err){
        throw err;
    }
    return week;
}

async function getCustometInfo(projId){
    let query = `SELECT Customer.Shem_lak, Customer.Tel_nayad, Customer.Ir_lak, Customer.Ktovet_lak, Customer.Koma_lak, Customer.Mipar_dira_lak, Customer.Hearot_lak FROM Customer INNER JOIN Projects ON Customer.Kod_Lak = Projects.Proj_Mis_lak WHERE (((Projects.Proj_Mispar)=${projId}));`;
    return await con.query(query);
}

async function updateTask(projId, category){
    category = 'Proj_' + category +  (category != 'Hatkana' ? '_Biz' : '_tich');
    let query = `UPDATE Projects SET Projects.${category} = Date() WHERE (((Projects.Proj_Mispar)=${projId}));`;
    return await con.execute(query);
}

app.get('/api/tasks', (req,res) =>{
    let week = parseInt(req.query['week']);
    if(isNaN(week)){
        res.status(400).json({err: 'no week given'});
        return;
    }
    getTasks(week)
    .then(data => res.json(data))
    .catch(err => res.status(500).json({err}));
});

app.get('/api/customer', (req,res) =>{
    let id = req.query['id'];
    if(!id){
        res.status(400).json({err: 'no id given'})
    }
    getCustometInfo(id)
    .then(data =>{
        if(Object.keys(data).length === 0){
            res.status(404).json({err: 'customer not found'});
        }
        else{
            res.json(data[0]);
        }
    })
    .catch(err => res.status(500).json({err}));
});

app.post('/api/task', (req, res) => {
    let id = req.query['id'], category = req.query['category'];
    if(!id || !category){
        res.status(400).json({err: 'no id or category given'})
    }
    updateTask(id,category)
    .then(res.status(200))
    .catch( err => res.status(500).json({err}));
});

app.listen(4000, () => console.log('listening on port 4000'));