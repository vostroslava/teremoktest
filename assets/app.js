
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwnQR15r9C6AwTp_eYY3RV6uNKu7FaYt0xSra776uZS70rifwMxLKpfDyW0Ls85f5EQ/exec";

let leadData = null;
let testSubmitted = false;

// Управление скроллом страницы в зависимости от открытых модал
function adjustBodyScroll() {
    const lead = document.getElementById('leadModal');
    const test = document.getElementById('testModal');
    const privacy = document.getElementById('privacyModal');

    const anyOpen = [lead, test, privacy].some(m => m && m.classList.contains('open'));
    document.body.style.overflow = anyOpen ? 'hidden' : '';
}

// Открыть модал заявки
function openLeadModal(source) {
    const modal = document.getElementById('leadModal');
    if (!modal) return;

    modal.classList.add('open');

    const banner = document.getElementById('testAccessBanner');
    if (banner) {
        banner.style.display = (source === 'test') ? 'block' : 'none';
    }

    adjustBodyScroll();
}

// Закрыть модал заявки
function closeLeadModal() {
    const modal = document.getElementById('leadModal');
    if (!modal) return;
    modal.classList.remove('open');
    adjustBodyScroll();
}

// Открыть модал с тестом
function openTestModal() {
    const modal = document.getElementById('testModal');
    if (!modal) return;

    modal.classList.add('open');

    const resultEl = document.getElementById('testResult');
    const nextStepEl = document.getElementById('testNextStep');
    const tgBlock = document.getElementById('testTelegramBlock');
    const tgNote = document.getElementById('testTelegramNote');

    if (resultEl) resultEl.textContent = '';
    if (nextStepEl) nextStepEl.style.display = 'none';
    if (tgBlock) tgBlock.style.display = 'none';
    if (tgNote) tgNote.style.display = 'none';

    const testForm = document.getElementById('miniTestForm');
    if (testForm) {
        testForm.reset();
    }

    const submitBtn = document.querySelector('#miniTestForm button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Получить результат';
    }

    testSubmitted = false;
    adjustBodyScroll();
}

// Закрыть модал теста
function closeTestModal() {
    const modal = document.getElementById('testModal');
    if (!modal) return;
    modal.classList.remove('open');
    adjustBodyScroll();
}

// Открыть модал политики конфиденциальности
function openPrivacyModal() {
    const modal = document.getElementById('privacyModal');
    if (!modal) return;
    modal.classList.add('open');
    adjustBodyScroll();
}

// Закрыть модал политики конфиденциальности
function closePrivacyModal() {
    const modal = document.getElementById('privacyModal');
    if (!modal) return;
    modal.classList.remove('open');
    adjustBodyScroll();
}

// Обработка отправки формы заявки
function onLeadFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    leadData = Object.fromEntries(formData.entries());

    // после регистрации открываем тест
    closeLeadModal();
    openTestModal();
}

// Логика мини-теста
function submitMiniTest() {
    if (testSubmitted) {
        return;
    }

    const types = { ptica: 0, homiak: 0, lisa: 0, profi: 0 };
    const questions = ['q1','q2','q3','q4','q5','q6','q7','q8'];

    for (const q of questions) {
        const checked = document.querySelector('input[name="' + q + '"]:checked');
        if (checked && types.hasOwnProperty(checked.value)) {
            types[checked.value]++;
        }
    }

    let mainType = null;
    let maxScore = -1;
    for (const key in types) {
        if (types[key] > maxScore) {
            maxScore = types[key];
            mainType = key;
        }
    }

    const typeNames = {
        ptica: 'Птица',
        homiak: 'Хомяк',
        lisa: 'Лиса',
        profi: 'Профи'
    };

    const typeDescriptions = {
        ptica: 'Он работает в основном под принуждением и быстро «проседает», если ослабить контроль. Инициативу почти не проявляет, задачи тянет до последнего, в конфликтных ситуациях уходит от ответственности. При большом количестве таких людей отдел перегружается напоминаниями и «подталкиваниями» вместо результата. На программе «Теремок» мы показываем, как выстроить систему, где Птицы не забирают ресурс у Профи и лидеров, и принимаем решения по таким сотрудникам в контексте всей команды.',
        homiak: 'Для него в фокусе прежде всего деньги и личная выгода. Пока система бонусов выгодна, он работает, но при малейшем изменении условий может резко «остыть» или начать искать, где платят больше. В клиентах и задачах чаще видит источник дохода, а не ответственность за результат. На «Теремке» мы разбираем, в каких ролях Хомяки допустимы, где они опасны и как не строить систему так, чтобы бизнес стал заложником их аппетитов.',
        lisa: 'Для него важнее статус, влияние и личная позиция, чем стабильный рабочий результат. Он тонко чувствует, «кто решает», стремится быть ближе к руководству, хорошо выглядит на совещаниях и в переписке, но реальный вклад в общую работу может быть нестабилен. В управленческой команде избыток таких людей создаёт интриги и ощущение хаоса. На программе «Теремок» мы разбираем, как встроить Лис в систему так, чтобы использовать их сильные стороны, не отдавая им ключевой контроль за результатом.',
        profi: 'Он делает по совести, опирается на задачу, качество и результат компании. Берёт ответственность, стабильно держит уровень, сам следит за сроками и деталями, не перекладывает ошибки на других. Часто именно на таких людях тихо держатся ключевые процессы и клиентские отношения, из-за чего они рискуют выгореть. На «Теремке» мы помогаем увидеть ядро из Профи и лидеров в вашей команде, разгрузить их от лишнего и выстроить вокруг них правильную конфигурацию команды.'
    };

    const typeName = typeNames[mainType] || 'этот типаж';
    const description = typeDescriptions[mainType] || '';
    const resultText = 'По вашим ответам этот сотрудник ближе всего к типажу «' + typeName + '». ' + description;

    const resultEl = document.getElementById('testResult');
    if (resultEl) {
        resultEl.innerHTML = resultText;
    }

    const nextStepEl = document.getElementById('testNextStep');
    if (nextStepEl) {
        nextStepEl.style.display = 'block';
    }

    const tgBlock = document.getElementById('testTelegramBlock');
    if (tgBlock) {
        tgBlock.style.display = 'flex';
    }

    const tgNote = document.getElementById('testTelegramNote');
    if (tgNote) {
        tgNote.style.display = 'block';
    }

    const submitBtn = document.querySelector('#miniTestForm button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Результат получен';
    }

    sendToGoogleSheet(mainType, types, resultText);
    testSubmitted = true;
}

// Отправка данных в Google Script
function sendToGoogleSheet(mainType, types, resultText) {
    const fd = new FormData();

    if (leadData) {
        fd.append('name',       leadData.name       || '');
        fd.append('role',       leadData.role       || '');
        fd.append('company',    leadData.company    || '');
        fd.append('team_size',  leadData.team_size  || '');
        fd.append('phone',      leadData.phone      || '');
        fd.append('messenger',  leadData.messenger  || '');
        fd.append('email',      leadData.email      || '');
        fd.append('request',    leadData.request    || '');
    } else {
        fd.append('name',      '');
        fd.append('role',      '');
        fd.append('company',   '');
        fd.append('team_size', '');
        fd.append('phone',     '');
        fd.append('messenger', '');
        fd.append('email',     '');
        fd.append('request',   '');
    }

    fd.append('test_main_type', mainType    || '');
    fd.append('test_main_text', resultText  || '');
    fd.append('test_ptica',     types.ptica || 0);
    fd.append('test_homiak',    types.homiak|| 0);
    fd.append('test_lisa',      types.lisa  || 0);
    fd.append('test_profi',     types.profi || 0);

    fetch(SCRIPT_URL, {
        method: 'POST',
        body: fd,
        mode: 'no-cors'
    }).catch(function (err) {
        console.error('Ошибка отправки в Google Script', err);
    });
}

// Инициализация полоски отсчёта времени до мероприятия
function initEventCountdown() {
    const textEl = document.getElementById('eventCountdownText');
    const barEl = document.getElementById('eventCountdownFill');
    if (!textEl || !barEl) return;

    // 18 декабря 2025, 10:00 — локальное время
    const eventStart = new Date(2025, 11, 18, 10, 0, 0);
    const windowMs = 30 * 24 * 60 * 60 * 1000; // 30 дней до события как "полная шкала"

    function formatUnit(value, forms) {
        const v = Math.abs(value) % 100;
        const v1 = v % 10;
        if (v > 10 && v < 20) return value + ' ' + forms[2];
        if (v1 > 1 && v1 < 5) return value + ' ' + forms[1];
        if (v1 === 1) return value + ' ' + forms[0];
        return value + ' ' + forms[2];
    }

    function updateCountdown() {
        const now = new Date();
        let diff = eventStart - now;

        if (diff <= 0) {
            textEl.textContent = 'мероприятие уже началось или прошло';
            barEl.style.width = '100%';
            barEl.setAttribute('aria-valuenow', '100');
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        diff -= days * 1000 * 60 * 60 * 24;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        diff -= hours * 1000 * 60 * 60;
        const minutes = Math.floor(diff / (1000 * 60));

        let parts = [];
        if (days > 0) {
            parts.push(formatUnit(days, ['день', 'дня', 'дней']));
        }
        if (hours > 0) {
            parts.push(formatUnit(hours, ['час', 'часа', 'часов']));
        }
        if (days === 0 && hours === 0 && minutes > 0) {
            parts.push(formatUnit(minutes, ['минута', 'минуты', 'минут']));
        }

        textEl.textContent = parts.length ? parts.join(' ') : 'меньше минуты';

        let remainingForWindow = eventStart - now;
        if (remainingForWindow > windowMs) {
            remainingForWindow = windowMs;
        }
        if (remainingForWindow < 0) {
            remainingForWindow = 0;
        }

        const percent = 100 - (remainingForWindow / windowMs) * 100;
        const clamped = Math.max(0, Math.min(100, percent));

        barEl.style.width = clamped.toFixed(0) + '%';
        barEl.setAttribute('aria-valuenow', clamped.toFixed(0));
    }

    updateCountdown();
    setInterval(updateCountdown, 60000);
}

document.addEventListener('DOMContentLoaded', function () {
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', onLeadFormSubmit);
    }

    const miniTestForm = document.getElementById('miniTestForm');
    if (miniTestForm) {
        miniTestForm.addEventListener('submit', function (e) {
            e.preventDefault();
            submitMiniTest();
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;

        const privacy = document.getElementById('privacyModal');
        const test    = document.getElementById('testModal');
        const lead    = document.getElementById('leadModal');

        // Сначала закрываем верхнее окно политики, если оно открыто
        if (privacy && privacy.classList.contains('open')) {
            closePrivacyModal();
            return;
        }

        // Потом — окно с тестом
        if (test && test.classList.contains('open')) {
            closeTestModal();
            return;
        }

        // И только потом — окно регистрации
        if (lead && lead.classList.contains('open')) {
            closeLeadModal();
        }
    });

    const animated = document.querySelectorAll('[data-animate]');
    if ('IntersectionObserver' in window && animated.length > 0) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        animated.forEach(el => observer.observe(el));
    } else {
        animated.forEach(el => el.classList.add('in-view'));
    }

    // Testimonials & experts accordion
    const testimonialHeaders = document.querySelectorAll('.testimonial-header');
    testimonialHeaders.forEach(header => {
        header.addEventListener('click', function () {
            const item = header.closest('.testimonial-item');
            const isOpen = item.classList.contains('open');

            document.querySelectorAll('.testimonial-item.open').forEach(other => {
                if (other !== item) {
                    other.classList.remove('open');
                }
            });

            if (!isOpen) {
                item.classList.add('open');
            } else {
                item.classList.remove('open');
            }
        });
    });

    // Инициализируем отсчёт до мероприятия
    initEventCountdown();
});
