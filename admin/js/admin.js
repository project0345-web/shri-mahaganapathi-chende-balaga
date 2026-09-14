const API =
    'https://shri-mahaganapathi-chende-balaga.onrender.com/api';

const key = () =>
    sessionStorage.getItem('chende_admin_key');

const loginScreen =
    document.getElementById('loginScreen');


/* =========================================================
   SHOW / HIDE APP
========================================================= */

function showApp() {

    loginScreen?.classList.add('hidden');

    load();

}


function showLogin() {

    loginScreen?.classList.remove('hidden');

}


/* =========================================================
   PARTICLES
========================================================= */

function makeParticles() {

    const box =
        document.getElementById('particles');

    if (!box) return;


    for (let i = 0; i < 34; i++) {

        const p =
            document.createElement('i');


        p.style.left =
            Math.random() * 100 + '%';


        p.style.animationDelay =
            (-Math.random() * 11) + 's';


        p.style.animationDuration =
            (8 + Math.random() * 8) + 's';


        p.style.opacity =
            0.2 + Math.random() * 0.5;


        box.appendChild(p);

    }

}

makeParticles();


/* =========================================================
   CURSOR GLOW
========================================================= */

window.addEventListener(
    'mousemove',
    e => {

        const glow =
            document.getElementById(
                'cursorGlow'
            );


        if (glow) {

            glow.style.left =
                e.clientX + 'px';

            glow.style.top =
                e.clientY + 'px';

        }

    }
);


/* =========================================================
   LOADER
========================================================= */

window.addEventListener(
    'load',
    () => {

        setTimeout(
            () => {

                document
                    .getElementById('loader')
                    ?.classList.add('hide');

            },
            700
        );

    }
);


/* =========================================================
   LOGIN
========================================================= */

document
    .getElementById('loginForm')
    ?.addEventListener(
        'submit',
        async e => {

            e.preventDefault();


            const msg =
                document.getElementById(
                    'loginMsg'
                );


            const password =
                document.getElementById(
                    'adminPassword'
                );


            msg.textContent =
                'Signing in…';


            try {

                const response =
                    await fetch(
                        API + '/admin/login',
                        {

                            method: 'POST',

                            headers: {
                                'Content-Type':
                                    'application/json'
                            },

                            body:
                                JSON.stringify({
                                    password:
                                        password.value
                                })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.error ||
                        'Login failed'
                    );

                }


                sessionStorage.setItem(
                    'chende_admin_key',
                    data.key
                );


                password.value = '';

                msg.textContent = '';

                showApp();

            } catch (error) {

                msg.textContent =
                    error.message;

            }

        }
    );


/* =========================================================
   LOGOUT
========================================================= */

document
    .getElementById('logoutBtn')
    ?.addEventListener(
        'click',
        () => {

            sessionStorage.removeItem(
                'chende_admin_key'
            );

            showLogin();

        }
    );


/* =========================================================
   ESCAPE HTML
========================================================= */

function esc(value) {

    return String(
        value ?? ''
    ).replace(
        /[&<>"']/g,
        character => ({

            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'

        }[character])
    );

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(dateValue) {

    if (!dateValue) {

        return '';

    }


    try {

        const date =
            new Date(dateValue);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return esc(dateValue);

        }


        return date.toLocaleDateString(
            'en-GB',
            {

                day: '2-digit',

                month: 'long',

                year: 'numeric',

                timeZone: 'UTC'

            }
        );

    } catch (error) {

        return esc(dateValue);

    }

}


/* =========================================================
   FORMAT TIME
========================================================= */

function formatTime(timeValue) {

    if (!timeValue) {

        return '';

    }


    const parts =
        String(timeValue)
            .split(':');


    if (parts.length < 2) {

        return esc(timeValue);

    }


    let hours =
        parseInt(
            parts[0],
            10
        );


    const minutes =
        parts[1];


    if (Number.isNaN(hours)) {

        return esc(timeValue);

    }


    const period =
        hours >= 12
            ? 'PM'
            : 'AM';


    hours =
        hours % 12;


    if (hours === 0) {

        hours = 12;

    }


    return `${hours}:${minutes} ${period}`;

}


/* =========================================================
   ACCEPT / REJECT BOOKING
========================================================= */

async function setStatus(
    id,
    status
) {

    const labels = {

        accepted: 'Accept',

        rejected: 'Reject'

    };


    const action =
        labels[status];


    if (!action) {

        return;

    }


    const confirmed =
        confirm(
            `${action} booking #${id}?`
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API}/bookings/${id}/status`,
                {

                    method: 'PATCH',

                    headers: {

                        'Content-Type':
                            'application/json',

                        'X-Admin-Key':
                            key()

                    },

                    body:
                        JSON.stringify({
                            status
                        })

                }
            );


        const data =
            await response.json();


        /* =========================
           ADMIN SESSION EXPIRED
        ========================= */

        if (
            response.status === 401
        ) {

            sessionStorage.removeItem(
                'chende_admin_key'
            );

            showLogin();

            return;

        }


        /* =========================
           BACKEND ERROR
        ========================= */

        if (!response.ok) {

            throw new Error(
                data.error ||
                'Could not update booking.'
            );

        }


        /* =========================
           REFRESH DASHBOARD
        ========================= */

        await load();


    } catch (error) {

        alert(
            error.message
        );

    }

}


/* =========================================================
   ACTION BUTTONS
========================================================= */

function actions(booking) {

    /*
       PENDING BOOKINGS:
       ACCEPT + REJECT
    */

    if (
        booking.status ===
        'pending'
    ) {

        return `

            <button
                class="action confirm"
                onclick="setStatus(${booking.id}, 'accepted')">

                ✓ ACCEPT

            </button>

            <button
                class="action cancel"
                onclick="setStatus(${booking.id}, 'rejected')">

                ✕ REJECT

            </button>

        `;

    }


    /*
       ACCEPTED BOOKINGS:
       NO MORE ACTIONS
    */

    if (
        booking.status ===
        'accepted'
    ) {

        return `

            <span class="action-done">

                ✓ ACCEPTED

            </span>

        `;

    }


    /*
       REJECTED BOOKINGS:
       NO MORE ACTIONS
    */

    if (
        booking.status ===
        'rejected'
    ) {

        return `

            <span class="action-done">

                ✕ REJECTED

            </span>

        `;

    }


    /*
       Unknown/old database status.
    */

    return '';

}


/* =========================================================
   LOAD BOOKINGS
========================================================= */

async function load() {

    if (!key()) {

        showLogin();

        return;

    }


    try {

        const response =
            await fetch(
                API + '/bookings',
                {

                    headers: {

                        'X-Admin-Key':
                            key()

                    }

                }
            );


        const data =
            await response.json();


        /* =========================
           SESSION EXPIRED
        ========================= */

        if (
            response.status === 401
        ) {

            sessionStorage.removeItem(
                'chende_admin_key'
            );

            showLogin();

            return;

        }


        if (!response.ok) {

            throw new Error(
                data.error ||
                'Failed to load bookings'
            );

        }


        /* =========================
           SAFETY CHECK
        ========================= */

        if (!Array.isArray(data)) {

            throw new Error(
                'Invalid booking data received.'
            );

        }


        /* =================================================
           STATISTICS
        ================================================= */

        const total =
            data.length;


        const pending =
            data.filter(
                booking =>
                    booking.status ===
                    'pending'
            ).length;


        const accepted =
            data.filter(
                booking =>
                    booking.status ===
                    'accepted'
            ).length;


        const rejected =
            data.filter(
                booking =>
                    booking.status ===
                    'rejected'
            ).length;


        /* =========================
           TOTAL
        ========================= */

        const countElement =
            document.getElementById(
                'count'
            );


        if (countElement) {

            countElement.textContent =
                total;

        }


        /* =========================
           PENDING
        ========================= */

        const pendingElement =
            document.getElementById(
                'pending'
            );


        if (pendingElement) {

            pendingElement.textContent =
                pending;

        }


        /* =========================
           ACCEPTED
        ========================= */

        const acceptedElement =
            document.getElementById(
                'accepted'
            );


        if (acceptedElement) {

            acceptedElement.textContent =
                accepted;

        }


        /* =========================
           REJECTED
        ========================= */

        const rejectedElement =
            document.getElementById(
                'rejected'
            );


        if (rejectedElement) {

            rejectedElement.textContent =
                rejected;

        }


        /* =================================================
           BOOKING TABLE
        ================================================= */

        const rows =
            document.getElementById(
                'rows'
            );


        if (!rows) {

            return;

        }


        rows.innerHTML =
            data
                .map(
                    booking => {

                        const displayDate =
                            formatDate(
                                booking.event_date
                            );


                        const displayTime =
                            formatTime(
                                booking.start_time
                            );


                        return `

                            <tr>

                                <!-- BOOKING ID -->

                                <td>

                                    #${esc(
                                        booking.id
                                    )}

                                </td>


                                <!-- CUSTOMER -->

                                <td>

                                    <strong>

                                        ${esc(
                                            booking.customer_name
                                        )}

                                    </strong>

                                    <br>

                                    <small>

                                        ☎ ${esc(
                                            booking.phone
                                        )}

                                    </small>

                                    ${
                                        booking.email

                                        ? `

                                            <br>

                                            <small>

                                                ✉ ${esc(
                                                    booking.email
                                                )}

                                            </small>

                                          `

                                        : `

                                            <br>

                                            <small
                                                class="muted">

                                                Email not provided

                                            </small>

                                          `
                                    }

                                </td>


                                <!-- EVENT -->

                                <td>

                                    ${esc(
                                        booking.event_type
                                    )}

                                </td>


                                <!-- DATE / TIME -->

                                <td>

                                    ${displayDate}

                                    <br>

                                    <small>

                                        ${displayTime}

                                    </small>

                                </td>


                                <!-- LOCATION -->

                                <td>

                                    ${esc(
                                        booking.location
                                    )}

                                </td>


                                <!-- STATUS -->

                                <td>

                                    <span
                                        class="badge ${esc(
                                            booking.status
                                        )}">

                                        ${esc(
                                            booking.status
                                        )}

                                    </span>

                                </td>


                                <!-- ACTIONS -->

                                <td
                                    class="actions">

                                    ${actions(
                                        booking
                                    )}

                                </td>

                            </tr>

                        `;

                    }
                )
                .join('');


        /* =========================
           EMPTY TABLE
        ========================= */

        if (!data.length) {

            rows.innerHTML = `

                <tr>

                    <td colspan="7">

                        No bookings yet.

                    </td>

                </tr>

            `;

        }


    } catch (error) {

        console.error(
            'Load bookings error:',
            error
        );


        const rows =
            document.getElementById(
                'rows'
            );


        if (rows) {

            rows.innerHTML = `

                <tr>

                    <td colspan="7">

                        Unable to load bookings.
                        Check that the backend is running.

                    </td>

                </tr>

            `;

        }

    }

}


/* =========================================================
   START
========================================================= */

if (key()) {

    showApp();

} else {

    showLogin();

}


/* =========================================================
   AUTO REFRESH
   Every 15 seconds
========================================================= */

setInterval(
    () => {

        if (key()) {

            load();

        }

    },
    15000
);