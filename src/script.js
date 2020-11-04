let form=document.querySelector("#fadd");
let fon=document.querySelector("#fon");

let addbutton=document.querySelector("#badd");
addbutton.addEventListener("click",()=> 
{
    form.style.display="";
    fon.style.display="";
    form.style.top=(window.innerHeight-form.clientHeight)/2 + 'px';
    form.style.left=(window.innerWidth-form.clientWidth)/2 + 'px';
})

let cancelbutton=document.querySelector("#fbcancel");
cancelbutton.addEventListener("click",()=> 
{
    form.reset();
    form.style.display="none";
    fon.style.display="none";
})

let resetbutton=document.querySelector("#fbreset");
resetbutton.addEventListener("click",()=> form.dataset.id="-1");

form.onsubmit= ()=>{
    let name=form.querySelector("#fname").value;
    let kol=form.querySelector("#fkol").value;
    let count=form.querySelector("#fcount").value;
    if(isNaN(+count))
    {
        alert("Введите число!!!");
        return false;
    }
    if(form.dataset.id==-1)
    {
        fetch("/list",
        {
            "method":"PUT", 
            "headers": {
                'Content-Type': 'application/json;charset=utf-8'
            },
            "body": JSON.stringify({"name": name, "kol": kol, "count": count })
        }).then(r=>r.json())
        .then( result=>{
            let newRow = document.createElement('tr');
            let ter=document.querySelector("#checklist").lastChild;
                newRow.innerHTML = `<td>${ter==null?1:+ter.querySelector("td").innerHTML+1}</td>
                                    <td>${name}</td>
                                    <td>${kol}</td>
                                    <td>${count}</td>
                                    <td><input type="button" value="Изменить" 
                                        data-id="${result.id}" onclick="EditHandler(this)"/></td>
                                    <td><input type="button" value="Удалить" data-id="${result.id}" 
                                        onclick="DeleteHandler(this)"/></td>`;
                document.querySelector('#checklist').append(newRow);
                form.reset();
                let sum=document.querySelector('#sum');
                sum.innerHTML="Общая сумма: "+ (+(sum.innerHTML.slice(13))+kol*count);
           
        });
    }
    else
    {
        fetch("/list",
        {
            "method":"POST", 
            "headers": {
                'Content-Type': 'application/json;charset=utf-8'
            },
            "body": JSON.stringify({"id": form.dataset.id, "name": name, "kol": kol, "count": count })
        }).then(()=> {
            let rows=document.querySelector("#checklist").querySelectorAll("tr");
            let starsum;
            for(let i=0; i<rows.length;i++)
            {
                if(form.dataset.id == rows[i].querySelector("input").dataset.id)
                {
                    let cells= rows[i].querySelectorAll("td");
                    starsum=cells[2].innerHTML*cells[3].innerHTML;
                    cells[1].innerHTML=name;
                    cells[2].innerHTML=kol;
                    cells[3].innerHTML=count;
                    break;
                }
            }
            form.reset();
            form.dataset.id=-1;
            let sum=document.querySelector('#sum');
            sum.innerHTML="Общая сумма: "+ (+(sum.innerHTML.slice(13))-starsum+kol*count);
           
        });
    } 
    return false;
};

function EditHandler(b)
{
    form.style.display="";
    fon.style.display="";
    form.style.top=(window.innerHeight-form.clientHeight)/2 + 'px';
    form.style.left=(window.innerWidth-form.clientWidth)/2 + 'px';
    form.dataset.id=b.dataset.id;
    let tds=b.parentNode.parentNode.querySelectorAll("td");
    form.querySelector("#fname").value=tds[1].innerHTML;
    form.querySelector("#fkol").value=tds[2].innerHTML;
    form.querySelector("#fcount").value=tds[3].innerHTML;
};

function DeleteHandler(b)
{
    if(confirm("Вы уверенны что хотите удалить?"))
    {
        fetch("/list",
        {
            "method":"DELETE", 
            "headers": {
                'Content-Type': 'application/json;charset=utf-8'
            },
            "body": JSON.stringify({"id": b.dataset.id})
        }).then(()=>{
            let t= b.parentNode.parentNode.querySelectorAll("td");
            let sum=document.querySelector('#sum');
            sum.innerHTML="Общая сумма: "+ (+(sum.innerHTML.slice(13))-t[2].innerHTML*t[3].innerHTML);
            let sibling=b.parentNode.parentNode.nextSibling;
            while(sibling)
            {
                let perem=sibling.querySelector("td");
                perem.innerHTML=perem.innerHTML-1;
                sibling=sibling.nextSibling;
            }
            document.querySelector('#checklist').removeChild(b.parentNode.parentNode);
        });
    }
};