const API = 'https://shri-mahaganapathi-chende-balaga.onrender.com/api';

const key = () => sessionStorage.getItem('chende_admin_key');

const loginScreen = document.getElementById('loginScreen');

function showApp() {
    loginScreen.classList.add('hidden');
    load();
}

function showLogin() {
    loginScreen.classList.remove('hidden');
}


/* =========================
   PARTICLES
========================= */

function makeParticles() {

    const box = document.getElementById('particles');

    if (!box) return;

    for (let i = 0; i < 34; i++) {

        const p = document.createElement('i');

        p.style.left = Math.random() * 100 + '%';
        p.style.animationDelay = (-Math.random() * 11) + 's';
        p.style.animationDuration = (8 + Math.random() * 8) + 's';
        p.style.opacity = (0.2 + Math.random() * 0.5);

        box.appendChild(p);
    }
}

makeParticles();


/* =========================
   CURSOR GLOW
========================= */

window.addEventListener('mousemove', e => {

    const g = document.getElementById('cursorGlow');

    if (g) {

        g.style.left = e.clientX + 'px';
        g.style.top = e.clientY + 'px';

    }

});


/* =========================
   LOADER
========================= */

window.addEventListener('load', () => {

    setTimeout(() => {

        document.getElementById('loader')?.classList.add('hide');

    }, 700);

});


/* =========================
   LOGIN
========================= */

document.getElementById('loginForm')?.addEventListener('submit', async e => {

    e.preventDefault();

    const msg = document.getElementById('loginMsg');
    const password = document.getElementById('adminPassword');

    msg.textContent = 'Signing in…';

    try {

        const r = await fetch(API + '/admin/login', {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                password: password.value
            })

        });

        const o = await r.json();

        if (!r.ok) {
            throw Error(o.error || 'Login failed');
        }

        sessionStorage.setItem(
            'chende_admin_key',
            o.key
        );

        password.value = '';

        msg.textContent = '';

        showApp();

    } catch (err) {

        msg.textContent = err.message;

    }

});


/* =========================
   LOGOUT
========================= */

document.getElementById('logoutBtn')?.addEventListener('click', () => {

    sessionStorage.removeItem('chende_admin_key');

    showLogin();

});


/* =========================
   ESCAPE HTML
========================= */

function esc(v) {

    return String(v ?? '').replace(
        /[&<>"']/g,
        c => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[c])
    );

}


/* =========================
   FORMAT DATE
========================= */

function formatDate(dateValue) {

    if (!dateValue) {
        return '';
    }

    try {

        /*
          Example input:
          2026-09-18T00:00:00.000Z
        */

        const date = new Date(dateValue);

        if (isNaN(date.getTime())) {
            return esc(dateValue);
        }

        return date.toLocaleDateString('en-GB', {

            day: '2-digit',
            month: 'long',
            year: 'numeric',

            timeZone: 'UTC'

        });

    } catch (error) {

        return esc(dateValue);

    }

}


/* =========================
   FORMAT TIME
========================= */

function formatTime(timeValue) {

    if (!timeValue) {
        return '';
    }

    /*
      If backend gives:
      10:00:00

      display:
      10:00 AM
    */

    const parts = String(timeValue).split(':');

    if (parts.length < 2) {
        return esc(timeValue);
    }

    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];

    if (isNaN(hours)) {
        return esc(timeValue);
    }

    const period = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;

    if (hours === 0) {
        hours = 12;
    }

    return `${hours}:${minutes} ${period}`;

}


/* =========================
   ACCEPT / REJECT
========================= */

async function setStatus(id, status) {

    const labels = {

        accepted: 'Accept',
        rejected: 'Reject'

    };

    const action = labels[status];

    if (!action) {
        return;
    }

    if (!confirm(`${action} booking #${id}?`)) {
        return;
    }

    try {

        const r = await fetch(
            `${API}/bookings/${id}/status`,
            {

                method: 'PATCH',

                headers: {

                    'Content-Type': 'application/json',

                    'X-Admin-Key': key()

                },

                body: JSON.stringify({

                    status: status

                })

            }
        );

        const o = await r.json();

        if (r.status === 401) {

            sessionStorage.removeItem(
                'chende_admin_key'
            );

            showLogin();

            return;
        }

        if (!r.ok) {

            throw Error(
                o.error || 'Could not update booking.'
            );

        }

        await load();

    } catch (e) {

        alert(e.message);

    }

}


/* =========================
   ACTION BUTTONS
========================= */

function actions(x) {

    if (x.status === 'pending') {

        return `

            <button
                class="action confirm"
                onclick="setStatus(${x.id}, 'accepted')">
                ✓ ACCEPT
            </button>

            <button
                class="action cancel"
                onclick="setStatus(${x.id}, 'rejected')">
                ✕ REJECT
            </button>

        `;

    }

    if (x.status === 'accepted') {

        return `

            <span class="action-done">
                ✓ ACCEPTED
            </span>

        `;

    }

    if (x.status === 'rejected') {

        return `

            <span class="action-done">
                ✕ REJECTED
            </span>

        `;

    }

    return '';

}


/* =========================
   LOAD BOOKINGS
========================= */

async function load() {

    if (!key()) {

        return showLogin();

    }

    try {

        const r = await fetch(
            API + '/bookings',
            {

                headers: {

                    'X-Admin-Key': key()

                }

            }
        );

        const data = await r.json();

        if (r.status === 401) {

            sessionStorage.removeItem(
                'chende_admin_key'
            );

            return showLogin();

        }

        if (!r.ok) {

            throw Error(
                data.error || 'Failed to load bookings'
            );

        }


        /* =========================
           STATISTICS
        ========================= */

        const total = data.length;

        const pending = data.filter(
            x => x.status === 'pending'
        ).length;

        const accepted = data.filter(
            x => x.status === 'accepted'
        ).length;

        const rejected = data.filter(
            x => x.status === 'rejected'
        ).length;


        document.getElementById(
            'count'
        ).textContent = total;


        document.getElementById(
            'pending'
        ).textContent = pending;


        const acceptedElement =
            document.getElementById('accepted');


        const rejectedElement =
            document.getElementById('rejected');


        if (acceptedElement) {

            acceptedElement.textContent =
                accepted;

        }


        if (rejectedElement) {

            rejectedElement.textContent =
                rejected;

        }


        /* =========================
           BOOKING TABLE
        ========================= */

        const rows =
            document.getElementById('rows');


        rows.innerHTML = data.map(x => {

            const displayDate =
                formatDate(x.event_date);


            const displayTime =
                formatTime(x.start_time);


            return `

                <tr>

                    <td>
                        #${esc(x.id)}
                    </td>


                    <td>

                        <strong>
                            ${esc(x.customer_name)}
                        </strong>

                        <br>

                        <small>
                            ☎ ${esc(x.phone)}
                        </small>

                        ${
                            x.email
                            ? `
                                <br>
                                <small>
                                    ✉ ${esc(x.email)}
                                </small>
                              `
                            : `
                                <br>
                                <small class="muted">
                                    Email not provided
                                </small>
                              `
                        }

                    </td>


                    <td>
                        ${esc(x.event_type)}
                    </td>


                    <td>

                        ${displayDate}

                        <br>

                        <small>
                            ${displayTime}
                        </small>

                    </td>


                    <td>
                        ${esc(x.location)}
                    </td>


                    <td>

                        <span
                            class="badge ${esc(x.status)}">

                            ${esc(x.status)}

                        </span>

                    </td>


                    <td class="actions">

                        ${actions(x)}

                    </td>

                </tr>

            `;

        }).join('') || `

            <tr>

                <td colspan="7">
                    No bookings yet.
                </td>

            </tr>

        `;


    } catch (e) {

        document.getElementById(
            'rows'
        ).innerHTML = `

            <tr>

                <td colspan="7">
                    Unable to load bookings.
                    Check that the backend is running.
                </td>

            </tr>

        `;

    }

}


/* =========================
   START
========================= */

if (key()) {

    showApp();

} else {

    showLogin();

}


/* =========================
   AUTO REFRESH
========================= */

setInterval(() => {

    if (
        key() &&
        !loginScreen.classList.contains('hidden')
    ) {
        return;
    }

    if (key()) {
        load();
    }

}, 15000);