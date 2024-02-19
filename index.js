const FAQ = [
    {
        q: "How much does Photoshop cost?",
        a: "Plans start at US$22.99/mo."
    },
    {
        q: "Can you use Photoshop to edit videos?",
        a: "Yes, you can use Photoshop to edit videos."
    },
    {
        q: "Is Photoshop available without a subscription?",
        a: "Photoshop is only available as part of a Creative Cloud plan, which includes the latest features, updates, fonts, and more."
    }
];

function processBackgroundColor(el) {
    if (!el.firstElementChild) return; // Ensure there's a first child
    el.style.background = el.firstElementChild.textContent.trim();
    el.removeChild(el.firstElementChild);
}

// Function to process elements with links and styles
function processElementLinks(paragraphs) {
    paragraphs.forEach(paragraph => {
        paragraph.querySelectorAll('a').forEach(link => {
            const parentTag = link.closest('b, i');
             if (parentTag) {
                if (parentTag.tagName.toLowerCase() === 'b') {
                    link.classList.add('blue'); // Add 'con-button' and 'blue' for <b> parent
                } 
                link.classList.add('con-button'); // Just add 'con-button' for <i>
                parentTag.before(link);
                parentTag.remove(); 
            } 
        });
    });
}

function processHero(el) {
    processBackgroundColor(el);
    const paragraphs = el.querySelectorAll('p');
    paragraphs.forEach(p => p.querySelector('a') && p.classList.add('action-area'));
    processElementLinks(paragraphs); 
}

function processBrick(el) {
    processBackgroundColor(el);
    const paragraphs = [...el.querySelectorAll('p')];
    if (paragraphs.length < 3) {
        console.error('Brick div does not contain 3 paragraphs.');
        return;
    }
    ['title', 'price', 'description'].forEach((className, index) => paragraphs[index].classList.add(className));
}

// Function throttle to help reduce the workload during scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}
function processBanner(el) {
    processElementLinks([el]); 
    const hero = document.querySelector('.hero');
    const toggleBannerVisibility = () => {
        const heroRect = hero.getBoundingClientRect();
        
        if (heroRect.top + heroRect.height < 0) {
            el.classList.add('sticky-banner'); 
            el.style.display = 'block';
        } else {
            el.classList.remove('sticky-banner'); 
            el.style.display = 'none';
        }
    };
    window.addEventListener('scroll', throttle(toggleBannerVisibility, 100));
}

function processFaq(el) {
    // Insert the FAQ content
    el.innerHTML = `<div class="faq-container">${
        FAQ.map(faq => `
            <div class="faq-set">
                <div class="question" tabindex="0" aria-expanded="false"><h3>${faq.q}</h3></div>
                <div class="answer" style="display: none;"><p>${faq.a}</p></div>
            </div>`
        ).join('')
    }</div>`;
    el.addEventListener('click', event => {
        const clickedQuestion = event.target.closest('.question');
        if (!clickedQuestion) return;

        const clickedAnswer = clickedQuestion.nextElementSibling;
        const isExpanded = clickedQuestion.getAttribute('aria-expanded') === 'true';
        clickedQuestion.classList.toggle('rotated', !isExpanded);
        clickedQuestion.setAttribute('aria-expanded', String(!isExpanded));
        clickedAnswer.style.display = isExpanded ? 'none' : 'block';

        const allQuestions = el.querySelectorAll('.question');
        allQuestions.forEach(question => {
            if (question !== clickedQuestion) {
                const answer = question.nextElementSibling;
                if (question.getAttribute('aria-expanded') === 'true') {
                    question.classList.remove('rotated');
                    question.setAttribute('aria-expanded', 'false');
                    answer.style.display = 'none';
                }
            }
        });
    });
}
document.querySelectorAll('.hero').forEach(processHero);
document.querySelectorAll('.brick').forEach(processBrick);
document.querySelectorAll('.faq').forEach(processFaq);
document.querySelectorAll('.banner').forEach(processBanner);