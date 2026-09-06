window.addEventListener('load',()=>setTimeout(()=>document.getElementById('loader')?.classList.add('hide'),700));

const header=document.getElementById('header');
const menu=document.getElementById('menuBtn');
const nav=document.getElementById('nav');

addEventListener('scroll',()=>header?.classList.toggle('scrolled',scrollY>30));

menu?.addEventListener('click',()=>nav?.classList.toggle('open'));

nav?.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click',()=>nav?.classList.remove('open'));
});

const theme=document.getElementById('themeBtn');

theme?.addEventListener('click',()=>{
    document.body.classList.toggle('dark');
    const dark=document.body.classList.contains('dark');
    theme.textContent=dark?'☾':'☼';
    localStorage.setItem('theme',dark?'dark':'light');
});

if(localStorage.getItem('theme')==='dark'){
    document.body.classList.add('dark');
    if(theme)theme.textContent='☾';
}

const langBtn=document.getElementById('langBtn');

const translations={
    en:{
        navHome:'Home',
        navStatus:'Check Status',
        navAbout:'About',
        navServices:'Services',
        navTeam:'Team',
        navGallery:'Gallery',
        navBooking:'Booking',
        navContact:'Contact',
        bookNow:'Book Now',
        heroEyebrow:'TRADITION • DEVOTION • RHYTHM',
        heroTitle:'Feel the <em>power</em><br>of the Chende.',
        heroText:'Experience the vibrant rhythm of Shri Mahaganapathi Chende Balaga, Mudradi for weddings, bhajans, processions, temple events and auspicious occasions.',
        heroBook:'Book Our Balaga <span>↗</span>',
        heroTeam:'Meet the Team',
        statPerformers:'Performers',
        statPrograms:'Programs',
        statTradition:'Tradition',
        labelStory:'OUR STORY',
        aboutEyebrow:'ROOTED IN TRADITION',
        aboutTitle:'A rhythm that brings people <span>together.</span>',
        aboutP1:'Shri Mahaganapathi Chende Balaga, Mudradi carries the vibrant tradition of Chende performance into modern celebrations while respecting the spirit and culture behind every beat.',
        aboutP2:'From sacred temple occasions to joyful weddings and processions, our team brings disciplined rhythm, energy and a memorable traditional atmosphere.',
        aboutLink:'Plan a booking →',
        labelOccasions:'OCCASIONS',
        servicesEyebrow:'PERFORM WITH US',
        servicesTitle:'Made for your <span>special moment.</span>',
        servicesText:'Book Shri Mahaganapathi Chende Balaga for your wedding, temple event, procession, bhajan, cultural program or other special occasion.',
        wedding:'Weddings',
        weddingText:'Grand Chende performances for entrances, processions and wedding celebrations.',
        temple:'Temple Events',
        templeText:'Traditional performances for temple programs, festivals and auspicious occasions.',
        procession:'Processions',
        processionText:'High-energy rhythm for processions, community celebrations and public events.',
        bhajan:'Bhajans & Culture',
        bhajanText:'Rhythm support for bhajans, cultural programs and local celebrations.',
        teamTitle:'One team.<br><span>One rhythm.</span>',
        teamText:'Our performers bring discipline, tradition and collective energy. The sound is powerful because the team moves as one.',
        teamBook:'Request Booking ↗',
        labelGallery:'VISUALS',
        galleryEyebrow:'THE SOUND HAS A LOOK',
        galleryTitle:'Tradition in <span>every frame.</span>',
        labelBooking:'BOOKING',
        bookingEyebrow:'MAKE YOUR DATE SPECIAL',
        bookingTitle:'Book the <span>Balaga.</span>',
        bookingText:'Send your event details and submit a booking request. Our team will contact you to confirm the Chende booking.',
        nameLabel:'Full Name',
        phoneLabel:'Phone',
        emailLabel:'Email (Optional)',
        eventLabel:'Event Type',
        dateLabel:'Event Date',
        timeLabel:'Start Time',
        locationLabel:'Venue / Location',
        messageLabel:'Additional Requirements',
        submitBooking:'Submit Booking Request ↗',
        quote:'Where words end, rhythm begins.',
        labelContact:'CONTACT',
        contactEyebrow:"LET'S TALK",
        contactTitle:'Bring the <span>Chende</span> to your occasion.',
        contactText:'Call, WhatsApp or email us for availability, booking details and your event requirements.'
    },

    kn:{
        navHome:'ಮುಖಪುಟ',
        navStatus:'ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ',
        navAbout:'ನಮ್ಮ ಬಗ್ಗೆ',
        navServices:'ಸೇವೆಗಳು',
        navTeam:'ತಂಡ',
        navGallery:'ಗ್ಯಾಲರಿ',
        navBooking:'ಬುಕಿಂಗ್',
        navContact:'ಸಂಪರ್ಕ',
        bookNow:'ಈಗ ಬುಕ್ ಮಾಡಿ',
        heroEyebrow:'ಸಂಪ್ರದಾಯ • ಭಕ್ತಿ • ಲಯ',
        heroTitle:'ಚೆಂಡೆಯ <em>ಶಕ್ತಿಯನ್ನು</em><br>ಅನುಭವಿಸಿ.',
        heroText:'ಮದುವೆ, ಭಜನೆ, ಮೆರವಣಿಗೆ, ದೇವಸ್ಥಾನ ಕಾರ್ಯಕ್ರಮಗಳು ಮತ್ತು ಶುಭ ಸಮಾರಂಭಗಳಿಗೆ ಶ್ರೀ ಮಹಾಗಣಪತಿ ಚೆಂಡೆ ಬಳಗ, ಮೂಡ್ರಾಡಿಯ ಸಾಂಪ್ರದಾಯಿಕ ಲಯವನ್ನು ಅನುಭವಿಸಿ.',
        heroBook:'ಬಳಗವನ್ನು ಬುಕ್ ಮಾಡಿ <span>↗</span>',
        heroTeam:'ತಂಡವನ್ನು ನೋಡಿ',
        statPerformers:'ಕಲಾವಿದರು',
        statPrograms:'ಕಾರ್ಯಕ್ರಮಗಳು',
        statTradition:'ಸಂಪ್ರದಾಯ',
        labelStory:'ನಮ್ಮ ಕಥೆ',
        aboutEyebrow:'ಸಂಪ್ರದಾಯದಲ್ಲಿ ಬೇರು',
        aboutTitle:'ಜನರನ್ನು <span>ಒಗ್ಗೂಡಿಸುವ</span> ಲಯ.',
        aboutP1:'ಶ್ರೀ ಮಹಾಗಣಪತಿ ಚೆಂಡೆ ಬಳಗ, ಮೂಡ್ರಾಡಿ ಚೆಂಡೆ ವಾದ್ಯದ ಶ್ರೀಮಂತ ಸಂಪ್ರದಾಯವನ್ನು ಆಧುನಿಕ ಸಮಾರಂಭಗಳಿಗೆ ತರುತ್ತದೆ ಮತ್ತು ಪ್ರತಿಯೊಂದು ತಾಳದ ಹಿಂದಿನ ಸಂಸ್ಕೃತಿಗೆ ಗೌರವ ನೀಡುತ್ತದೆ.',
        aboutP2:'ದೇವಸ್ಥಾನ ಕಾರ್ಯಕ್ರಮಗಳಿಂದ ಮದುವೆ ಮತ್ತು ಮೆರವಣಿಗೆಗಳವರೆಗೆ ನಮ್ಮ ತಂಡ ಶಿಸ್ತು, ಶಕ್ತಿ ಮತ್ತು ಸಾಂಪ್ರದಾಯಿಕ ವಾತಾವರಣವನ್ನು ನೀಡುತ್ತದೆ.',
        aboutLink:'ಬುಕಿಂಗ್ ಯೋಜಿಸಿ →',
        labelOccasions:'ಸಮಾರಂಭಗಳು',
        servicesEyebrow:'ನಮ್ಮೊಂದಿಗೆ ಪ್ರದರ್ಶನ ನೀಡಿ',
        servicesTitle:'ನಿಮ್ಮ <span>ವಿಶೇಷ ಕ್ಷಣಕ್ಕಾಗಿ.</span>',
        servicesText:'ಮದುವೆ, ದೇವಸ್ಥಾನ ಕಾರ್ಯಕ್ರಮ, ಮೆರವಣಿಗೆ, ಭಜನೆ, ಸಾಂಸ್ಕೃತಿಕ ಕಾರ್ಯಕ್ರಮ ಅಥವಾ ಇತರ ವಿಶೇಷ ಸಮಾರಂಭಕ್ಕಾಗಿ ಶ್ರೀ ಮಹಾಗಣಪತಿ ಚೆಂಡೆ ಬಳಗವನ್ನು ಬುಕ್ ಮಾಡಿ.',
        wedding:'ಮದುವೆಗಳು',
        weddingText:'ಮದುವೆಯ ಪ್ರವೇಶ, ಮೆರವಣಿಗೆ ಮತ್ತು ಸಂಭ್ರಮಕ್ಕಾಗಿ ಭವ್ಯ ಚೆಂಡೆ ಪ್ರದರ್ಶನ.',
        temple:'ದೇವಸ್ಥಾನ ಕಾರ್ಯಕ್ರಮಗಳು',
        templeText:'ದೇವಸ್ಥಾನ, ಹಬ್ಬ ಮತ್ತು ಶುಭ ಸಮಾರಂಭಗಳಿಗಾಗಿ ಸಾಂಪ್ರದಾಯಿಕ ಪ್ರದರ್ಶನ.',
        procession:'ಮೆರವಣಿಗೆಗಳು',
        processionText:'ಸಮುದಾಯ, ಸಾರ್ವಜನಿಕ ಕಾರ್ಯಕ್ರಮ ಮತ್ತು ಮೆರವಣಿಗೆಗಳಿಗೆ ಉತ್ಸಾಹಭರಿತ ಲಯ.',
        bhajan:'ಭಜನೆ ಮತ್ತು ಸಂಸ್ಕೃತಿ',
        bhajanText:'ಭಜನೆ, ಸಾಂಸ್ಕೃತಿಕ ಕಾರ್ಯಕ್ರಮ ಮತ್ತು ಸ್ಥಳೀಯ ಆಚರಣೆಗಳಿಗೆ ಲಯದ ಬೆಂಬಲ.',
        teamTitle:'ಒಂದು ತಂಡ.<br><span>ಒಂದು ಲಯ.</span>',
        teamText:'ನಮ್ಮ ಕಲಾವಿದರು ಶಿಸ್ತು, ಸಂಪ್ರದಾಯ ಮತ್ತು ಒಗ್ಗಟ್ಟಿನ ಶಕ್ತಿಯನ್ನು ತರುತ್ತಾರೆ. ತಂಡ ಒಂದಾಗಿ ಚಲಿಸುವುದರಿಂದ ಧ್ವನಿ ಇನ್ನಷ್ಟು ಶಕ್ತಿಯುತವಾಗುತ್ತದೆ.',
        teamBook:'ಬುಕಿಂಗ್ ಕೇಳಿ ↗',
        labelGallery:'ಚಿತ್ರಗಳು',
        galleryEyebrow:'ಧ್ವನಿಗೂ ಒಂದು ರೂಪವಿದೆ',
        galleryTitle:'ಪ್ರತಿ ಚಿತ್ರದಲ್ಲೂ <span>ಸಂಪ್ರದಾಯ.</span>',
        labelBooking:'ಬುಕಿಂಗ್',
        bookingEyebrow:'ನಿಮ್ಮ ದಿನವನ್ನು ವಿಶೇಷವಾಗಿಸಿ',
        bookingTitle:'ಬಳಗವನ್ನು <span>ಬುಕ್ ಮಾಡಿ.</span>',
        bookingText:'ನಿಮ್ಮ ಕಾರ್ಯಕ್ರಮದ ವಿವರಗಳನ್ನು ಕಳುಹಿಸಿ ಮತ್ತು ಬುಕಿಂಗ್ ವಿನಂತಿಯನ್ನು ಸಲ್ಲಿಸಿ. ನಮ್ಮ ತಂಡವು ಚೆಂಡೆ ಬುಕಿಂಗ್ ಅನ್ನು ಖಚಿತಪಡಿಸಲು ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ.',
        nameLabel:'ಪೂರ್ಣ ಹೆಸರು',
        phoneLabel:'ಫೋನ್',
        emailLabel:'ಇಮೇಲ್ (ಐಚ್ಛಿಕ)',
        eventLabel:'ಕಾರ್ಯಕ್ರಮದ ಪ್ರಕಾರ',
        dateLabel:'ಕಾರ್ಯಕ್ರಮದ ದಿನಾಂಕ',
        timeLabel:'ಪ್ರಾರಂಭದ ಸಮಯ',
        locationLabel:'ಸ್ಥಳ / ವಿಳಾಸ',
        messageLabel:'ಹೆಚ್ಚುವರಿ ಅಗತ್ಯಗಳು',
        submitBooking:'ಬುಕಿಂಗ್ ವಿನಂತಿ ಸಲ್ಲಿಸಿ ↗',
        quote:'ಮಾತುಗಳು ಮುಗಿದಲ್ಲಿ ಲಯ ಆರಂಭವಾಗುತ್ತದೆ.',
        labelContact:'ಸಂಪರ್ಕ',
        contactEyebrow:'ಮಾತನಾಡೋಣ',
        contactTitle:'ನಿಮ್ಮ ಸಮಾರಂಭಕ್ಕೆ <span>ಚೆಂಡೆಯನ್ನು</span> ತರೋಣ.',
        contactText:'ಲಭ್ಯತೆ, ಬುಕಿಂಗ್ ವಿವರಗಳು ಮತ್ತು ಕಾರ್ಯಕ್ರಮದ ಅಗತ್ಯಗಳಿಗಾಗಿ ಕರೆ, ವಾಟ್ಸಾಪ್ ಅಥವಾ ಇಮೇಲ್ ಮಾಡಿ.'
    }
};

function setLanguage(lang){
    const t=translations[lang];
    if(!t)return;

    document.querySelectorAll('[data-i18n]').forEach(el=>{
        const key=el.dataset.i18n;
        if(t[key]===undefined)return;

        if(el.tagName==='LABEL'){
            const textNode=[...el.childNodes].find(
                n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim()
            );

            if(textNode){
                textNode.textContent=t[key];
            }else{
                el.insertBefore(
                    document.createTextNode(t[key]),
                    el.firstChild
                );
            }
        }else{
            el.innerHTML=t[key];
        }
    });

    document.body.classList.toggle('kn',lang==='kn');
    document.documentElement.lang=lang==='kn'?'kn':'en';

    if(langBtn){
        langBtn.textContent=lang==='kn'?'English':'ಕನ್ನಡ';
    }

    localStorage.setItem('lang',lang);
}

setLanguage(localStorage.getItem('lang')||'en');

langBtn?.addEventListener('click',()=>{
    const current=localStorage.getItem('lang')||'en';
    setLanguage(current==='en'?'kn':'en');
});


/* SCROLL REVEAL */

const io=new IntersectionObserver(
    es=>es.forEach(e=>{
        if(e.isIntersecting){
            e.target.classList.add('show');
        }
    }),
    {threshold:.12}
);

document.querySelectorAll('.reveal').forEach(e=>io.observe(e));


/* PARTICLES */

const box=document.querySelector('.particles');

for(let i=0;i<48;i++){
    const p=document.createElement('i');

    p.style.left=Math.random()*100+'%';
    p.style.animationDelay=(-Math.random()*11)+'s';
    p.style.animationDuration=(7+Math.random()*13)+'s';

    box?.appendChild(p);
}


/* CURSOR GLOW */

const glow=document.querySelector('.cursor-glow');

addEventListener('pointermove',e=>{
    if(glow){
        glow.style.left=e.clientX+'px';
        glow.style.top=e.clientY+'px';
    }
});


/* EVENT DATE */

const date=document.querySelector('input[name="event_date"]');

if(date){
    date.min=new Date().toISOString().split('T')[0];
}


/* ==========================================
   PRODUCTION BACKEND
========================================== */

const API='https://shri-mahaganapathi-chende-balaga.onrender.com/api';


/* ==========================================
   CHECK BACKEND
========================================== */

async function checkBookingService(){

    const status=document.getElementById('bookingServiceStatus');

    if(!status)return;

    status.className='booking-service-status';

    status.innerHTML=
        '<span class="dot"></span><span>Checking booking service...</span>';

    try{

        const response=await fetch(
            API+'/health',
            {
                method:'GET',
                headers:{
                    'Accept':'application/json'
                },
                cache:'no-store'
            }
        );

        if(!response.ok){
            throw new Error('Backend returned an error');
        }

        const result=await response.json();

        if(!result.ok||!result.database){
            throw new Error('Database unavailable');
        }

        status.className='booking-service-status online';

        status.innerHTML=
            '<span class="dot"></span>' +
            '<span>Secure booking service online</span>';

        return true;

    }catch(error){

        console.error(
            'Booking service check failed:',
            error
        );

        status.className='booking-service-status offline';

        status.innerHTML=
            '<span class="dot"></span>' +
            '<span>Booking service temporarily unavailable</span>';

        return false;
    }
}


/* ==========================================
   BOOKING FORM
========================================== */

const bookingForm=document.getElementById('bookingForm');

bookingForm?.addEventListener('submit',async e=>{

    e.preventDefault();

    const message=document.getElementById('bookingMsg');
    const button=document.getElementById('bookingSubmit');

    if(!message||!button)return;

    button.disabled=true;

    const originalText=button.innerHTML;

    button.innerHTML='Submitting…';

    message.className='';
    message.textContent='Submitting booking request…';

    try{

        const data=Object.fromEntries(
            new FormData(e.target)
        );


        /* VALIDATION */

        if(!data.customer_name&&!data.name){
            throw new Error('Please enter your name.');
        }

        if(!data.phone){
            throw new Error('Please enter your phone number.');
        }

        if(!data.event_date){
            throw new Error('Please select an event date.');
        }

        if(!data.start_time){
            throw new Error('Please select the starting time.');
        }

        if(!data.location){
            throw new Error('Please enter the event location.');
        }


        /* SEND TO RENDER */

        const response=await fetch(
            API+'/bookings',
            {
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'Accept':'application/json'
                },
                body:JSON.stringify(data)
            }
        );


        let result={};

        try{
            result=await response.json();
        }catch{
            result={};
        }


        if(!response.ok){

            throw new Error(
                result.error||
                'The booking service could not process your request.'
            );
        }


        /* SUCCESS */

        const bookingId=
            result.id||
            result.booking_id||
            result.bookingId;

        message.className='success';

        message.innerHTML=`
            <strong>Booking request submitted successfully!</strong>
            <br>
            ${
                bookingId
                ? `Your Booking ID is <strong>#${bookingId}</strong>.`
                : 'Your booking request has been received.'
            }
            <br>
            Our team will review your request and contact you to confirm the Chende booking.
            <br>
            <a class="text-link" href="status.html">
                Check your booking status →
            </a>
        `;

        e.target.reset();

        if(date){
            date.min=new Date().toISOString().split('T')[0];
        }

        await checkBookingService();

    }catch(error){

        console.error(
            'Booking submission error:',
            error
        );

        message.className='error';

        if(
            error.message?.startsWith('Please enter')||
            error.message?.startsWith('Please select')
        ){

            message.textContent=error.message;

        }else{

            message.innerHTML=`
                <strong>Booking could not be submitted.</strong>
                <br>
                Please check your internet connection and try again.
                <br>
                If the problem continues, please contact us directly by phone or WhatsApp.
            `;
        }

        checkBookingService();

    }finally{

        button.disabled=false;
        button.innerHTML=originalText;
    }
});


/* ==========================================
   START BACKEND CHECK
========================================== */

checkBookingService();