require('dotenv').config();
const express=require('express');
const cors=require('cors');
const mysql=require('mysql2/promise');
const nodemailer=require('nodemailer');

const app=express();
app.use(cors());
app.use(express.json());

const ADMIN_PASSWORD=process.env.ADMIN_PASSWORD||'change-this-admin-password';
const ADMIN_KEY=process.env.ADMIN_KEY||'change-this-admin-key';
const PORT=process.env.PORT||5000;

function requireAdmin(req,res,next){
  if(req.headers['x-admin-key']!==ADMIN_KEY)return res.status(401).json({error:'Admin authentication required.'});
  next();
}

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: {
    rejectUnauthorized: false
  }
});

const emailReady=Boolean(process.env.SMTP_HOST&&process.env.SMTP_USER&&process.env.SMTP_PASS&&process.env.SMTP_FROM);
const mailer=emailReady?nodemailer.createTransport({
  host:process.env.SMTP_HOST,
  port:Number(process.env.SMTP_PORT||587),
  secure:String(process.env.SMTP_SECURE||'false').toLowerCase()==='true',
  auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS},
  tls:{rejectUnauthorized:String(process.env.SMTP_TLS_REJECT_UNAUTHORIZED||'true').toLowerCase()!=='false'}
}):null;

const adminEmails=(process.env.ADMIN_EMAILS||'').split(',').map(v=>v.trim()).filter(Boolean);

function normalizePhone(phone){
  const raw=String(phone||'').trim();
  if(raw.startsWith('+'))return raw.replace(/[^+\d]/g,'');
  const digits=raw.replace(/\D/g,'');
  if(digits.length===10)return `+91${digits}`;
  if(digits.startsWith('91')&&digits.length===12)return `+${digits}`;
  return `+${digits}`;
}
function formatDate(date){
  if(!date)return '';
  const d=new Date(`${String(date).slice(0,10)}T00:00:00`);
  return d.toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});
}
function formatTime(time){
  if(!time)return '';
  const [h,m]=String(time).slice(0,5).split(':').map(Number);
  const d=new Date(2000,0,1,h,m);
  return d.toLocaleTimeString('en-IN',{hour:'numeric',minute:'2-digit'});
}

async function sendEmail(booking,status){
  if(!mailer||!booking.email)return {sent:false,reason:!mailer?'email-not-configured':'no-customer-email'};
  const subject=status==='confirmed'?'Chende Booking Confirmed':status==='cancelled'?'Chende Booking Cancelled':status==='completed'?'Chende Booking Completed':'Chende Booking Update';
  const statusText=status.toUpperCase();
  const text=`Dear ${booking.customer_name},\n\nYour Chende booking request #${booking.id} has been ${status}.\n\nEvent: ${booking.event_type}\nDate: ${formatDate(booking.event_date)}\nTime: ${formatTime(booking.start_time)}\nLocation: ${booking.location}\nStatus: ${statusText}\n\nShri Mahaganapathi Chende Balaga\nMudradi, Karnataka\nPhone: 8971474693 / 8277069598 / 9844667599`;
  await mailer.sendMail({from:process.env.SMTP_FROM,to:booking.email,subject,text});
  return {sent:true};
}


async function notifyAdminNewBooking(booking){
  const result={email:{sent:false}};
  const text=`New Chende booking request #${booking.id} has been received.\n\nCustomer: ${booking.customer_name}\nPhone: ${booking.phone}\nEmail: ${booking.email||'Not provided'}\nEvent: ${booking.event_type}\nDate: ${formatDate(booking.event_date)}\nTime: ${formatTime(booking.start_time)}\nLocation: ${booking.location}\nMessage: ${booking.message||'None'}\nStatus: PENDING\n\nPlease login to the Chende admin dashboard to review and confirm/cancel the booking.\n\nShri Mahaganapathi Chende Balaga\nMudradi, Karnataka`;

  if(mailer && adminEmails.length){
    const failures=[];
    let sent=0;
    for(const email of adminEmails){
      try{
        await mailer.sendMail({from:process.env.SMTP_FROM,to:email,subject:`New Chende Booking Request #${booking.id}`,text});
        sent++;
      }catch(e){
        console.error(`Admin email notification failed for ${email}:`,e.message);
        failures.push({email,error:e.message});
      }
    }
    result.email={sent:sent>0,count:sent,total:adminEmails.length,failures};
  }else{
    result.email={sent:false,reason:!mailer?'email-not-configured':'admin-emails-not-configured'};
  }
  return result;
}

async function notifyCustomer(booking,status){
  const result={email:{sent:false}};
  if(!['pending','confirmed','cancelled','completed'].includes(status))return result;
  try{result.email=await sendEmail(booking,status);}catch(e){console.error('Email notification failed:',e.message);result.email={sent:false,error:e.message};}
  return result;
}

app.get('/api/health',async(_,res)=>{
  try{
    await pool.query('SELECT 1');
    res.json({ok:true,service:'Chende Booking API',database:true,notifications:{email:emailReady,adminEmails:adminEmails.length}});
  }catch(e){
    res.status(503).json({ok:false,service:'Chende Booking API',database:false,error:'Database unavailable'});
  }
});

app.post('/api/bookings',async(req,res)=>{
  const {customer_name,email,phone,event_type,event_date,start_time,location,message}=req.body;
  if(!customer_name||!phone||!event_type||!event_date||!start_time||!location){
    return res.status(400).json({error:'Please fill all required fields.'});
  }
  try{
    const [result]=await pool.query(
      `INSERT INTO bookings (customer_name,email,phone,event_type,event_date,start_time,location,message,status)
       VALUES (?,?,?,?,?,?,?,?, 'pending')`,
      [customer_name,email||null,phone,event_type,event_date,start_time,location,message||null]
    );
    const [[booking]]=await pool.query('SELECT * FROM bookings WHERE id=?',[result.insertId]);
    const customerNotifications=await notifyCustomer(booking,'pending');
    const adminNotifications=await notifyAdminNewBooking(booking);
    res.status(201).json({id:result.insertId,status:'pending',message:'Booking request created successfully.',notifications:{customer:customerNotifications,admin:adminNotifications}});
  }catch(e){
    console.error(e);
    res.status(500).json({error:'Could not create booking.'});
  }
});

app.post('/api/bookings/status',async(req,res)=>{
  const id=Number(req.body?.id);
  const phone=String(req.body?.phone||'').trim();
  if(!id||!phone)return res.status(400).json({error:'Booking ID and phone number are required.'});
  try{
    const [rows]=await pool.query('SELECT id,customer_name,event_type,event_date,start_time,location,status,created_at FROM bookings WHERE id=? AND phone=?',[id,phone]);
    if(!rows.length)return res.status(404).json({error:'No booking found with that Booking ID and phone number.'});
    res.json({ok:true,booking:rows[0]});
  }catch(e){
    console.error(e);
    res.status(500).json({error:'Could not check booking status.'});
  }
});

app.post('/api/admin/login',async(req,res)=>{
  if(!req.body?.password||req.body.password!==ADMIN_PASSWORD)return res.status(401).json({error:'Invalid admin password.'});
  res.json({ok:true,key:ADMIN_KEY});
});

app.get('/api/bookings',requireAdmin,async(_,res)=>{
  try{
    const [rows]=await pool.query('SELECT * FROM bookings ORDER BY created_at DESC');
    res.json(rows);
  }catch(e){
    console.error(e);
    res.status(500).json({error:'Database unavailable'});
  }
});

app.patch('/api/bookings/:id/status',requireAdmin,async(req,res)=>{
  const id=Number(req.params.id);
  const allowed=['pending','confirmed','cancelled','completed'];
  const status=req.body?.status;
  if(!id||!allowed.includes(status))return res.status(400).json({error:'Invalid booking status.'});
  try{
    const [result]=await pool.query('UPDATE bookings SET status=? WHERE id=?',[status,id]);
    if(!result.affectedRows)return res.status(404).json({error:'Booking not found.'});
    const [[booking]]=await pool.query('SELECT * FROM bookings WHERE id=?',[id]);
    const notifications=await notifyCustomer(booking,status);
    res.json({ok:true,booking,notifications});
  }catch(e){
    console.error(e);
    res.status(500).json({error:'Could not update booking status.'});
  }
});

app.listen(PORT,()=>console.log(`Chende Booking API running on http://localhost:${PORT}`));
