import{r as s,j as d,a as e,b as $}from"./index-3a453257.js";import{h as I}from"./html2pdf-09777ff0.js";import L from"./MessagesList-b166e538.js";const j=5,A=()=>{const[u,S]=s.useState([]),[o,f]=s.useState([]),[g,b]=s.useState(!1),[i,P]=s.useState(""),[c,y]=s.useState(1),[C,v]=s.useState(0),p=t=>{var a;const r=`; ${document.cookie}`.split(`; ${t}=`);return r.length===2?(a=r.pop())==null?void 0:a.split(";").shift():null},h=p("access"),_=p("user_id"),x=async(t=1)=>{if(_){b(!0);try{const r=(await $.get(`https://backend.onrequestlab.com/api/v1/users/payments/${_}/`,{headers:h?{Authorization:`Bearer ${h}`}:{},withCredentials:!0})).data||[];S(r),f(r),v(r.length),y(t)}catch(n){console.error("Error fetching payments:",n),alert("Failed to fetch payments. Check console for details.")}finally{b(!1)}}};s.useEffect(()=>{x()},[h]),s.useEffect(()=>{f(u.filter(t=>(t.order_id||"").toLowerCase().includes(i.toLowerCase())||(t.payment_id||"").toLowerCase().includes(i.toLowerCase())))},[i,u]);const D=()=>{const t=[["ID","Order ID","Payment ID","Amount","Status","Refund ID","Refund Status","Created At"],...o.map(a=>[a.id,a.order_id,a.payment_id||"-",a.amount,a.status,a.refund_id||"-",a.refund_status||"-",new Date(a.created_at).toLocaleString()])].map(a=>a.map(N=>`"${N}"`).join(",")).join(`
`),n=new Blob([t],{type:"text/csv"}),r=document.createElement("a");r.href=URL.createObjectURL(n),r.download="Payments_Table.csv",r.click()},w=()=>{const t=document.createElement("table");t.innerHTML=`
      <thead>
        <tr>
          <th>ID</th><th>Order ID</th><th>Payment ID</th><th>Amount</th><th>Status</th>
          <th>Refund ID</th><th>Refund Status</th><th>Created At</th>
        </tr>
      </thead>
      <tbody>
        ${o.map(n=>`
          <tr>
            <td>${n.id}</td>
            <td>${n.order_id}</td>
            <td>${n.payment_id||"-"}</td>
            <td>${n.amount}</td>
            <td>${n.status}</td>
            <td>${n.refund_id||"-"}</td>
            <td>${n.refund_status||"-"}</td>
            <td>${new Date(n.created_at).toLocaleString()}</td>
          </tr>
        `).join("")}
      </tbody>
    `,I().set({margin:10,filename:"Payments_Table.pdf",image:{type:"jpeg",quality:.98},html2canvas:{scale:2},jsPDF:{unit:"pt",format:"a4",orientation:"landscape"}}).from(t).save()},l=Math.ceil(C/j),m=t=>{t<1||t>l||(y(t),x(t))};return d("div",{children:[d("div",{className:"flex flex-wrap justify-between items-center gap-3 mb-4",children:[e("input",{type:"text",placeholder:"Search payments...",className:"form-input py-2 px-3 border rounded",value:i,onChange:t=>P(t.target.value)}),d("div",{className:"flex gap-2",children:[e("button",{className:"btn btn-sm btn-primary",onClick:D,children:"Export CSV"}),e("button",{className:"btn btn-sm btn-primary",onClick:w,children:"Export PDF"})]})]}),e("div",{className:"overflow-x-auto",children:d("table",{className:"table table-striped table-hover w-full",children:[e("thead",{children:d("tr",{children:[e("th",{children:"ID"}),e("th",{children:"Order ID"}),e("th",{children:"Payment ID"}),e("th",{children:"Amount"}),e("th",{children:"Status"}),e("th",{children:"Refund ID"}),e("th",{children:"Refund Status"}),e("th",{children:"Created At"})]})}),e("tbody",{children:g?e("tr",{children:e("td",{colSpan:9,className:"text-center py-4",children:"Loading..."})}):o.length===0?e("tr",{children:e("td",{colSpan:9,className:"text-center py-4 text-muted",children:"No records found"})}):o.map(t=>d("tr",{children:[e("td",{children:t.id}),e("td",{children:t.order_id}),e("td",{children:t.payment_id||"-"}),e("td",{children:t.amount}),e("td",{children:t.status}),e("td",{children:t.refund_id||"-"}),e("td",{children:t.refund_status||"-"}),e("td",{children:new Date(t.created_at).toLocaleString()})]},t.id))})]})}),l>1&&d("div",{className:"flex justify-center mt-4 gap-1 flex-wrap",children:[e("button",{className:"btn btn-sm btn-outline-primary",disabled:c===1,onClick:()=>m(c-1),children:"Prev"}),Array.from({length:l},(t,n)=>n+1).map(t=>e("button",{className:`btn btn-sm ${c===t?"btn-primary":"btn-outline-primary"}`,onClick:()=>m(t),children:t},t)),e("button",{className:"btn btn-sm btn-outline-primary",disabled:c===l,onClick:()=>m(c+1),children:"Next"})]}),e(L,{})]})};export{A as default};
