const datepicker = (() => {
    'use strict'
    const arr_month     = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const arr_days      = ["S","M","T","W","T","F","S"];
    const thead         = document.getElementById('js__day-of-week');
    const tbody         = document.getElementById('js__days');
    const p_name        = document.getElementById('js__month-year');
    const prev          = document.getElementById('js__prev');
    const next          = document.getElementById('js__next');
    const prev_year     = document.getElementById('js__prev-year');
    const next_year     = document.getElementById('js__next-year');
    const date          = document.getElementById('js__task-date');
    const frag          = document.createDocumentFragment();
    let d = new Date();
    let m = d.getMonth();
    let y = d.getFullYear();

    const __prev = () => {
        if ( m > 0 ) {
            m = m-1;
            __caledar(m);
        }
    }

    const __next = () => {
        if ( m < 11 ) {
            m = m+1;
            __caledar(m);
        }
    }

    const __nextYear = () => {
            y = y+1;
            __caledar(m);
    }

    const __prevYear = () => {
        y = y-1;
        __caledar(m);
    }
      

    const __removeDuplicate = (day) => {
        const last = document.querySelectorAll(`#day-${day}`);
        if(prev || next || next_year || prev_year) {
            if (last.length === 2) {
                [...last].find((last, key) => key === 1).remove();   
            }
        }
    }

    const __daysOfTheWeek = () => {
        const tr = document.createElement("TR");
        thead.appendChild(tr);
        for ( let i = 0; i < 7; i++ ) {
            const td = document.createElement("TD");
            td.innerHTML = arr_days[i];
            td.setAttribute('class', 'day-of-week')
            frag.appendChild(td);
        }
        tr.appendChild(frag);
    }

    const __caledar = (month) => {
        let short_name = arr_month[month];
        let f_days = new Date(y, m, 1).getDay();
        let l_days = new Date(y, m+1, 0).getDate();
        let offSet = f_days;
        let dayCount = 1;

        if ( month == null ) {
            p_name.innerHTML = arr_month[m] + " " + y;
        } else {
            p_name.innerHTML = short_name + " " + y;
        }
        tbody.innerHTML = '';
        for ( let j = 0; j < 6; j++ ) {
            const tr_w = document.createElement("TR");
            tbody.appendChild(tr_w);

            for ( let rw = 0; rw < 7; rw++ ) {
                if (offSet === 0) {
                    const td_rw = document.createElement("TD");
                    const btn = document.createElement("BUTTON");
                    btn.setAttribute('class', 'day-of-month');
                    tr_w.appendChild(td_rw);
                    btn.innerHTML = dayCount;
                    btn.setAttribute('id', 'day-' + dayCount );
                    btn.addEventListener('click', (e) => {
                        const b = document.getElementById(e.target.id);
                        if ( month == null ) {
                            date.innerHTML = b.innerText + " " + arr_month[m] + " " + y;
                        } else {
                            date.innerHTML = b.innerText + " " + short_name + " " + y;
                        }
                        __selected(e);
                    });
                    td_rw.appendChild(btn);

                    if ( dayCount == l_days ) {
                        break;
                    }
                    dayCount++;
                } else {
                    const td_empty = document.createElement("TD");
                    tr_w.appendChild(td_empty);
                    offSet--;
                }
            }
        }

        if (m == 11) {
            l_days.style.color = 'red';
        }

        if ( m <= 1 ) {
            prev.classList.add('hide');
            prev_year.classList.remove('hide');
        } else {
            prev.classList.remove('hide');
            prev_year.classList.add('hide');
        }
        if ( m >= 11 ) {
            next.classList.add('hide');
            next_year.classList.remove('hide');
        } else {
            next.classList.remove('hide');
            next_year.classList.add('hide');            
        }
        prev.addEventListener('click', __prev);
        next.addEventListener('click', __next);
        next_year.addEventListener('click', __nextYear);
        prev_year.addEventListener('click', __prevYear);
        __removeDuplicate(l_days);
    }

    const __selected = (e) => {
        const btn = document.querySelectorAll('.day-of-month');
        [].forEach.call(btn, (el) => {
            el.classList.remove('selected');
        });
        e.target.classList.add('selected');
        
    }

    const bindEvents = () => {
        __daysOfTheWeek();
        __caledar();
    }

    return {
        caledar: __caledar,
        bindEvents: bindEvents
    }

})();
datepicker.bindEvents();